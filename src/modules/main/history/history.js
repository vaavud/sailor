// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button
} from 'react-native'

import HistoryView from '../../../views/main/history'

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
    console.log('hmmmm:::::', this.props.isloading)
    if (this.props.sessions.length > 0){
    return (
      <HistoryView
        onNextPress={() => {}}
        session={this.props.sessions} />
    )
    }else {return null}
  }

}

const mapReduxStoreToProps = (reduxStore) => {
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
