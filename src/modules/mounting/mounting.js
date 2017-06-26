import React, {
  Component
} from 'react'

import Permissions from 'react-native-permissions'

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  NativeEventEmitter,
  NativeModules,
  Alert,
  Text,
  View,
  Platform,
  StyleSheet
} from 'react-native'

import PopupDialog from 'react-native-popup-dialog'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Button from '../../reactcommon/components/button'
import color from '../../../assets/colorTheme'
import {
  HeadingText,
  textStyle
} from '../../components/text'

const logo = require('../../../assets/icons/logo.png')
const compass = require('../../../assets/images/compass.png')
const compassHand = require('../../../assets/images/test_compass.png')
const arrow = require('../../../assets/icons/rotate-arrow.png')
const { width, height } = Dimensions.get('window')
const compassSize = width * 0.8
class Mounting extends Component {

  state = {
    error: '',
    loading: true,
    onDeviceFound: false,
    compassOuput: 0,
    lastCompassOutput: 0,
    calibrated: false
  }

  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
  }

  componentDidMount = () => {
    this._permissions()
  }


  activateListeners = () => {
    this.myModuleEvt.addListener('onBluetoothOff', this.onBluetoothOff)
    this.myModuleEvt.addListener('onNoDeviceFound', this.onNoDeviceFound)
    this.myModuleEvt.addListener('onDeviceFound', this.onDeviceFound)
    this.myModuleEvt.addListener('onReading', this.onReading)
    this.myModuleEvt.addListener('timeout', this.timeout)
    this.myModuleEvt.addListener('onCompleted', this.onCompleted)
    NativeModules.VaavudBle.readRowData(false, 0, {})
  }

  componentWillUnmount = () => {
    NativeModules.VaavudBle.onDisconnect()
    this._removeCallbacks()
  }

  timeout = () => {
    console.log('timeOut')
  }

  _permissions() {
    Permissions.getPermissionStatus('location').then(response => {
      if (response === 'authorized') {
        // User has already authorized location
        this.activateListeners()
      } else {
        Permissions.requestPermission('location').then(location => {
          if (location === 'authorized') {
            // User authorized location
            this.activateListeners()
          }
        })
      }
    })
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
    this.setState({ onDeviceFound: true, loading: false })
  }

  onReading = data => {
    console.log('Compass Data:', data)
    var x = this.state.compassOuput
    this.setState({ lastCompassOutput: x })
    this.setState({ compassOuput: data.compass })
  }

  _renderPopUpView = () => {
    return (
      <View style={style.popupContainer} >
        <View style={style.popupTopContainer} >
          <Image source={arrow} style={{ tintColor: 'white', marginBottom: 20, transform: [{ rotate: '90deg' }] }} />
          <HeadingText style={{ textAlign: 'center', color: 'white' }} textContent={'Please rotate the Ultrasonic device at least 3 times to calibrate the compass... \nThen press OK'} />
        </View>
        <View style={style.popupBottomContainer} >
          <Button textStyle={{
            ...textStyle.normal,
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: 'transparent',
            color: 'white'
          }} onPress={() => {
            NativeModules.VaavudBle.calibrateCompass(false)
            this.popupDialog.dismiss()
            this.setState({ calibrated: true })
          }} title="OK" />
        </View>
      </View>
    )

  }

  renderPopup = () => {
    return (<PopupDialog
      ref={(popupDialog) => { this.popupDialog = popupDialog }}
      dialogStyle={style.popup}
      width={width - 40}
      height={Platform.OS === 'ios' ? height - 40 : height - 60} >
      {this._renderPopUpView()}
    </PopupDialog>)
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


  _renderCompass(lastHeading, newHeading) {
    var l = lastHeading
    var n = newHeading
    newHeading = (this._crazyMod((n - l) + 180, 360) - 180) + l
    this.animateNewHeading()
    const animate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lastHeading + 'deg', newHeading + 'deg']
    })
    return (
      <View style={style.compassContainer} >
        <Image style={{ width: compassSize, height: compassSize }}
          source={compass}
        />
        <Animated.Image
          resizeMode={'contain'}
          style={{
            position: 'absolute',
            top: 0,
            left: 13,
            width: compassSize - 26,
            height: compassSize - 26,
            transform: [{ 'rotate': animate }]
          }}
          source={compassHand} />
      </View>
    )
  }

  render = () => {

    if (this.state.loading) {
      return (
        <View style={style.container}>
          <View style={style.innerContainer}>
            <Image source={logo} style={{ marginBottom: 20, width: 110, height: 80 }} />
            <HeadingText style={style.heading} textContent={'Connecting your Vaavud Ultrasonic...'} />
            <ActivityIndicator color={'white'} size={'large'} animating={true} />
          </View>
          <Icon.Button name="close-circle-outline" color={color.vaavudBlue} backgroundColor={'white'} onPress={() => this.props.navigation.goBack()}>
            <Text style={{ ...textStyle.normal, color: color.vaavudBlue }} >Cancel</Text>
          </Icon.Button>
        </View>
      )
    }

    const { navigate } = this.props.navigation

    return (
      <View style={style.container}>
        {this._renderCompass(this.state.lastCompassOutput, this.state.compassOuput)}
        <View style={style.bottomContainer}>
          <HeadingText style={style.compassText} textContent={'Calibrate the Ultrasonic compass to get a stable heading'} />
          <View style={style.buttonContainer}>
            <Button buttonStyle={style.button}
              textStyle={style.buttonText}
              title={this.state.calibrated ? 'RETRY CALIBRATION' : 'CALIBRATE'}
              onPress={() => {
                NativeModules.VaavudBle.calibrateCompass(true)
                this.popupDialog.show()
              }}
            />
          </View>
          <View style={style.buttonContainer} >
            {this.state.calibrated ? <Button buttonStyle={style.button}
              textStyle={style.buttonText}
              title={'NEXT'}
              onPress={() => {
                NativeModules.VaavudBle.onDisconnect()
                navigate('Result')
              }}
            /> : null}
          </View>
        </View>
        {this.renderPopup()}
      </View>
    )
    /*return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>

        <Text style={{ fontSize: 25 }} > {this.state.compassOuput} </Text>


        {this.state.calibrated ? <Button style={{ height: 50, marginTop: 20 }} onPress={() => {
          NativeModules.VaavudBle.onDisconnect()
          navigate('Result')
        }} title="Next" /> : <Button style={{ height: 50, marginTop: 20 }} onPress={() => {
          NativeModules.VaavudBle.calibrateCompass(true)
          this.popupDialog.show()
        }} title="Calibrate" />}

        {this.renderPopup()}

      </View>
    )*/


    // const { navigate } = this.props.navigation
    // return <MountingView navigate={navigate} heading={this.state.heading} />
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  buttonContainer: {
    flexDirection: 'row'
  },
  compassText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 20
  },
  calibrateContainer: {
    flex: 1,
    backgroundColor: color.vaavudBlue,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 15,
  },
  compassContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  popup: {
    padding: 20,
    paddingTop: 60,
    borderRadius: 20,
    backgroundColor: color.vaavudBlue
  },
  popupContainer: {
    flex: 1,
  },
  popupTopContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  popupBottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  buttonText: {
    ...textStyle.normal,
    fontSize: 16,
    textAlign: 'center',
    color: color.vaavudBlue
  }
})

export default Mounting
