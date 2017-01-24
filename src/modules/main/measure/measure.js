// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  NativeEventEmitter,
  NativeModules
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Measure extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)

    this.state = {
      myModuleEvt,
      readyToWork: false,
      isBleConnected: false,
      windSpeed: 0,
      windDirection: 0

    }

    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onReadyToWork = this.onReadyToWork.bind(this)
    this.onNewRead = this.onNewRead.bind(this)

  }

  componentDidMount() {
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    // this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)

    NativeModules.VaavudBle.initBle()
  }

  componentWillUnmount() {

    // NativeModules.VaavudBle.onDisconnect()

    // this.state.myModuleEvt.removeAllListeners('onBleConnected')
    // this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    this.state.myModuleEvt.removeAllListeners('onNewRead')
    this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')
  }

  onVaavudBleFound(ble) {
    NativeModules.VaavudBle.onConnect()
    this.setState({ isBleConnected: ble.available })
  }

  onReadyToWork() {
    this.setState({ readyToWork: true })
  }

  onNewRead(point) {
    this.setState({ windSpeed: point.windSpeed, windDirection: point.windDirection })
  }


  render() {

    if (this.state.isBleConnected) {
      if (this.state.readyToWork) {
        return (
          <View style={{ backgroundColor: 'orange', flex: 1, marginTop: 100 }} >
            <Text> Current Wind Speed: {this.state.windSpeed} </Text>
            <Text> Current Wind Direction: {this.state.windDirection} </Text>
          </View>
        )
      }
      else {
        return (
          <View style={{ backgroundColor: 'orange', flex: 1, marginTop: 100 }} >
            <Text> Just on second, finishing connection...  </Text>
          </View>
        )
      }
    }
    else {
      return (
        <View style={{ backgroundColor: 'orange', flex: 1, marginTop: 100 }} >
          <Text> "Connection to Vaavud ble... wait a sec" </Text>
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
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Measure)
