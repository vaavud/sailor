import React, {
  Component
} from 'react'

import {
  MountingView
} from '../../views/mounting'

import {
  NativeEventEmitter,
  NativeModules,
  Alert
} from 'react-native'

class Mounting extends Component {

  state = {
    readyToWork: false,
    location: 'connection...',
    ble: 'connection...',
    heading: 0
  }


  constructor(props) {
    super(props)

    this.myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
  }

  componentDidMount = () => {


    this.myModuleEvt.addListener('onBleState', this.onBleState)
    this.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)
    this.myModuleEvt.addListener('onLocationWorking', this.onLocationWorking)
    this.myModuleEvt.addListener('timeout', this.timeout)


    NativeModules.VaavudBle.initBle()
  }

  componentWillUnmount = () => {
    NativeModules.VaavudBle.onDisconnect()
    this._removeCallbacks()
  }

  timeout = () => {
    // NativeModules.VaavudBle.onDisconnect()
    // this._removeCallbacks()

    console.log('timeOut')

  }

  _removeCallbacks = () => {
    this.myModuleEvt.removeAllListeners('onBleState')
    this.myModuleEvt.removeAllListeners('onLocationWorking')
    this.myModuleEvt.removeAllListeners('onNewRead')
    this.myModuleEvt.removeAllListeners('onReadyToWork')
    this.myModuleEvt.removeAllListeners('onVaavudBleFound')
  }

  onBleState = data => {
    switch (data.status) {
      case 'off':
        Alert.alert('Bluetooth Error', 'Please turn the Bluetooth ON.', [{
          text: 'OK', onPress: () => { }
        }])
        break
      case 'unauthorized':
        Alert.alert('Bluetooth Error', 'In order to take a measurement please enable the Bluetooth permission.', [{
          text: 'OK', onPress: () => { }
        }])
        break
    }
  }

  onLocationWorking = location => {
    this.setState({ location: 'Connected' })
  }

  onVaavudBleFound = ble => {
    this.setState({ ble: 'Connected' })
  }

  onReadyToWork = () => {

  }

  onNewRead = point => {
    console.log('point', point.windDirection)
    console.log('point', point.windSpeed)
    this.setState({ heading: point.compass })
  }


  render = () => {
    const { navigate } = this.props.navigation
    return <MountingView navigate={navigate} heading={this.state.heading} />
  }

}

export default Mounting
