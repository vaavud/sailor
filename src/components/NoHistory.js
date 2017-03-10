// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button, Image, Text,StyleSheet
} from 'react-native'

const ic_empty = require('../../assets/icons/ic_empty.png')

export default class NoHistory extends Component {

  render() {
    return (<View style={style.container} >
        <Image source={ic_empty}  />
        <Text style={style.title}> Oooooops!! </Text>
        <Text style={style.message}> Looks like your history feed is empty. Create one by clicking “Vaavud” button below and let’s create magic! </Text>
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
    fontSize:16,
    fontWeight:'bold',
    color:'#374551',
    marginTop:40
  },
  message: {
    width:300,
    textAlign:'center',
    color:'#5F5F5F',
    marginTop:10
  }
})
