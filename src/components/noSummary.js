// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Image, Text, StyleSheet, Dimensions, Linking
} from 'react-native'

import Button from '../reactcommon/components/button'
import Colors from '../../assets/colorTheme'


const ic_noPoint = require('../../assets/icons/ic_pointLost.png')

const { width, height } = Dimensions.get('window')


export default class NoSummary extends Component {

  render() {
    return (<View style={style.container} >
      <Image source={ic_noPoint} />
      <Text style={style.title}> Session Lost!! </Text>
      <Text style={style.message}> There was a problem with the sync in the server, we are sorry to anounce this session has been lost in the internet. </Text>

      <Button buttonStyle={style.buttonBackStyle}
        textStyle={style.buttonBackText}
        title="Back"
        onPress={() => this.props.pop()} />

      <Button buttonStyle={style.buttonFaqStyle}
        textStyle={style.buttonFaqText}
        title="FAQ"
        onPress={() => {
          Linking.canOpenURL('https://vaavud.com/faq/').then(
            Linking.openURL('https://vaavud.com/faq/')
          )
        }} />
    </View>)
  }
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374551',
    marginTop: 50
  },
  message: {
    width: 300,
    textAlign: 'center',
    color: '#5F5F5F',
    marginTop: 10
  },
  buttonBackStyle: {
    width: width - 100,
    height: 40,
    backgroundColor: Colors.vaavudBlue,
    justifyContent: 'center',
    marginTop: 60
  },
  buttonBackText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonFaqStyle: {
    width: width - 100,
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 1
  },
  buttonFaqText: {
    color: Colors.vaavudBlue,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }

})
