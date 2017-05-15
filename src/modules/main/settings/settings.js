// @flow

'use strict'

import React, { PureComponent } from 'react'
import {
  Image
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, updateSettings } from '../../../actions/settings'
import { goToBleSetup, doneIntro } from '../../../actions/bluetooth'

import SettingsView from '../../../views/main/settings'
import icons from '../../../reactcommon/icons'


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
    goToBleSetup: bindActionCreators(goToBleSetup, dispatch),
    doneIntro: bindActionCreators(doneIntro, dispatch),
  }
}


@connect(mapReduxStoreToProps, mapDispatchToProps)
export default class extends PureComponent {

  static navigationOptions = {
    tabBarLabel: 'Settings',
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={icons.settings}
        style={{ tintColor }}
      />
    )
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <SettingsView
        updateSettings={this.props.updateSettings}
        logout={this.props.logout}
        windMin={this.props.harbor.windMin}
        windMax={this.props.harbor.windMax}
        settings={this.props.settings}
        battery={this.props.battery}
        push={navigate}
        goToAlignUltrasonic={() => navigate('Alignment')}
        goToSetup={this.props.goToBleSetup}
        calibrateBle={this.props.doneIntro}
        harbor={this.props.harbor} />
    )
  }
}

