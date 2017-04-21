// @flow

'use strict'

import React, { Component } from 'react'
import {
  Image
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, updateSettings } from '../../../actions/settings'

import SettingsView from '../../../views/main/settings'
import icons from '../../../reactcommon/icons'



class Settings extends Component {

  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={icons.settings}
        style={{ tintColor }}
      />
    )
  }

  render() {
    return (
      <SettingsView
        updateSettings={this.props.updateSettings}
        logout={this.props.logout}
        windMin={this.props.harbor.windMin}
        windMax={this.props.harbor.windMax}
        settings={this.props.settings}
        battery={this.props.battery}
        push={this.props.push}
        harbor={this.props.harbor} />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings,
    harbor: reduxStore.harbor,
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
