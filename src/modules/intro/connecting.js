// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Text,
  NativeEventEmitter,
  NativeModules,
  Image, StyleSheet, Alert
} from 'react-native'

import Button from '../../reactcommon/components/button'

import Colors from '../../../assets/colorTheme'
const correct = require('../../../assets/icons/correct.png')


// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'


export default class Connecting extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)

    this.state = {
      myModuleEvt,
      readyToWork: false,
      location: 'connection...',
      ble: 'connection...'
    }

    console.log('props', props)

    this._removeCallbacks = this._removeCallbacks.bind(this)
    this.onLocationWorking = this.onLocationWorking.bind(this)
    this.onBleState = this.onBleState.bind(this)
    this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
    this.onNewRead = this.onNewRead.bind(this)
    this.timeout = this.timeout.bind(this)

  }

  componentDidMount() {
    this.state.myModuleEvt.addListener('onBleState', this.onBleState)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)
    this.state.myModuleEvt.addListener('onLocationWorking', this.onLocationWorking)
    this.state.myModuleEvt.addListener('timeout', this.timeout)


    NativeModules.VaavudBle.initBle()
  }

  componentWillUnmount() {
    this._removeCallbacks()
  }

  timeout() {
    NativeModules.VaavudBle.onDisconnect()
    this._removeCallbacks()
    this.props.nav({ type: 'push', key: 'noBluetooth' })
  }

  _removeCallbacks() {
    this.state.myModuleEvt.removeAllListeners('onBleState')
    this.state.myModuleEvt.removeAllListeners('onLocationWorking')
    this.state.myModuleEvt.removeAllListeners('onNewRead')
    this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')
  }


  onBleState(data) {
    switch (data.status) {
      case 'off':
        Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON.', [{ text: 'OK', onPress:() => {this.props.nav({ type: 'push', key: 'noBluetooth' })} }])
        break
      case 'unauthorized':
        Alert.alert('Bluetooth Error', 'In order to take a measurement please enable the Bluetooth permission.', [{ text: 'OK', onPress:() => {this.props.nav({ type: 'push', key: 'noBluetooth' })} }])
        break
    }
  }

  onLocationWorking(location) {
    this.setState({ location: 'Connected' })

  }

  onVaavudBleFound(ble) {
    this.setState({ ble: 'Connected' })
  }

  onReadyToWork() {

  }

  onNewRead(point) {
    NativeModules.VaavudBle.onDisconnect()
    this._removeCallbacks()

    this.props.nav({ type: 'push', key: 'bluetooth', props: { point } })
  }


  render() {
    return (
      <View style={style.container} >
        <Image source={correct} style={{ height: 90, width: 90 }} />
        <Text style={style.heading} >Connecting...</Text>
        <Text style={style.description} >Location status</Text>
        <Text style={style.description} >{this.state.location}</Text>
        <Text style={style.description} >Vaavud BLE status</Text>
        <Text style={style.description} >{this.state.ble}</Text>
        
      </View>
    )
  }

}

// const mapReduxStoreToProps = (reduxStore) => {
//   return {
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//   }
// }


// export default connect(mapReduxStoreToProps, mapDispatchToProps)(Connecting)


const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.vaavudBlue
  },
  heading: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 20
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10
  },
  button: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 5,
    margin: 50,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
