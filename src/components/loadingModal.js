'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native'

import Colors from '../../assets/colorTheme'

const logo = require('../../assets/icons/logo.png')
const {width, height} = Dimensions.get('window')

export default class LoadingModal extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired
  }

  render(){
    if (this.props.isActive){
      return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <Image source={logo} />
          <ActivityIndicator animating={true} />
        </View>
      </View>
      )
    } else {
      return null
    }
  }
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  innerContainer:{
    position: 'absolute',
    top: 20,
    left: 20,
    bottom: 20,
    right: 20,
    width: width - 40,
    height: height - 40,
    borderRadius: 40,
    backgroundColor: Colors.vaavudBlue,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
