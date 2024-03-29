// @flow

'use strict'

import React, { Component } from 'react'
import {
  NativeEventEmitter,
  NativeModules,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  saveSession, saveSummary, savePoints, goToMain
} from '../../../actions/measure'

import Colors from '../../../../assets/colorTheme'

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager'
import Permissions from 'react-native-permissions'
import PopupDialog from 'react-native-popup-dialog'
import {
  NormalText,
  HeadingText,
  textStyle
} from '../../../components/text'
import LoadingModal from '../../../components/loadingModal'

import {
  TrueWindView,
  ApparentWindView,
  ConnectingView
} from '../../../views/main/measure'


import {
  SpeedUnits, convertWindSpeed
} from '../../../reactcommon/utils'

import Button from '../../../reactcommon/components/button'

import { VaavudBle } from 'NativeModules'


const locactionLogo = require('../../../../assets/icons/ico-pin-map.png')
const buildingOne = require('../../../../assets/icons/ico-bulding-1.png')
const buildingTwo = require('../../../../assets/icons/ico-building-2.png')
const tree = require('../../../../assets/icons/ico-tree-1.png')
const bgmap = require('../../../../assets/images/bgmap.png')
const overlay = require('../../../../assets/images/overlay.png')

const { height, width } = Dimensions.get('window')

const mapReduxStoreToProps = (reduxStore) => {
  return {
    windUnit: reduxStore.settings.windSpeed,
    offset: reduxStore.offset.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // initSession: bindActionCreators(initSession, dispatch),
    // endSession: bindActionCreators(endSession, dispatch),
    saveSession: bindActionCreators(saveSession, dispatch),
    saveSummary: bindActionCreators(saveSummary, dispatch),
    savePoints: bindActionCreators(savePoints, dispatch),
    goToMain: bindActionCreators(goToMain, dispatch)
  }
}

@connect(mapReduxStoreToProps, mapDispatchToProps)
export default class extends Component {

  state = {
    readyToWork: false,
    isBleConnected: false,
    windSpeed: 0,
    windDirection: 0,
    lastWindDirection: 0,
    locationReady: undefined,
    velocity: 0,
    trueWindDirection: 0,
    trueWindSpeed: 0,
    trueLastWindDirection: 0,
    isLoading: false,
    timeout: false,
    battery: '-'
  }

  constructor(props) {
    super(props)
    this.myModuleEvt = new NativeEventEmitter(VaavudBle)
  }

  componentDidMount = () => {
    this._permissions()
    // this.myModuleEvt.addListener('onLocationFound', this.onLocationFound)
    // this.myModuleEvt.addListener('onBluetoothOff', this.onBluetoothOff)
    // this.myModuleEvt.addListener('onNoDeviceFound', this.onNoDeviceFound)
    // this.myModuleEvt.addListener('onDeviceFound', this.onDeviceFound)
    // this.myModuleEvt.addListener('onReading', this.onReading)
    // this.myModuleEvt.addListener('timeout', this.timeout)
    // this.myModuleEvt.addListener('onCompleted', this.onCompleted)
    // this.myModuleEvt.addListener('onFinalData', this.onFinalData)
    // NativeModules.VaavudBle.readRowData(true, this.props.offset)
  }

  activateListeners = () => {
    this.myModuleEvt.addListener('onLocationFound', this.onLocationFound)
    this.myModuleEvt.addListener('onBluetoothOff', this.onBluetoothOff)
    this.myModuleEvt.addListener('onNoDeviceFound', this.onNoDeviceFound)
    this.myModuleEvt.addListener('onDeviceFound', this.onDeviceFound)
    this.myModuleEvt.addListener('onReading', this.onReading)
    this.myModuleEvt.addListener('timeout', this.timeout)
    this.myModuleEvt.addListener('onCompleted', this.onCompleted)
    this.myModuleEvt.addListener('onFinalData', this.onFinalData)

    AsyncStorage.getItem('headingOffset').then(val => {
      if (val) {
        VaavudBle.readRowData(true, parseInt(val, 10), this.props.offset, )
        this.setState({ timeout: false })
      }
      else {
        VaavudBle.readRowData(true, 0, {})
      }
    })


  }

  componentWillUnmount = () => {
    VaavudBle.onDisconnect()
    this.removeListeners()
  }

