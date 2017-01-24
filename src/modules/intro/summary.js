// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button, Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Summary extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink', paddingTop: 100 }} >
        <Text> Everything was correct, enjoy your vaavud ble </Text>
        <Button title="Finish" onPress={() => {
          
        } } />
      </View>
    )
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Summary)
