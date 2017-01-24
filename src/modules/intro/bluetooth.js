// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button, Text,
  NativeEventEmitter,
  NativeModules
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Bluethooth extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)

    this.state = {
      myModuleEvt,
      readyToWork: false
    }

    this.onBleConnected = this.onBleConnected.bind(this)

  }

  componentDidMount() {
    this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)

    NativeModules.VaavudBle.onConnect()
  }

  componentWillUnmount() {
    NativeModules.VaavudBle.onDisconnect()
    this.state.myModuleEvt.removeAllListeners('onBleConnected')
    this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    this.state.myModuleEvt.removeAllListeners('onNewRead')
    this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')
  }


  onStateHasChanged(ble) {
    console.log('status', ble)
  }

  onVaavudBleFound(ble) {
    console.log('onVaavudBleFound', ble)
  }

  onNewRead(read) {
    console.log('read', read)
    NativeModules.VaavudBle.onDisconnect()
  }

  onReadyToWork() {
    console.log('onReadyToWork')
  }

  onBleConnected(data) {
    console.log('callback', data)
    this.setState({ readyToWork: true })
    this.props.nav({ type: 'push', key: 'summary' })
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink', paddingTop: 100 }} >

        {!this.state.readyToWork ? <Text> Trying to connect to the Vaavud Ble </Text> : <Text> Vaavud ble connected and ready to work </Text>}

        <Button title="Back" onPress={() => {
          this.props.nav({ type: 'pop' })
        } } />

      </View>
    )
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

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Bluethooth)
