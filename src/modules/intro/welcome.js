// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Text, NativeModules, NativeEventEmitter, StyleSheet, Image
} from 'react-native'
import Button from '../../reactcommon/components/button'


import Colors from '../../../assets/colorTheme'
const bluetooth = require('../../../assets/icons/bluetooth.png')



import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showError } from '../../actions/utils'

class Welcome extends Component {

  constructor(props) {
    super(props)

    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)


    this.state = {
      bleStatus: 'poweredOff',
      myModuleEvt
    }

    this.onStateHasChanged = this.onStateHasChanged.bind(this)

  }

  componentDidMount() {
    // const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    // this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    // this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)

    NativeModules.VaavudBle.initBle()

  }

  componentWillUnmount() {
    // this.state.myModuleEvt.removeAllListeners('onBleConnected')
    this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
    // this.state.myModuleEvt.removeAllListeners('onNewRead')
    // this.state.myModuleEvt.removeAllListeners('onReadyToWork')
  }

  onStateHasChanged(ble) {
    this.setState({ status: ble.status })
    console.log('status', ble)
  }

  onNewRead(read) {
    console.log('read', read)
  }

  onReadyToWork() {
    console.log('onReadyToWork')
  }

  onBleConnected(data) {
    console.log('callback', data)
  }

  render() {
    return (
      <View style={style.container} >
        <Image source={bluetooth} style={{ height: 90, width: 75 }} />
        <Text style={style.heading} >Connect</Text>
        <Text style={style.description} >{'Let’s connect your windmeter.\n Place it next to your phone and hit \n conintue'}</Text>
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
    showError: bindActionCreators(showError, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Welcome)


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
    marginTop: 10
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
