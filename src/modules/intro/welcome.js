// @flow

'use strict'

import React, { Component } from 'react'
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'
import Button from '../../reactcommon/components/button'

import {
  HeadingText,
  NormalText,
  textStyle
} from '../../components/text'

import Colors from '../../../assets/colorTheme'
const ic_bluetooth = require('../../../assets/icons/bluetooth.png')
const locactionLogo = require('../../../assets/icons/ico-pin-map.png')
const buildingOne = require('../../../assets/icons/ico-bulding-1.png')
const buildingTwo = require('../../../assets/icons/ico-building-2.png')
const tree = require('../../../assets/icons/ico-tree-1.png')
const bgmap = require('../../../assets/images/bgmap.png')
const overlay = require('../../../assets/images/overlay.png')



import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showError } from '../../actions/utils'
import { skipIntro } from '../../actions/bluetooth'

import PopupDialog from 'react-native-popup-dialog'
import Permissions from 'react-native-permissions'


const { height, width } = Dimensions.get('window')

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
    this._permissions = this._permissions.bind(this)

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

  _permissions() {
    Permissions.getPermissionStatus('location').then(response => {
      if (response === 'authorized') {
        const { navigate } = this.props.navigation
        navigate('Connecting')
      }
      else {
        this.popupDialog.show()
      }
    })
  }

  _onContinue() {
    Permissions.requestPermission('location').then(location => {
      if (location === 'authorized') {
        const { navigate } = this.props.navigation
        navigate('Connecting')
      }
    })
  }

  render() {
    return (
      <View style={style.container} >
        <Image source={ic_bluetooth} style={{ height: 90, width: 75 }} />
        <HeadingText style={style.heading} textContent={'Connect'} />
        <NormalText style={style.description} textContent={'Let’s connect your wind meter.\nPlace it next to your phone and hit\ncontinue'} />
        <View style={{ height: 120 }} >
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            onPress={this._permissions}
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
            onPress={this._onContinue}
            title="Accept" />
          <Button buttonStyle={style.buttonSkip}
            textStyle={style.buttonText}
            onPress={() => this.popupDialog.dismiss()}
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
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.vaavudBlue
  },
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
  heading: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    marginTop: 10
  },
  description: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10
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
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: width - 80,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  buttonSkip: {
    height: 40,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  buttonTextSkip: {
    ...textStyle.normal,
    textAlign: 'center',
    color: Colors.inputTextColor
  },
  buttonText: {
    ...textStyle.normal,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
