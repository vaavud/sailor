// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ActivityIndicator,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'

import Colors from '../../../../assets/colorTheme'

const logo = require('../../../../assets/logo-login.png')
const checkmark = require('../../../../assets/checkmark.png')

export default class ConnectingView extends Component {

  static propType = {
    isBleReady: PropTypes.bool.isRequired,
    isLocationReady: PropTypes.bool.isRequired
  }

  _renderHeader(){
    return (
      <View style={style.headerContainer} >
        <Text style={style.headerText} >{'Preparing to start measuring'}</Text>
      </View>
    )
  }

  _renderStatusSection(){
    return (
      <View style={style.statusSection}>
        {this._renderLocationStatusRow()}
        {this._renderDeviceStatusRow()}
      </View>
    )
  }

  _renderStatusIcon(isReady){
    return isReady ?
      (
        <ActivityIndicator
          animating={isReady} />
      )
      :
      (
        <Image
          style={style.checkmark}
          source={checkmark} />
      )
  }

 _renderLocationStatusRow(){
    return (
      <View style={style.rowContainer} >
        <Text>{'Location service'}</Text>
        {this._renderStatusIcon(this.props.isLocationReady)}
      </View>
    )
  }

  _renderDeviceStatusRow(){
    return (
      <View style={style.rowContainer} >
        <Text>{'Device status'}</Text>
        {this._renderStatusIcon(this.props.isBleReady)}
      </View>
    )
  }

  render(){
    return (
      <View style={style.container}>
        <Image style={style.logo}
          source={logo} />
        {this._renderHeader()}
        {this._renderStatusSection()}
      </View>
    )
  }

}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: Colors.background
  },
  headerContainer: {
    padding: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  statusSection: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)'
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
    tintColor: 'green'
  }
})
