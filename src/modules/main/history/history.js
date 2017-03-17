// @flow

'use strict'

import React, { Component } from 'react'

import HistoryView from '../../../views/main/history'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import NoHistory from '../../../components/NoHistory'
import { deleteSession } from '../../../actions/history'


class History extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    if (this.props.sessions.length > 0) {
      return (
        <HistoryView
          onNextPress={this.props.push}
          sessions={this.props.sessions}
          deleteSession={this.props.deleteSession}
          onPop={this.props.pop} />
      )
    } else {
      return <NoHistory />
    }
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
    deleteSession: bindActionCreators(deleteSession, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(History)
