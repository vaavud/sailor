// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Text, NativeModules, NativeEventEmitter, StyleSheet, Image
} from 'react-native'
import Button from '../../reactcommon/components/button'


import Colors from '../../../assets/colorTheme'
const ic_bluetooth = require('../../../assets/icons/bluetooth.png')



import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showError } from '../../actions/utils'
import { skipIntro } from '../../actions/bluetooth'

import PopupDialog from 'react-native-popup-dialog'
import Permissions from 'react-native-permissions'


class Welcome extends Component {

  constructor(props) {
    super(props)

    // const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)


    this.state = {
      bleStatus: 'poweredOff',
      // myModuleEvt
    }

    this._onContinue = this._onContinue.bind(this)
    this.onStateHasChanged = this.onStateHasChanged.bind(this)
    this._renderPopup = this._renderPopup.bind(this)

  }

  componentDidMount() {
    // const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
    // this.state.myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    // this.state.myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    // this.state.myModuleEvt.addListener('onNewRead', this.onNewRead)
    // this.state.myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)

    // NativeModules.VaavudBle.initBle()

  }

  componentWillUnmount() {
    // this.state.myModuleEvt.removeAllListeners('onBleConnected')
    // this.state.myModuleEvt.removeAllListeners('onStateHasChanged')
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

  async _permissions() {
    let response = await Permissions.getPermissionStatus('location')
    return response === 'authorized'
  }

  async _onContinue() {
    let location = await Permissions.requestPermission('location')
    if (location === 'authorized') {
      this.props.nav({ type: 'push', key: 'bluetooth' })
    }
  }

  render() {
    return (
      <View style={style.container} >
        <Image source={ic_bluetooth} style={{ height: 90, width: 75 }} />
        <Text style={style.heading} >Connect</Text>
        <Text style={style.description} >{'Let’s connect your windmeter.\n Place it next to your phone and hit \n conintue'}</Text>
        <View style={{ height: 120 }} >
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            onPress={() => {
              if (this._permissions()) {
                this.props.nav({ type: 'push', key: 'connecting'})
              }
              else {
                this.popupDialog.show()
              }
            }}
            title="Continue" />

          <Button buttonStyle={style.buttonSkip}
            textStyle={style.buttonTextSkip}
            onPress={this.props.skipIntro}
            title="Skip" />
        </View>

        {this._renderPopup()}
      </View>
    )
  }


  _renderPopup() {
    return (<PopupDialog
      ref={(popupDialog) => { this.popupDialog = popupDialog }} >
      <View>
        <Button
          textStyle={style.buttonText}
          onPress={this._onContinue}
          title="Accept" />
        <Button
          textStyle={style.buttonText}
          onPress={() => this.popupDialog.dismiss()}
          title="Cancel" />
      </View>
    </PopupDialog>)
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showError: bindActionCreators(showError, dispatch),
    skipIntro: bindActionCreators(skipIntro, dispatch)
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
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: 300,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  buttonSkip: {
    height: 40,
    width: 300,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  buttonTextSkip: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.inputTextColor
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
