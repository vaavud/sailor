// @flow

'use strict'

import React, { PureComponent } from 'react'

import HistoryView from '../../../views/main/history'

import { Image } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import NoHistory from '../../../components/NoHistory'
import { deleteSession } from '../../../actions/history'
import icons from '../../../reactcommon/icons'

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

@connect(mapReduxStoreToProps, mapDispatchToProps)
export default class extends PureComponent {

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
      const { navigate } = this.props.screenProps.navigation
      return (
        <HistoryView
          onNextPress={navigate}
          sessions={this.props.sessions}
          deleteSession={this.props.deleteSession} />
      )
    } else {
      return <NoHistory />
    }
  }

}

