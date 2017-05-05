import React, {
  Component
} from 'react'

import {
  CalibrateView,
} from '../../views/mounting/'

import {
  View,
  Text, NativeEventEmitter,
  NativeModules, Alert, Dimensions, Image, TouchableOpacity
} from 'react-native'

import { DeviceEventEmitter } from 'react-native'
import ReactNativeHeading from 'react-native-heading'
import Colors from '../../../assets/colorTheme'
import Button from '../../reactcommon/components/button'

const { width } = Dimensions.get('window')
const compass = require('../../../assets/icons/compass.png')
const info = require('../../../assets/icons/info.png')
const boat = require('../../../assets/images/boat.png')


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
    this.myModuleEvt.addListener('onCharacteristicEnable', this.onCharacteristicEnable)

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
    this.myModuleEvt.removeAllListeners('onCharacteristicEnable')
  }

  onCompleted = () => {
    console.log('on completed')
  }

  onCharacteristicEnable = () => {
    const { goBack } = this.props.navigation

    Alert.alert('Bluetooth', 'Information saved.', [{
      text: 'OK', onPress: () => {
        goBack()
      }
    }])
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
    let offset = this.distance(this.state.heading, this.state.compassBle)
    let off = parseInt(offset, 10)
    NativeModules.VaavudBle.addOffset(off)
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
      <View style={{ flex: 1, backgroundColor: Colors.vaavudBlue }}>

        <View style={{ width, height: 80, flexDirection: 'row', marginTop: 20 }}>
          <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }} >
            <Image source={compass} style={{ width: 50, height: 50, transform: [{ rotate: this.state.heading + 'deg' }] }} />
          </View>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }} onPress={() => { }} >
            <Image source={info} style={{ width: 30, height: 30, tintColor: 'white' }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
          <Image source={boat} style={{ tintColor: 'white' }} />
        </View>

        <View style={{ width, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'white' }}> Align your phone to the head of your boat  </Text>
          <Text style={{ marginBottom: 20, color: 'white' }}> Click done when you information displayed is correct. </Text>

          <Button buttonStyle={{ width: width - 40, height: 40, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
            textStyle={{ color: Colors.vaavudBlue, fontSize: 18 }}
            title={'Done'}
            onPress={this._onResult} />
          <Button buttonStyle={{ width: width - 40, height: 40, marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}
            textStyle={{ color: 'white', fontSize: 18 }}
            title={'Cancel'}
            onPress={() => { this.props.navigation.goBack() }} />
        </View>
      </View >
    )

    // return <CalibrateView onNext={this.onNext} heading={this.state.heading} />
  }

  distance = (alpha, beta) => {
    let phi = (360 + (beta - alpha)) % 360
    return phi
  }


}
