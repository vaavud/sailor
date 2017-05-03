import React, {
  Component
} from 'react'

import {
  CalibrateView,
} from '../../views/mounting/'

import {
  View, Button,
  Text, NativeEventEmitter,
  NativeModules, Alert
} from 'react-native'

import { DeviceEventEmitter } from 'react-native'
import ReactNativeHeading from 'react-native-heading'


export default class extends Component {

  state = {
    heading: 0,
    compassBle: 0,
    isLoading: true
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

    DeviceEventEmitter.addListener('headingUpdated', this.headingUpdated)

    ReactNativeHeading.start(1).catch(err => console.log(err))
    NativeModules.VaavudBle.readRowData(false, 0)
  }

  componentWillUnmount = () => {
    ReactNativeHeading.stop()
    DeviceEventEmitter.removeAllListeners('headingUpdated')

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
    const { goBack } = this.props.navigation
    Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON.', [{
      text: 'OK', onPress: () => {
        goBack()
      }
    }])
  }

  onNoDeviceFound = () => {
    const { goBack } = this.props.navigation

    Alert.alert('Bluetooth Error', 'We could not find your Ultrasonic, try later.', [{
      text: 'OK', onPress: () => {
        goBack()
      }
    }])
  }

  onDeviceFound = () => {
    this.setState({ onDeviceFound: true, isLoading: false })
  }

  onReading = data => {
    this.setState({ compassBle: data.compass })
  }


  stop = () => {
    ReactNativeHeading.stop()
    DeviceEventEmitter.removeAllListeners('headingUpdated')
  }

  headingUpdated = data => {
    this.setState({ heading: data.heading.toFixed(1) })
  }


  onNext = () => {
    ReactNativeHeading.stop()
    DeviceEventEmitter.removeAllListeners('headingUpdated')

    const { navigate } = this.props.navigation
    const { params } = this.props.navigation.state

    navigate('Result', { headingFromBle: params.headingFromBle, headingFromPhone: this.state.heading })
  }

  _onResult = () => {
    const { goBack } = this.props.navigation

    let text = this.distance(this.state.compassBle, this.state.heading) + ' degrees offset'
    alert(text)
    goBack()
  }

  render = () => {

    if (this.state.isLoading) {
      return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text> Connecting to Ultrasonic.... </Text>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Text style={{ marginTop: 20 }}> Align your phone to the head of your boat  </Text>

        <Text style={{ marginTop: 20 }}> your Compas {this.state.heading} </Text>
        <Text style={{ marginTop: 20 }}> Ble Compas {this.state.compassBle} </Text>

        <Text style={{ marginTop: 20 }}> Clic Done when you information displayed is correct. </Text>

        <Button title={'Done'} onPress={this._onResult} />

      </View>
    )


    // return <CalibrateView onNext={this.onNext} heading={this.state.heading} />
  }

  distance = (alpha, beta) => {
    let phi = (360 + (beta - alpha)) % 360        // This is either the distance or 360 - distance
    // let distance = phi > 180 ?  -phi : phi
    return phi
  }


}
