'use strict'

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import Colors from '../../assets/colorTheme'


class Loading extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ backgroundColor: Colors.background, flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Text>{this.props.status}</Text>
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
