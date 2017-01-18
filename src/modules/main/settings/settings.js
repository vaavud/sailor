// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout, updateSettings } from '../../../actions/settings'

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


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'green', marginTop: 100 }} >
        <Button title="Logout" onPress={() => {
          this.props.logout()
        } } />


        <SegmentedControls //Time interval
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
          options={[time_conv.sec.long, time_conv.noLimit.long]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getTimeValue(e)}
          selectedOption={time_conv[this.props.settings.timeInterval].long}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={{ flex: 1 }}
          />

         <SegmentedControls //WindSpeed
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
          options={[speed_conv['m/s'].short, speed_conv['km/h'].short, speed_conv.knots.short, speed_conv.mph.short]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getWindSpeedValue(e)}
          selectedOption={SpeedUnits[this.props.settings.windSpeed]}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={{ flex: 1 }}
          />

        <SegmentedControls //Direction
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
          options={[angle_conv.deg.long, angle_conv.card.long]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getDirectionValue(e)}
          selectedOption={angle_conv[this.props.settings.direction].long}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={{ flex: 1 }}
          />


        <SegmentedControls //Temperature
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
          options={[temp_conv.cel.short, temp_conv.fahr.short]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getTemperatureValue(e)}
          selectedOption={TempCUnits[this.props.settings.temperature]}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={{ flex: 1 }}
          />

      </View>
    )
  }

  _getTemperatureValue(e) {
    this.props.updateSettings('temperature', temp_conv_inverse[e])
  }

  _getDirectionValue(e) {
    this.props.updateSettings('direction', angle_conv_inverse[e])
  }

  _getTimeValue(e) {
    if (e === '30 Seconds') {
      this.props.updateSettings('timeInterval', 'sec')
    }
    else {
      this.props.updateSettings('timeInterval', 'noLimit')
    }

  }

  _getWindSpeedValue(e) {
    switch (e) {
      case 'm/s':
        this.props.updateSettings('windSpeed', 'mps')
        break
      case 'mph':
        this.props.updateSettings('windSpeed', 'mph')
        break
      case 'km/h':
        this.props.updateSettings('windSpeed', 'kmh')
        break
      case 'knots':
        this.props.updateSettings('windSpeed', 'knots')
        break
    }
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
