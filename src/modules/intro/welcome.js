// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button, Text, NativeModules, NativeEventEmitter
} from 'react-native'



import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showError } from '../../actions/utils'

class Welcome extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)


    this.state = {
      bleStatus: 'poweredOff',
      myModuleEvt
    }

    this.onStateHasChanged = this.onStateHasChanged.bind(this)

  }

  componentDidMount() {
    // const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    // this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    // this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)

    NativeModules.VaavudBle.initBle()

  }

  componentWillUnmount() {
    // this.state.myModuleEvt.removeAllListeners('onBleConnected')
    this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    // this.state.myModuleEvt.removeAllListeners('onNewRead')
    // this.state.myModuleEvt.removeAllListeners('onReadyToWork')
  }

  onStateHasChanged(ble) {
    this.setState({ status: ble.status })
    console.log('status', ble)
  }

  onNewRead(read) {
    console.log('read', read)
  }

  onReadyToWork() {
    console.log('onReadyToWork')
  }

  onBleConnected(data) {
    console.log('callback', data)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink', paddingTop: 100 }} >
        <Text> Welcome </Text>
        <Button title="Connect" onPress={() => {
          if (this.state.status === 'poweredOn') {
            //NativeModules.VaavudBle.onConnect()
            this.props.nav({ type: 'push', key: 'bluetooth' })
          }
          else {
            this.props.showError({ title: 'Bluetooth error', msg: 'Please enable Bluetooth to continue' })
          }
        } } />

        <Button title="DisConnect" onPress={() => {
          // NativeModules.VaavudBle.onDisconnect()
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
    showError: bindActionCreators(showError, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Welcome)
