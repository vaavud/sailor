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
  saveSession, saveSummary, savePoints
} from '../../../actions/measure'


import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager'

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
      trueLastWindDirection: 0
    }

    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onReadyToWork = this.onReadyToWork.bind(this)
    this.onNewRead = this.onNewRead.bind(this)
    this.onFinalData = this.onFinalData.bind(this)
    this.onLocationWorking = this.onLocationWorking.bind(this)
    this._onStopMeasurement = this._onStopMeasurement.bind(this)
    this.onBleState = this.onBleState.bind(this)
  }

  componentDidMount() {
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    this.state.myModuleEvt.addListener('onBleState', this.onBleState)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)
    this.state.myModuleEvt.addListener('onLocationWorking', this.onLocationWorking)
    this.state.myModuleEvt.addListener('onFinalData', this.onFinalData)

    NativeModules.VaavudBle.initBle()
  }



  onBleState(data) {
    switch (data.status) {
      case 'off':
        Alert.alert('Bluetooth Error', 'Haha!! Einstein... you want to use a Bluetooth device with Bluetooth off!', [{ text: 'OK' }])
        break
      case 'unauthorized':
        Alert.alert('Bluetooth Error', 'Come on! i promise you not to send all the information to our server :), give us authorization (go to settings and change it)', [{ text: 'OK' }])
        break
    }
  }

  onFinalData(data) {

    let windMin = 0

    this.props.saveSession(data.session)
      .then(key => {
        let summary = {
          key,
          windMin,
          windMax: data.session.windMax,
          speeds: data.speeds,
          directions: data.directions,
          locations: data.locations
        }
        return this.props.saveSummary(summary)
      })
      .then(key => this.props.savePoints(data.measurementPoints, key))
      .then(key => this.props.push({ key: 'summary', props: { sessionKey: key } }))
  }

  onLocationWorking(location) {
    if (location.available) {
      console.log('Location working')
      this.setState({ locationReady: true })
    }
    else {
      console.log('please eneble your location')
    }
  }

  componentWillUnmount() {
    // this._onStopMeasurement()
  }

  _onStopMeasurement() {
    // navigator.geolocation.clearWatch(this.positionListener)
    NativeModules.VaavudBle.onDisconnect()
    // // this.state.myModuleEvt.removeAllListeners('onBleConnected')
    // // this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    // this.state.myModuleEvt.removeAllListeners('onNewRead')
    // this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    // this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')

    // if (!this.state.readyToWork) return

    // this.props.endSession(this.state.points).then(res => {
    //   if (res.success) {
    //     this.props.push({ key: 'summary', props: { sessionKey: res.key } })

    //     console.log('go to summary with key: ', res.key)
    //   }
    //   else {
    //     console.log('go back, there was a problem with the server')
    //   }
    // })
  }

  onVaavudBleFound(ble) {
    this.setState({ isBleConnected: true })
  }

  onReadyToWork() {
    this.setState({ readyToWork: true })
    // this.props.endSession()
    // this.props.initSession().then(() => {
    //   this.setState({ readyToWork: true })
    // })
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
      trueLastWindDirection: lastTrue
    })
    // }
  }

  _renderDotIndicator() {
    return <PagerDotIndicator pageCount={2} />
  }

  render() {

    if (this.state.isBleConnected && this.state.locationReady && this.state.readyToWork) {
      return (
        <View style={{ flex: 1 }}>
          <IndicatorViewPager
            indicator={this._renderDotIndicator()}
            style={{ flex: 1 }} >
            <TrueWindView windHeading={this.state.trueWindDirection} velocity={this.state.velocity} lastWindHeading={this.state.trueLastWindDirection} windSpeed={this.state.trueWindSpeed} testStop={this._onStopMeasurement} />
            <ApparentWindView windHeading={this.state.windDirection} velocity={this.state.velocity} lastWindHeading={this.state.lastWindDirection} windSpeed={this.state.windSpeed} testStop={this._onStopMeasurement} />
          </IndicatorViewPager>
        </View>
      )
    }
    else {
      return (
        <ConnectingView isBleReady={this.state.isBleConnected} isLocationReady={this.state.locationReady} />
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
    savePoints: bindActionCreators(savePoints, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Measure)
