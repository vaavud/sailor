'use strict'

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

import Colors from '../../assets/colorTheme'
const logo = require('../../assets/icons/logo.png')


class Loading extends Component {

  constructor(props) {
    super(props)

    
  }

  render() {
    return (
      <View style={{ backgroundColor: Colors.vaavudBlue, flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Image source={logo} style={{
          width: 110, height: 80, marginBottom: 25
        }} />
        <Text style={{ color: 'white' }}>{this.props.status}</Text>
      </View>)
  }
}


const mapReduxStoreToProps = (reduxStore) => {
  return {
    status: reduxStore.app.status
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(Loading)
