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

import { SegmentedControls } from 'react-native-radio-buttons'

import {
  time_conv, speed_conv, SpeedUnits, temp_conv, angle_conv, TempCUnits,
  angle_conv_inverse, temp_conv_inverse
} from '../../../reactcommon/utils'


class Settings extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render(){
    return (
      <SettingsView
        updateSettings={this.props.updateSettings}
        logout={this.props.logout}
        settings={this.props.settings}
        push={this.props.push} />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  console.log(reduxStore.settings)
  return {
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: bindActionCreators(logout, dispatch),
    updateSettings: bindActionCreators(updateSettings, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Settings)
