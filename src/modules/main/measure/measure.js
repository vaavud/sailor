// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Button
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  saveSession, saveSummary, savePoints
} from '../../../actions/measure'


import { MeasureView, ConnectingView } from '../../../views/main/measure'


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
      locationReady: false,
    }

    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onReadyToWork = this.onReadyToWork.bind(this)
    this.onNewRead = this.onNewRead.bind(this)
    this.onFinalData = this.onFinalData.bind(this)
    // this._onLocationError = this._onLocationError.bind(this)
    this.onLocationWorking = this.onLocationWorking.bind(this)
    this._onStopMeasurement = this._onStopMeasurement.bind(this)

  }

  componentDidMount() {
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    // this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)
    this.state.myModuleEvt.addListener('onLocationWorking', this.onLocationWorking)
    this.state.myModuleEvt.addListener('onFinalData', this.onFinalData)

    NativeModules.VaavudBle.initBle()
  }

  onFinalData(data) {

    console.log('data', data)
    let windMin = data.session.windMin

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
      .then(key => this.props.push({ key: 'summary', props: { sessionKey: key.key } }))
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
    if (ble.available) {
      this.setState({ isBleConnected: true })
    }
    else {
      //TODOs
    }
  }

  onReadyToWork() {
    this.setState({ readyToWork: true })
    // this.props.endSession()
    // this.props.initSession().then(() => {
    //   this.setState({ readyToWork: true })
    // })
  }

  onNewRead(point) {
    if (this.state.locationReady) {
      let last = this.state.windDirection
      this.setState({ windSpeed: point.windSpeed, windDirection: point.windDirection, lastWindDirection: last })
    }
  }

  render() {

    if (this.state.isBleConnected && this.state.locationReady && this.state.readyToWork) {
      return (
        <MeasureView windHeading={this.state.windDirection} lastWindHeading={this.state.lastWindDirection} windSpeed={this.state.windSpeed} testStop={this._onStopMeasurement} />
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
