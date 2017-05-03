import React, {
  Component
} from 'react'

import {
  MountingView
} from '../../views/mounting'

import {
  NativeEventEmitter,
  NativeModules,
  Alert,
  View,
  Button,
  Text
} from 'react-native'

import PopupDialog from 'react-native-popup-dialog'


class Mounting extends Component {

  state = {
    error: '',
    loading: true,
    onDeviceFound: false,
    compassOuput: 0,
    calibrated: false
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

    NativeModules.VaavudBle.readRowData(false, 0)
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
    this.setState({ onDeviceFound: true, loading: false })
  }

  onReading = data => {
    this.setState({ compassOuput: data.compass })
  }

  _renderPopUpView = () => {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: 'gray' }}>

        <Text style={{ fontSize: 25 }} > Please rotate the Ultrasonic device 3 times </Text>

        <Button style={{ height: 50, marginTop: 20 }} onPress={() => {
          NativeModules.VaavudBle.calibrateCompass(false)
          this.popupDialog.dismiss()
          this.setState({ calibrated: true })
        }} title="Done rotating" />

      </View>
    )

  }

  renderPopup = () => {
    return (<PopupDialog
      ref={(popupDialog) => { this.popupDialog = popupDialog }} >
      {this._renderPopUpView()}
    </PopupDialog>)
  }


  render = () => {

    if (this.state.loading) {
      return (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Text> Connecting to Ultrasonic.... </Text>
        </View>
      )
    }

    const { navigate } = this.props.navigation


    return (
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
    )

    // const { navigate } = this.props.navigation
    // return <MountingView navigate={navigate} heading={this.state.heading} />
  }




}

export default Mounting
