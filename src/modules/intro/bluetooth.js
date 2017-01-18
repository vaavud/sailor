// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,Button,Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Bluethooth extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink',paddingTop:100 }} >
        <Text> Bluethooth </Text>
        <Button title="Next" onPress={() => {
          this.props.nav({ type: 'push', key: 'summary' })
        } } />
        <Button title="Back" onPress={() => {
          this.props.nav({ type: 'pop' })
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

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Bluethooth)
