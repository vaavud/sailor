import React, {
  Component
} from 'react'

import {
  CalibrateView,
} from '../../views/mounting/'

import {
  ActivityIndicator,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Alert,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Easing
} from 'react-native'

import {
  HeadingText,
  textStyle
} from '../../components/text'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { DeviceEventEmitter } from 'react-native'
import ReactNativeHeading from 'react-native-heading'
import Colors from '../../../assets/colorTheme'
import Button from '../../reactcommon/components/button'
import color from '../../../assets/colorTheme'

const { width } = Dimensions.get('window')
const compass = require('../../../assets/icons/compass.png')
const info = require('../../../assets/icons/info.png')
const boat = require('../../../assets/images/boat.png')
const logo = require('../../../assets/icons/logo.png')

export default class extends Component {

  state = {
    lastHeading:0,
    heading: 0,
    compassBle: 0,
    isLoading: true
  }

  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
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
    NativeModules.VaavudBle.readRowData(false, {})
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
    NativeModules.VaavudBle.onDisconnect()

    Alert.alert('Bluetooth', 'Information saved.', [{
      text: 'OK', onPress: () => {
        goBack()
      }
    }])
  }

  onBluetoothOff = () => {
    const { goBack } = this.props.navigation
    Alert.alert('Bluetooth Error', 'Please go to settings and turn Bluetooth ON.', [{
      text: 'OK', onPress: () => {
        goBack()
      }
    }])
  }

  onNoDeviceFound = () => {
    const { goBack } = this.props.navigation

    Alert.alert('Bluetooth Error', 'We could not find your Ultrasonic, try again later.', [{
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
    console.log('Heading',data,this.state.lastHeading,this.state.heading)
    var lastHeading = this.state.heading
    this.setState({ lastHeading, heading: Number(data)})
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

  _renderCompass = () => {
    this.animateNewHeading()
    var newHeading = (this._crazyMod((this.state.heading - this.state.lastHeading) + 180, 360) - 180) + this.state.lastHeading
    const animate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.lastHeading + 'deg', newHeading + 'deg']
    })
    return (
      <View style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }} >
        <Animated.Image source={compass} style={{ width: 50, height: 50, transform: [{ 'rotate' : animate }] }} />
      </View>
    )
  }

  animateNewHeading() {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue, {
        toValue: 1,
        duration: 250,
        easing: Easing.linear
      }
    ).start()
  }

  _crazyMod(a, n) {
    return a - Math.floor(a / n) * n
  }

  render = () => {

    if (this.state.isLoading) {
      return (
        <View style={style.container}>
          <View style={style.innerContainer}>
            <Image source={logo} style={{ marginBottom: 20 }} />
            <HeadingText style={style.heading} textContent={'Connecting your Vaavud Ultrasonic...'} />
            <ActivityIndicator color={'white'} size={'large'} animating={true} />
          </View>
          <Icon.Button name="close-circle-outline" color={color.vaavudBlue} backgroundColor={'white'} onPress={() => this.props.navigation.goBack()}>
            <Text style={{ ...textStyle.normal, color: color.vaavudBlue }} >Cancel</Text>
          </Icon.Button>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: Colors.vaavudBlue }}>

        <View style={{ width, height: 80, flexDirection: 'row', marginTop: 20 }}>
          {this._renderCompass()}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', }} onPress={() => {/* TODO info button*/ }} >
            <Image source={info} style={{ width: 30, height: 30, tintColor: 'white' }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
          <Image source={boat} style={{ tintColor: 'white' }} />
        </View>

        <View style={{ width, padding: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Text style={{ ...textStyle.normal, color: 'white', textAlign: 'center' }}> Align your phone to the head of your boat  </Text>
          <Text style={{ ...textStyle.normal, marginBottom: 20, color: 'white', textAlign: 'center'}}> Click done when you information displayed is correct. </Text>

          <Button buttonStyle={{ width: width - 80, height: 40, borderRadius: 5, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
            textStyle={{ ...textStyle.normal, color: Colors.vaavudBlue, fontSize: 18 }}
            title={'Done'}
            onPress={this._onResult} />
          <Button buttonStyle={{ height: 40, marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}
            textStyle={{ ...textStyle.normal, color: 'white', fontSize: 18 }}
            title={'Cancel'}
            onPress={() => { this.props.navigation.goBack() }} />
        </View>
      </View>
    )

    // return <CalibrateView onNext={this.onNext} heading={this.state.heading} />
  }

  distance = (alpha, beta) => {
    let phi = (360 + (beta - alpha)) % 360
    return phi
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.vaavudBlue,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 28,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 20
  },
})
