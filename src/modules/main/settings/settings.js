// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, updateSettings } from '../../../actions/settings'

import SettingsView from '../../../views/main/settings'


class Settings extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {
    console.log('mount')

  }

  componentWillUnmount() {
    console.log('unmount')

  }


  render() {
    return (
      <SettingsView
        updateSettings={this.props.updateSettings}
        logout={this.props.logout}
        settings={this.props.settings}
        battery={this.props.battery}
        push={this.props.push} />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings,
    battery: reduxStore.app.battery
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: bindActionCreators(logout, dispatch),
    updateSettings: bindActionCreators(updateSettings, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Settings)
