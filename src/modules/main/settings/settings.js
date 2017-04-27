// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, updateSettings } from '../../../actions/settings'
import { goToBleSetup } from '../../../actions/bluetooth'

import SettingsView from '../../../views/main/settings'


class Settings extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  componentWillUnmount() {
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
        goToSetup={this.props.goToBleSetup}
        harbor={this.props.harbor}/>
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
    updateSettings: bindActionCreators(updateSettings, dispatch),
    goToBleSetup: bindActionCreators(goToBleSetup, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Settings)
