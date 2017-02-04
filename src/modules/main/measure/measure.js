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
  initSession, endSession
} from '../../../actions/measure'


import MeasureView from '../../../views/main/measure'


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
      locationReady: false,
      points: []
    }

    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onReadyToWork = this.onReadyToWork.bind(this)
    this.onNewRead = this.onNewRead.bind(this)
    this._onLocationError = this._onLocationError.bind(this)
    this._onNewLocation = this._onNewLocation.bind(this)
    this._onStopMeasurement = this._onStopMeasurement.bind(this)

  }

  componentDidMount() {
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    // this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)

    NativeModules.VaavudBle.initBle()

    //Location setup
    let locationProperties = { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 1 }

    navigator.geolocation.getCurrentPosition(latlon => {
      this.setState({ latlon: latlon.coords, locationReady: true })
    }, this._onLocationError, locationProperties)
    this.positionListener = navigator.geolocation.watchPosition(this._onNewLocation, this._onLocationError, locationProperties) //unsuscribe listener
  }

  _onLocationError(error) {
    console.log('Location error', error)
  }

  _onNewLocation(position) {
    if (this.state.readyToWork) {
      this.setState({ latlon: position.coords })
    }
  }

  componentWillUnmount() {
    this._onStopMeasurement()
  }


  _onStopMeasurement() {

    navigator.geolocation.clearWatch(this.positionListener)
    NativeModules.VaavudBle.onDisconnect()
    // this.state.myModuleEvt.removeAllListeners('onBleConnected')
    // this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    this.state.myModuleEvt.removeAllListeners('onNewRead')
    this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')

    if (!this.state.readyToWork) return

    this.props.endSession(this.state.points).then(res => {
      if (res.success) {
        this.props.push({ key: 'summary', props: { sessionKey: res.key } })

        console.log('go to summary with key: ', res.key)
      }
      else {
        console.log('go back, there was a problem with the server')
      }
    })
  }

  onVaavudBleFound(ble) {
    NativeModules.VaavudBle.onConnect()
    this.setState({ isBleConnected: ble.available })
  }

  onReadyToWork() {
    // this.props.endSession()
    this.props.initSession().then(() => {
      this.setState({ readyToWork: true })
    })
  }

  onNewRead(point) {
    if (this.state.locationReady) {
      let p = {
        windSpeed: point.windSpeed,
        windDirection: point.windDirection,
        location: {
          lat: this.state.latlon.latitude,
          lon: this.state.latlon.longitude
        },
        timestamp: Date.now()
      }
      // this.props.newSessionPoint(p)
      let points = this.state.points
      points.push(p)

      this.setState({ windSpeed: point.windSpeed, windDirection: point.windDirection, points })
    }
    else {
      this.setState({ windSpeed: point.windSpeed, windDirection: point.windDirection })
    }
  }

  render() {

    if (this.state.isBleConnected && this.state.locationReady && this.state.readyToWork) {
      return (
        <MeasureView windHeading={this.state.windDirection} windSpeed={this.state.windSpeed} testStop={this._onStopMeasurement} />
      )
    }
    else {
      return (
        <View style={{ backgroundColor: 'orange', flex: 1, marginTop: 100 }} >
          <Text> "Connection to your Vaavud ble... wait a second." </Text>
        </View>
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
    initSession: bindActionCreators(initSession, dispatch),
    endSession: bindActionCreators(endSession, dispatch),
    // newSessionPoint: bindActionCreators(newSessionPoint, dispatch),
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Measure)
