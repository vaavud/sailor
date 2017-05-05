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


import {
  SpeedUnits, convertWindSpeed
} from '../../../reactcommon/utils'

const mapReduxStoreToProps = (reduxStore) => {
  return {
    windUnit: reduxStore.settings.windSpeed,
    offset: reduxStore.offset.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // initSession: bindActionCreators(initSession, dispatch),
    // endSession: bindActionCreators(endSession, dispatch),
    saveSession: bindActionCreators(saveSession, dispatch),
    saveSummary: bindActionCreators(saveSummary, dispatch),
    savePoints: bindActionCreators(savePoints, dispatch),
    goToMain: bindActionCreators(goToMain, dispatch)
  }
}



@connect(mapReduxStoreToProps, mapDispatchToProps)
export default class extends Component {

  state = {
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

  constructor(props) {
    super(props)
    this.myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
  }

  componentDidMount = () => {
    this.myModuleEvt.addListener('onBluetoothOff', this.onBluetoothOff)
    this.myModuleEvt.addListener('onNoDeviceFound', this.onNoDeviceFound)
    this.myModuleEvt.addListener('onDeviceFound', this.onDeviceFound)
    this.myModuleEvt.addListener('onReading', this.onReading)
    this.myModuleEvt.addListener('timeout', this.timeout)
    this.myModuleEvt.addListener('onCompleted', this.onCompleted)
    this.myModuleEvt.addListener('onFinalData', this.onFinalData)


    NativeModules.VaavudBle.readRowData(true, this.props.offset)
  }

  componentWillUnmount = () => {
    NativeModules.VaavudBle.onDisconnect()
    this.removeLiteners()
  }

  timeout = () => {
    console.log('timeOut')
  }

  removeLiteners = () => {
    this.myModuleEvt.removeAllListeners('onBluetoothOff')
    this.myModuleEvt.removeAllListeners('onNoDeviceFound')
    this.myModuleEvt.removeAllListeners('onDeviceFound')
    this.myModuleEvt.removeAllListeners('onReading')
    this.myModuleEvt.removeAllListeners('timeout')
    this.myModuleEvt.removeAllListeners('onCompleted')
    this.myModuleEvt.removeAllListeners('onFinalData')
  }

  onCompleted = () => {

  }

  onBluetoothOff = () => {
    this.setState({ timeout: true })
    Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON.', [{
      text: 'OK', onPress: () => { }
    }])
  }

  onNoDeviceFound = () => {
    NativeModules.VaavudBle.onDisconnect()
    this.setState({ timeout: true })

    Alert.alert('Bluetooth Error', 'We could not find your Ultrasonic, try later.', [{
      text: 'OK', onPress: () => {

      }
    }])
  }

  onDeviceFound = () => {
    this.setState({ isBleConnected: true, readyToWork: true })
  }

  onReading = point => {
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
  }

  onFinalData = data => {

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

  // onLocationWorking = location => {
  //   if (location.available) {
  //     this.setState({ locationReady: true })
  //   }
  //   else {
  //     console.log('please eneble your location')
  //   }
  // }

  _onStopMeasurement = () => {
    this.setState({ isLoading: true })
    NativeModules.VaavudBle.onStopSdk()
  }

  _renderDotIndicator = () => {
    return (
      <PagerDotIndicator
        dotStyle={{ backgroundColor: Colors.vaavudBlue, opacity: 0.5 }}
        selectedDotStyle={{ backgroundColor: Colors.vaavudBlue }}
        pageCount={2} />
    )
  }

  _jump = () => {
    this.removeLiteners()
    this.props.goToMain()
    // this.props.jump('history')
  }

  _tryAgin = () => {
    NativeModules.VaavudBle.readRowData(true, {})
    this.setState({ timeout: false })
  }

  render = () => {
    let windUnit = SpeedUnits[this.props.windUnit]
    let windSpeed = convertWindSpeed(this.state.windSpeed, this.props.windUnit).toFixed(1)
    let trueWindSpeed = convertWindSpeed(this.state.trueWindSpeed, this.props.windUnit).toFixed(1)
    let velocity = convertWindSpeed(this.state.velocity, this.props.windUnit).toFixed(1)

    if (this.state.isBleConnected && this.state.locationReady && this.state.readyToWork) {
      return (
        <View style={{ flex: 1 }}>
          <IndicatorViewPager
            indicator={this._renderDotIndicator()}
            style={{ flex: 1 }} >
            <ApparentWindView windHeading={this.state.windDirection} windUnit={windUnit} batteryLevel={this.state.battery} velocity={velocity} lastWindHeading={this.state.lastWindDirection} windSpeed={windSpeed} testStop={this._onStopMeasurement} />
            <TrueWindView windHeading={this.state.trueWindDirection} windUnit={windUnit} batteryLevel={this.state.battery} velocity={velocity} lastWindHeading={this.state.trueLastWindDirection} windSpeed={trueWindSpeed} testStop={this._onStopMeasurement} />
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