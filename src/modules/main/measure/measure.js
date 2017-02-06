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
    }

    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onReadyToWork = this.onReadyToWork.bind(this)
    this.onNewRead = this.onNewRead.bind(this)
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


    NativeModules.VaavudBle.initBle()

    //Location setup
    // let locationProperties = { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 1 }

    // navigator.geolocation.getCurrentPosition(latlon => {
    //   this.setState({ latlon: latlon.coords, locationReady: true })
    // }, this._onLocationError, locationProperties)
    // this.positionListener = navigator.geolocation.watchPosition(this._onNewLocation, this._onLocationError, locationProperties) //unsuscribe listener
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
    // this.props.endSession()
    // this.props.initSession().then(() => {
    //   this.setState({ readyToWork: true })
    // })

    //Dismis view  and start recoding...
  }

  onNewRead(point) {

    console.log('direction',point.windDirection)
    console.log('compass',point.compass)
    console.log('----------------------------')
    // console.log('temperature',point.temperature)
    // console.log('battery',point.battery)

    if (this.state.locationReady)
      this.setState({ windSpeed: point.windSpeed, windDirection: point.windDirection })
  }

  render() {

    if (this.state.isBleConnected && this.state.locationReady) {
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
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Measure)
