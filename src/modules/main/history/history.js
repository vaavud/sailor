// @flow

'use strict'

import React, { Component } from 'react'

import HistoryView from '../../../views/main/history'

import { Image } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import NoHistory from '../../../components/NoHistory'
import { deleteSession } from '../../../actions/history'
import icons from '../../../reactcommon/icons'

class History extends Component {

  static navigationOptions = {
    tabBarLabel: 'History',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={icons.history}
        style={{ tintColor }}
      />
    )
  }

  render = () => {
    if (this.props.sessions.length > 0) {
      return (
        <HistoryView
          onNextPress={this.props.screenProps.navigation}
          sessions={this.props.sessions}
          deleteSession={this.props.deleteSession} />
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
