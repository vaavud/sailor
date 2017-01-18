// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,Button
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class History extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    return (<View style={{ flex: 1, backgroundColor: 'pink' }} >
      <Button title="AddSpot" onPress={() => {
        this.props.push({ key: 'summary' })
      } } />
    </View>)
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  console.log('reduxStore', reduxStore.history)
  return {
    isloading: reduxStore.history.loading,
    sessions: reduxStore.history.sessions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(History)
