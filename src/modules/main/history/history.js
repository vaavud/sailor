// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import HistoryView from '../../../views/main/history'

class History extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {

    return <HistoryView sessions={this.props.sessions} onNextPress={this.props.push} />
    /*return (<View style={{ flex: 1, backgroundColor: 'pink' }} >
      <Button title="AddSpot" onPress={() => {
        this.props.push({ key: 'summary', props: { sessionKey: '-KcO9MzVO9elHpIYvLaC' } })
      }} />
    </View>)*/
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  console.log(reduxStore.history.sessions)
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
