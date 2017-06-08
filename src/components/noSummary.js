// @flow

'use strict'

import React, { Component } from 'react'

import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Linking
} from 'react-native'

import {
  textStyle
} from './text'

import Button from '../reactcommon/components/button'
import Colors from '../../assets/colorTheme'


const ic_noPoint = require('../../assets/icons/icNoInformation.png')

const { width } = Dimensions.get('window')


export default class NoSummary extends Component {

  render() {
    return (<View style={style.container} >
      <Image source={ic_noPoint} />
      <Text style={style.title}> Session Lost!! </Text>
      <Text style={style.message}> Sorry there is a problem with this measurement. It seems like the wind blew the data away from the history. Please take a new measurement. </Text>

      <Button buttonStyle={style.buttonBackStyle}
        textStyle={style.buttonBackText}
        title="BACK"
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
    ...textStyle.normal,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374551',
    marginTop: 20
  },
  message: {
    ...textStyle.normal,
    width: width - 80,
    textAlign: 'center',
    color: '#5F5F5F',
    marginTop: 10
  },
  buttonBackStyle: {
    width: width - 80,
    height: 40,
    borderRadius: 5,    
    backgroundColor: Colors.vaavudBlue,
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10
  },
  buttonBackText: {
    ...textStyle.normal,
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonFaqStyle: {
    height: 40,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 1
  },
  buttonFaqText: {
    ...textStyle.normal,
    color: Colors.vaavudBlue,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