  timeout = () => {
    this.popupDialog.dismiss()
    this.setState({ timeout: true })
    Alert.alert('Connection Error', 'Please check both Location and the Bluetooth ON.', [{
      text: 'OK', onPress: () => { }
    }])
  }

  removeListeners = () => {
    this.myModuleEvt.removeAllListeners('onBluetoothOff')
    this.myModuleEvt.removeAllListeners('onNoDeviceFound')
    this.myModuleEvt.removeAllListeners('onDeviceFound')
    this.myModuleEvt.removeAllListeners('onReading')
    this.myModuleEvt.removeAllListeners('timeout')
    this.myModuleEvt.removeAllListeners('onCompleted')
    this.myModuleEvt.removeAllListeners('onFinalData')
  }

  onCompleted = () => {

  }

  onBluetoothOff = () => {
    this.setState({ timeout: true })
    Alert.alert('Bluetooth Error', 'Please go to settings and turn Bluetooth ON.', [{
      text: 'OK', onPress: () => {
        // TODO: with this event?
      }
    }])
  }

  onNoDeviceFound = () => {
    VaavudBle.onDisconnect()
    this.setState({ timeout: true })

    Alert.alert('Bluetooth Error', 'We could not find your Ultrasonic, try later.', [{
      text: 'OK', onPress: () => {

      }
    }])
  }

  onDeviceFound = () => {
    this.setState({ isBleConnected: true, readyToWork: true })
  }

  onReading = point => {
    let last = this.state.windDirection
    let lastTrue = this.state.trueWindDirection
    this.setState({
      windSpeed: Number(point.windSpeed),
      windDirection: Number(point.windDirection),
      lastWindDirection: last,
      velocity: Number(point.velocity),
      trueWindDirection: Number(point.trueWindDirection),
      trueWindSpeed: Number(point.trueWindSpeed),
      trueLastWindDirection: lastTrue,
      battery: point.battery
    })
  }

  onFinalData = data => {

    let windMin = 0

    this.removeListeners()
    this.setState({ myModuleEvt: null })

    this.props.saveSession(data.session)
      .then(key => {
        let summary = {
          key,
          windMin,
          windMax: data.session.windMax,
          speeds: data.speeds,
          directions: data.directions,
          locations: data.locations,
          fromHistory: false
        }
        return this.props.saveSummary(summary)
      })
      .then(key => this.props.savePoints(data.measurementPoints, key))
      .then(key => {
        const { navigate } = this.props.navigation
        navigate('Summary', { sessionKey: key, windMean: data.session.windMean })
      })
  }

  onLocationFound = location => {
    if (location) {
      this.setState({ locationReady: true })
    }
    else {
      this.setState({ locationReady: false })
    }
  }

  _onStopMeasurement = () => {
    console.log('_onStopMeasurement: ', this, VaavudBle)
    VaavudBle.onStopSdk()
    this.setState({ isLoading: true })

  }

  _renderDotIndicator = () => {
    return (
      <PagerDotIndicator
        dotStyle={{ backgroundColor: Colors.vaavudBlue, opacity: 0.5 }}
        selectedDotStyle={{ backgroundColor: Colors.vaavudBlue }}
        pageCount={2} />
    )
  }

  _jump = () => {
    this.removeListeners()
    this.props.goToMain()
    // this.props.jump('history')
  }

  _tryAgain = () => {
    AsyncStorage.getItem('headingOffset').then(val => {
      if (val) {
        VaavudBle.readRowData(true, parseInt(val, 10), {})
        this.setState({ timeout: false })
      }
      else {
        if (val) {
          VaavudBle.readRowData(true, 0, {})
          this.setState({ timeout: false })
        }
      }
    })

  }

  _permissions() {
    Permissions.getPermissionStatus('location').then(response => {
      if (response === 'authorized') {
        // User has already authorized location
        this.setState({ locationReady: true })
        this.activateListeners()
      }
      else {
        this.popupDialog.show()
      }
    })
  }

  _onContinue() {
    Permissions.requestPermission('location').then(location => {
      if (location === 'authorized') {
        // User authorized location
        this.setState({ locationReady: true })
        this.activateListeners()
        this.popupDialog.dismiss()
      } else {
        this.props.goToMain()
      }
    })
  }

