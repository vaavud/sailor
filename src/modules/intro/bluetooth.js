// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,  Text,
  NativeEventEmitter,
  NativeModules,
  Image,StyleSheet
} from 'react-native'

import Button from '../../reactcommon/components/button'

import Colors from '../../../assets/colorTheme'
const correct = require('../../../assets/icons/correct.png')


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class Bluethooth extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)

    this.state = {
      myModuleEvt,
      readyToWork: false
    }

    this.onBleConnected = this.onBleConnected.bind(this)

  }

  componentDidMount() {
    this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)
    this.state.myModuleEvt.addListener('onVaavudBleFound', this.onVaavudBleFound)

    NativeModules.VaavudBle.onConnect()
  }

  componentWillUnmount() {
    NativeModules.VaavudBle.onDisconnect()
    this.state.myModuleEvt.removeAllListeners('onBleConnected')
    this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    this.state.myModuleEvt.removeAllListeners('onNewRead')
    this.state.myModuleEvt.removeAllListeners('onReadyToWork')
    this.state.myModuleEvt.removeAllListeners('onVaavudBleFound')
  }


  onStateHasChanged(ble) {
    console.log('status', ble)
  }

  onVaavudBleFound(ble) {
    console.log('onVaavudBleFound', ble)
  }

  onNewRead(read) {
    console.log('read', read)
    NativeModules.VaavudBle.onDisconnect()
  }

  onReadyToWork() {
    console.log('onReadyToWork')
  }

  onBleConnected(data) {
    console.log('callback', data)
    this.setState({ readyToWork: true })
    this.props.nav({ type: 'push', key: 'summary' })
  }


  render() {
    return (
      <View style={style.container} >
        <Image source={correct} style={{ height: 90, width: 90 }} />
        <Text style={style.heading} >Success</Text>
        <Text style={style.description} >Vaavud ultrasonic connected</Text>
        <Text style={style.description} >Serial no. 15589-545946-151561-54545</Text>
        <View style={{ flexDirection: 'row' }} >
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            onPress={() => this.props.nav({ type: 'push', key: 'bluetooth' })}
            title="Continue" />
        </View>
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
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Bluethooth)


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
    marginBottom:20
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