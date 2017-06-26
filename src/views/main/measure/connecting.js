// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ActivityIndicator,
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'

import {
  textStyle
} from '../../../components/text'

import Colors from '../../../../assets/colorTheme'

import Button from '../../../reactcommon/components/button'
const {width} = Dimensions.get('window')
const logo = require('../../../../assets/logo-login.png')
const checkmark = require('../../../../assets/checkmark.png')

export default class ConnectingView extends Component {

  static propType = {
    isBleReady: PropTypes.bool.isRequired,
    isLocationReady: PropTypes.bool.isRequired
  }

  _renderHeader() {
    return (
      <View style={style.headerContainer} >
        <Text style={style.headerText} >{'Preparing to start measuring'}</Text>
      </View>
    )
  }

  _renderStatusSection() {
    return (
      <View style={style.statusSection}>
        {this._renderLocationStatusRow()}
        {this._renderDeviceStatusRow()}
      </View>
    )
  }

  _renderStatusIcon(isReady) {
    return !isReady ?
      (
        <ActivityIndicator
          animating={true}
          color="#ffffff"  />
      )
      :
      (
        <Image
          style={style.checkmark}
          source={checkmark} />
      )
  }

  _renderLocationStatusRow() {
    return (
      <View style={style.rowContainer} >
          <Text style={style.statusText} >{'Location service'}</Text>
          {this._renderStatusIcon(this.props.isLocationReady)}
      </View>
    )
  }

  _renderDeviceStatusRow() {
    return (
      <View style={style.rowContainer} >
        <Text style={style.statusText} >{'Device status'}</Text>
        {this._renderStatusIcon(this.props.isBleReady)}
      </View>
    )
  }

  _renderTimeOut() {
    return (
      <View>
        <Text style={{ ...textStyle.normal, fontSize: 14, textAlign: 'center', width: width - 80, marginTop: 20, color: 'white', alignSelf: 'center' }}> {'We couldn\'t connect to your\nVaavud Ultrasonic.'}</Text>
        <Text style={{...textStyle.normal, fontSize: 14, textAlign: 'center', width: width - 80, marginTop: 5, color: 'white', alignSelf: 'center' }}> {'Please make sure bluetooth is\nturned ON'}</Text>
        <Button title="Try Again"
          buttonStyle={{ marginTop: 20,borderRadius: 5, height: 40, width: width - 80, alignSelf: 'center', backgroundColor: 'white', justifyContent: 'center' }}
          textStyle={{...textStyle.normal, color: Colors.vaavudBlue, textAlign: 'center' }}
          onPress={this.props.tryAgain} />
        <Button title="Cancel"
          buttonStyle={{marginTop: 10, height: 40, width: width - 80, alignSelf: 'center', justifyContent: 'center' }}
          textStyle={{...textStyle.normal, color: 'white', textAlign: 'center' }}
          onPress={this.props.jump} />
      </View>
    )
  }

  render() {
    return (
      <View style={style.container}>
        <View style={style.innerContainer}>
          <Image style={style.logo}
            source={logo} />
          {this._renderHeader()}
          {this._renderStatusSection()}

          {this.props.timeout ? this._renderTimeOut() : null}
        </View>
        <Button title={'CANCEL'}
            onPress={() => this.props.navigation.goBack()}
            buttonStyle={{marginBottom: 30, height: 40, alignSelf: 'center', justifyContent: 'center' }}
            textStyle={{...textStyle.normal, fontSize: 16, textAlign: 'center', backgroundColor: 'transparent', color: 'white'}} />
      </View>
    )
  }

}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: Colors.vaavudBlue,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    ...textStyle.normal,
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  statusSection: {
    width: width - 80,
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  statusText: {
    ...textStyle.normal,
    fontSize: 15,
    color: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20
  },
  checkmark: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    tintColor: 'white'
  }
})