  _renderPopUpView() {
    return (
      <Image style={style.popUpBg}
        source={bgmap} >
        <Image style={style.popUpContainer}
          source={overlay} >
          <View style={{ flex: 1, alignItems: 'center' }} >
            <HeadingText style={{ textAlign: 'center', backgroundColor: 'transparent', margin: 30 }}
              textContent={'Access your\nlocation'} />
            <Image source={locactionLogo} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Image source={buildingOne} />
              <Image source={buildingTwo} />
              <Image source={tree} />
            </View>
            <NormalText style={{ textAlign: 'center', marginTop: 20 }}
              textContent={'In order for you to use the ultrasonic, we need to access your location'} />
          </View>
          <Button buttonStyle={style.popUpButton}
            textStyle={style.popUpButtonText}
            onPress={this._onContinue.bind(this)}
            title="Accept" />
          <Button buttonStyle={style.buttonSkip}
            textStyle={style.buttonText}
            onPress={() => {
              this.props.goToMain()
            }}
            title="Do not allow" />
        </Image>
      </Image>
    )
  }

  _renderPopup() {
    return (<PopupDialog
      ref={(popupDialog) => { this.popupDialog = popupDialog }}
      height={height}>
      {this._renderPopUpView()}
    </PopupDialog>)
  }

  render = () => {
    let windUnit = SpeedUnits[this.props.windUnit]
    let windSpeed = convertWindSpeed(this.state.windSpeed, this.props.windUnit).toFixed(1)
    let trueWindSpeed = convertWindSpeed(this.state.trueWindSpeed, this.props.windUnit).toFixed(1)
    let velocity = convertWindSpeed(this.state.velocity, this.props.windUnit).toFixed(1)

    if (this.state.isBleConnected && this.state.locationReady && this.state.readyToWork) {
      /*return (
        <View style={{ flex: 1 }}>
          <IndicatorViewPager
            indicator={this._renderDotIndicator()}
            style={{ flex: 1 }} >
            <ApparentWindView windHeading={this.state.windDirection} windUnit={windUnit} batteryLevel={this.state.battery} velocity={velocity} lastWindHeading={this.state.lastWindDirection} windSpeed={windSpeed} testStop={this._onStopMeasurement} />
            <TrueWindView windHeading={this.state.trueWindDirection} windUnit={windUnit} batteryLevel={this.state.battery} velocity={velocity} lastWindHeading={this.state.trueLastWindDirection} windSpeed={trueWindSpeed} testStop={this._onStopMeasurement} />
          </IndicatorViewPager>
          <LoadingModal isActive={this.state.isLoading} message={'Processing measurement data...\n Note that processing time may vary depending on duration of the measurement session'} />
        </View>
      )*/
      return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: width, height: height }}>
          <IndicatorViewPager
            indicator={this._renderDotIndicator()}
            style={{ flex: 1 }} >
            <View>
              <ApparentWindView windHeading={this.state.windDirection} windUnit={windUnit} batteryLevel={this.state.battery} velocity={velocity} lastWindHeading={this.state.lastWindDirection} windSpeed={windSpeed} testStop={this._onStopMeasurement.bind(this)} />
            </View>
            <View>
              <TrueWindView windHeading={this.state.trueWindDirection} windUnit={windUnit} batteryLevel={this.state.battery} velocity={velocity} lastWindHeading={this.state.trueLastWindDirection} windSpeed={trueWindSpeed} testStop={this._onStopMeasurement.bind(this)} />
            </View>
          </IndicatorViewPager>
          <LoadingModal isActive={this.state.isLoading} message={'Processing measurement data...\n Note that processing time may vary depending on duration of the measurement session'} />
        </View>
      )
    }
    else {
      return (
        <View style={{ flex: 1 }} >
          <ConnectingView
            isBleReady={this.state.isBleConnected}
            isLocationReady={this.state.locationReady}
            jump={this._jump}
            timeout={this.state.timeout}
            tryAgain={this._tryAgain}
            cancel={this.props.goToMain} />
          {this._renderPopup()}
        </View>
      )
    }
  }
}

const style = StyleSheet.create({
  popUpBg: {
    flex: 1,
    width: width,
    height: height,
  },
  popUpContainer: {
    flex: 1,
    width: width,
    height: height,
    padding: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  popUpButton: {
    borderRadius: 5,
    height: 40,
    width: width - 40,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.vaavudBlue,
  },
  popUpButtonText: {
    ...textStyle.normal,
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  buttonSkip: {
    height: 40,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...textStyle.normal,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
