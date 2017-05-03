// @flow

'use strict'

import React, { Component } from 'react'
import {
  ActivityIndicator,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Image,
  StyleSheet,
  Alert
} from 'react-native'

import {
  NormalText,
  HeadingText
} from '../../components/text'

import Button from '../../reactcommon/components/button'

import Colors from '../../../assets/colorTheme'
const ic_bluetooth = require('../../../assets/icons/bluetooth.png')

const checkmark = require('../../../assets/checkmark.png')
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'


export default class Connecting extends Component {

  state = {
    error: '',
    loading: true,
    ble: false,
    compassOuput: 0,
    location: true
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

    NativeModules.VaavudBle.readOnce()
  }

  componentWillUnmount = () => {
    NativeModules.VaavudBle.onDisconnect()
    this._removeCallbacks()
  }

  timeout = () => {
    console.log('timeOut')
  }

  _removeCallbacks = () => {
    this.myModuleEvt.removeAllListeners('onBluetoothOff')
    this.myModuleEvt.removeAllListeners('onNoDeviceFound')
    this.myModuleEvt.removeAllListeners('onDeviceFound')
    this.myModuleEvt.removeAllListeners('onReading')
    this.myModuleEvt.removeAllListeners('timeout')
    this.myModuleEvt.removeAllListeners('onCompleted')
  }

  onCompleted = () => {
    console.log('onCompleted')
  }

  onBluetoothOff = () => {
    Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON.', [{
      text: 'OK', onPress: () => { }
    }])
  }

  onNoDeviceFound = () => {
    Alert.alert('Bluetooth Error', 'We could not find your Ultrasonic, try later.', [{
      text: 'OK', onPress: () => { }
    }])
  }

  onDeviceFound = () => {
    this.setState({ ble: true, loading: false })
  }

  onReading = data => {

    const { navigate } = this.props.navigation
    navigate('Bluetooth', data)
    NativeModules.VaavudBle.onDisconnect()
    this._removeCallbacks()
  }




  // constructor(props) {
  //   super(props)

  //   const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)

  //   this.state = {
  //     myModuleEvt,
  //     readyToWork: false,
  //     location: false,
  //     ble: false
  //   }

  //   this._removeCallbacks = this._removeCallbacks.bind(this)
  //   this.onLocationWorking = this.onLocationWorking.bind(this)
  //   this.onBleState = this.onBleState.bind(this)
  //   this.onVaavudBleFound = this.onVaavudBleFound.bind(this)
  //   this.onNewRead = this.onNewRead.bind(this)
  //   this.timeout = this.timeout.bind(this)

  // }

  // componentDidMount() {
  //   this.state.myModuleEvt.addListener('onBleState', this.onBleState)
  //   this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
  //   this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
  //   this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)
  //   this.state.myModuleEvt.addListener('onLocationWorking', this.onLocationWorking)
  //   this.state.myModuleEvt.addListener('timeout', this.timeout)


  //   NativeModules.VaavudBle.initBle()
  // }

  // componentWillUnmount() {
  //   this._removeCallbacks()
  // }

  // timeout() {
  //   NativeModules.VaavudBle.onDisconnect()
  //   this._removeCallbacks()
  //   const { navigate } = this.props.navigation
  //   navigate('NoBluetooth')
  // }

  // _removeCallbacks() {
  //   this.state.myModuleEvt.removeAllListeners('onBleState')
  //   this.state.myModuleEvt.removeAllListeners('onLocationWorking')
  //   this.state.myModuleEvt.removeAllListeners('onNewRead')
  //   this.state.myModuleEvt.removeAllListeners('onReadyToWork')
  //   this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')
  // }


  // onBleState(data) {
  //   switch (data.status) {
  //     case 'off':
  //       Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON.', [{
  //         text: 'OK', onPress: () => {
  //           const { navigate } = this.props.navigation
  //           navigate('NoBluetooth')
  //         }
  //       }])
  //       break
  //     case 'unauthorized':
  //       Alert.alert('Bluetooth Error', 'In order to take a measurement please enable the Bluetooth permission.', [{
  //         text: 'OK', onPress: () => {
  //           const { navigate } = this.props.navigation
  //           navigate('NoBluetooth')
  //         }
  //       }])
  //       break
  //   }
  // }

  // onLocationWorking(location) {
  //   this.setState({ location: true })

  // }

  // onVaavudBleFound(ble) {
  //   this.setState({ ble: true })
  // }

  // onReadyToWork() {
  // }

  // onNewRead(point) {
  //   NativeModules.VaavudBle.onDisconnect()
  //   this._removeCallbacks()

  //   const { navigate } = this.props.navigation
  //   navigate('Bluetooth', point)
  // }

  _renderStatusSection() {
    return (
      <View style={style.statusSection}>
        {this._renderLocationStatusRow()}
        {this._renderDeviceStatusRow()}
      </View>
    )
  }

  _renderLocationStatusRow() {
    return (
      <View style={style.rowContainer} >
        <NormalText style={style.statusText} textContent={'Location status'} />
        {this._renderStatusIcon(this.state.location)}
      </View>
    )
  }

  _renderDeviceStatusRow() {
    return (
      <View style={style.rowContainer} >
        <NormalText style={style.statusText} textContent={'Utrasonic status'} />
        {this._renderStatusIcon(this.state.ble)}
      </View>
    )
  }


  _renderStatusIcon(isReady) {
    return !isReady ?
      (
        <ActivityIndicator
          animating={true}
          color="#ffffff" />
      )
      :
      (
        <Image
          style={style.checkmark}
          source={checkmark} />
      )
  }

  render() {
    return (
      <View style={style.container} >
        <Image source={ic_bluetooth} style={{ height: 90, width: 75 }} />
        <HeadingText style={style.heading} textContent={'Connecting'} />
        {this._renderStatusSection()}

      </View>
    )
  }

  /*render() {
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
  }*/

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
    padding: 40,
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
  },
  statusSection: {
    width: '80%',
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  statusText: {
    fontSize: 20,
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  checkmark: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    tintColor: 'white'
  }
})
