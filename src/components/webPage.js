// @flow
'use strict'

import {
  StyleSheet,
  View,
  WebView,
} from 'react-native'

import React, { Component } from 'react'

export default class WebPage extends Component {

  render(){
    return (
      <View style={style.container}>
        <WebView
          source={{uri: this.props.componentProps.url}}
          messageingEnable={true} />
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'stretch'
  }
})
