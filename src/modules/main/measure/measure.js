// @flow

'use strict'

import React, { Component } from 'react'
import {
  NativeEventEmitter,
  NativeModules,
  Alert,
  View,
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  saveSession, saveSummary, savePoints, goToMain
} from '../../../actions/measure'

import Colors from '../../../../assets/colorTheme'

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager'

import { NormalText } from '../../../components/text'
import LoadingModal from '../../../components/loadingModal'

import {
  TrueWindView,
  ApparentWindView,
  ConnectingView
} from '../../../views/main/measure'


class Measure extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)

    this.state = {
      myModuleEvt,
      readyToWork: false,
      isBleConnected: false,
      windSpeed: 0,
      windDirection: 0,
      lastWindDirection: 0,
      locationReady: true,
      velocity: 0,
      trueWindDirection: 0,
      trueWindSpeed: 0,
      trueLastWindDirection: 0,
      isLoading: false,
      timeout: false,
      battery: '-'
    }

    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onReadyToWork = this.onReadyToWork.bind(this)
    this.onNewRead = this.onNewRead.bind(this)
    this.onFinalData = this.onFinalData.bind(this)
    this.onLocationWorking = this.onLocationWorking.bind(this)
    this._onStopMeasurement = this._onStopMeasurement.bind(this)
    this.onBleState = this.onBleState.bind(this)
    this.timeout = this.timeout.bind(this)
    this._jump = this._jump.bind(this)
    this._tryAgin = this._tryAgin.bind(this)
    this.removeLiteners = this.removeLiteners.bind(this)
  }

  componentDidMount() {
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    this.state.myModuleEvt.addListener('onBleState', this.onBleState)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)
    this.state.myModuleEvt.addListener('onLocationWorking', this.onLocationWorking)
    this.state.myModuleEvt.addListener('onFinalData', this.onFinalData)
    this.state.myModuleEvt.addListener('timeout', this.timeout)

    NativeModules.VaavudBle.initBle()
  }


  timeout() {
    NativeModules.VaavudBle.onDisconnect()
    this.setState({ timeout: true })
  }

  onBleState(data) {
    switch (data.status) {
      case 'off':
        Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON', [{ text: 'OK', onPress: () => this.setState({ timeout: true }) }])
        break
      case 'unauthorized':
        Alert.alert('Bluetooth Error', 'In order to take a measurement please enable the Bluetooth permission.', [{ text: 'OK', onPress: () => this.setState({ timeout: true }) }])
        break
    }
  }

  onFinalData(data) {

    let windMin = 0

    this.removeLiteners()
    this.setState({ myModuleEvt: null })

    this.props.saveSession(data.session)
      .then(key => {
        let summary = {
          key,
          windMin,
          windMax: data.session.windMax,
          speeds: data.speeds,
          directions: data.directions,
          locations: data.locations,
          fromHistory: false
        }
        return this.props.saveSummary(summary)
      })
      .then(key => this.props.savePoints(data.measurementPoints, key))
      .then(key => {
        const { navigate } = this.props.navigation
        navigate('Summary', { sessionKey: key, windMean: data.session.windMean })
      })
  }

  onLocationWorking(location) {
    if (location.available) {
      this.setState({ locationReady: true })
    }
    else {
      console.log('please eneble your location')
    }
  }

  removeLiteners() {
    this.state.myModuleEvt.removeAllListeners('onBleState')
    this.state.myModuleEvt.removeAllListeners('onNewRead')
    this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')
    this.state.myModuleEvt.removeAllListeners('onLocationWorking')
    this.state.myModuleEvt.removeAllListeners('onFinalData')
    this.state.myModuleEvt.removeAllListeners('timeout')
  }

  _onStopMeasurement() {
    this.setState({ isLoading: true })
    NativeModules.VaavudBle.onDisconnect()
  }

  onVaavudBleFound(ble) {
    this.setState({ isBleConnected: true })
  }

  onReadyToWork() {
    this.setState({ readyToWork: true })
  }

  onNewRead(point) {
    // if (this.state.locationReady) {
    let last = this.state.windDirection
    let lastTrue = this.state.trueWindDirection
    this.setState({
      windSpeed: point.windSpeed,
      windDirection: point.windDirection,
      lastWindDirection: last,
      velocity: point.velocity,
      trueWindDirection: point.trueWindDirection,
      trueWindSpeed: point.trueWindSpeed,
      trueLastWindDirection: lastTrue,
      battery: point.battery
    })
    // }
  }

  _renderDotIndicator() {
    return (
      <PagerDotIndicator
        dotStyle={{ backgroundColor: Colors.vaavudBlue, opacity: 0.5 }}
        selectedDotStyle={{ backgroundColor: Colors.vaavudBlue }}
        pageCount={2} />
    )
  }

  _jump() {
    this.removeLiteners()
    this.props.goToMain()
    // this.props.jump('history')
  }

  _tryAgin() {
    NativeModules.VaavudBle.initBle()
    this.setState({ timeout: false })
  }

  render() {

    if (this.state.isBleConnected && this.state.locationReady && this.state.readyToWork) {
      return (
        <View style={{ flex: 1 }}>
          <IndicatorViewPager
            indicator={this._renderDotIndicator()}
            style={{ flex: 1 }} >
            <TrueWindView windHeading={this.state.trueWindDirection} batteryLevel={this.state.battery} velocity={this.state.velocity} lastWindHeading={this.state.trueLastWindDirection} windSpeed={this.state.trueWindSpeed} testStop={this._onStopMeasurement} />
            <ApparentWindView windHeading={this.state.windDirection} batteryLevel={this.state.battery} velocity={this.state.velocity} lastWindHeading={this.state.lastWindDirection} windSpeed={this.state.windSpeed} testStop={this._onStopMeasurement} />
          </IndicatorViewPager>
          <LoadingModal isActive={this.state.isLoading} message={'Processing measurement data...\n Note that processing time may vary depending on duration of the measurement session'} />
        </View>
      )
    }
    else {
      return (
        <ConnectingView
          isBleReady={this.state.isBleConnected}
          isLocationReady={this.state.locationReady}
          jump={this._jump}
          timeout={this.state.timeout}
          tryAgain={this._tryAgin} />
      )
    }
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // initSession: bindActionCreators(initSession, dispatch),
    // endSession: bindActionCreators(endSession, dispatch),
    saveSession: bindActionCreators(saveSession, dispatch),
    saveSummary: bindActionCreators(saveSummary, dispatch),
    savePoints: bindActionCreators(savePoints, dispatch),
    goToMain: bindActionCreators(goToMain, dispatch),
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Measure)
