// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native'

import { SegmentedControls } from 'react-native-radio-buttons'

import Button from '../../../reactcommon/components/button'
import { convertWindSpeed, SpeedUnitsUI, SpeedUnits, mSpeeedUnits, } from '../../../reactcommon/utils'
import { forecastWindDirections } from '../../../reactcommon/forecastIcons'

import Colors from '../../../../assets/colorTheme'
import { textStyle } from '../../../components/text'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { saveHarbor, saveProfile } from '../../../actions/harbor'

import { updateSettings } from '../../../actions/settings'


// let SelectorView = requireNativeComponent('SelectorViewSwift', WindHarbor)

const { width } = Dimensions.get('window')

const logo = require('../../../../assets/icons/logo.png')


class WindHarbor extends Component {

  constructor(props) {
    super(props)

    if (props.componentProps.isFromSettings) {

      this.state = {
        windMin: 1,
        windMax: 16,
        windSpeedUnit: 'mps', //TODO
        loading: false,
        isFromSettings: true,
        currentMinSpeed: props.harbor.windMin,
        currentMaxSpeed: props.harbor.windMax,
        dommyData: [
          {
            color: '#7a868c',
            windSpeed: Math.floor(convertWindSpeed(props.harbor.windMin - 1, props.settings.windSpeed)),
            windDirection: 195,
            day: 'No wind /\n It\'s dark'
          },
          {
            color: '#00a1e1',
            windSpeed: Math.floor(convertWindSpeed(props.harbor.windMax - ((props.harbor.windMax - props.harbor.windMax) / 2), props.settings.windSpeed)),
            windDirection: 10,
            day: 'It\'s perfect \nfor you!'
          },
          {
            color: '#d12a2f',
            windSpeed: Math.floor(convertWindSpeed(props.harbor.windMax + 2, props.settings.windSpeed)),
            windDirection: 10,
            day: 'Too windy \nfor you!'
          }
        ]
      }

    }
    else {
      this.state = {
        windMin: 1,
        windMax: 16,
        windSpeedUnit: 'mps',
        loading: false,
        isFromSettings: false,
        currentMinSpeed: props.harbor.windMin,
        currentMaxSpeed: props.harbor.windMax,
        latlon: { lat: props.componentProps.location.latitude, lon: props.componentProps.location.longitude },
        name: props.componentProps.locationName,
        id: props.componentProps.id,
        dommyData: [
          {
            color: '#7a868c',
            windSpeed: Math.floor(convertWindSpeed(props.harbor.windMin - 1, props.settings.windSpeed)),
            windDirection: 195,
            day: 'No wind /\n It\'s dark'
          },
          {
            color: '#00a1e1',
            windSpeed: Math.floor(convertWindSpeed(props.harbor.windMax - ((props.harbor.windMax - props.harbor.windMax) / 2), props.settings.windSpeed)),
            windDirection: 10,
            day: 'It\'s perfect \nfor you!'
          },
          {
            color: '#d12a2f',
            windSpeed: Math.floor(convertWindSpeed(props.harbor.windMax + 2, props.settings.windSpeed)),
            windDirection: 10,
            day: 'Too windy \nfor you!'
          }
        ]
      }
    }

    this._onFinish = this._onFinish.bind(this)
  }

  _getWindSpeedValue(e) {
    switch (e) {
      case 'm/s':
        this.props.updateSettings('windSpeed', mSpeeedUnits.mps)
        break
      case 'mph':
        this.props.updateSettings('windSpeed', mSpeeedUnits.mph)
        break
      case 'km/h':
        this.props.updateSettings('windSpeed', mSpeeedUnits.kmh)
        break
      case 'knots':
        this.props.updateSettings('windSpeed', mSpeeedUnits.knots)
        break
    }
  }


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _onFinish() {

    let profile = {
      minSpeed: this.state.currentMinSpeed,
      maxSpeed: this.state.currentMaxSpeed
    }

    if (this.state.isFromSettings) {
      this.props.saveProfile(profile, true).then(() => this.props.pop())
    }
    else {
      let harbor = {
        location: this.state.latlon,
        name: this.state.name,
        directions: { N: true, E: true, W: true, S: true, NE: true, NW: true, SW: true, SE: true }
      }
      this.props.saveProfile(profile, false)
        .then(this.props.saveHarbor(harbor, this.state.id))
        .then(() => this.props.pop(true))
    }
  }

  _renderSpotDayTest(_spot) {
    let days = []

    for (let index in _spot) {
      days.push(
        <View style={style.spotTest} key={index}>
          <View style={style.spotContainerWind}>
            <Image
              resizeMode="cover"
              source={forecastWindDirections[_spot[index].color]}
              style={[style.spotImageWind, { transform: [{ 'rotate': _spot[index].windDirection + 'deg' }] }]} />
            <Text style={style.spotLable}>{_spot[index].windSpeed}</Text>
          </View>
          <Text style={[style.spotLable, { marginTop: 5 }]}>{_spot[index].day}</Text>
        </View>
      )
    }
    return days
  }

  renderExplanation() {
    return (
      <View style={{ height: 150, marginTop: 5, backgroundColor: Colors.container, borderRadius: 5 }} >

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.5, margin: 10 }}>
            <Text style={{ fontSize: 13, color: Colors.textColor, backgroundColor: 'transparent', marginTop: 3 }}>Color explanation</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#80a4b3' }} />
        <View style={style.spotContainer}>
          {this._renderSpotDayTest(this.state.dommyData)}
        </View>
      </View>
    )
  }

  _renderSlider() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={textStyle.normal}>Your suggested wind range is </Text>
        <Text style={textStyle.normal}>
          from
              <Text style={textStyle.normal} > {convertWindSpeed(this.state.currentMinSpeed, this.props.settings.windSpeed).toFixed(0)} </Text>
          to
              <Text style={textStyle.normal} > {convertWindSpeed(this.state.currentMaxSpeed, this.props.settings.windSpeed).toFixed(0)} </Text>
        </Text>

        <MultiSlider
          containerStyle={{ marginTop: 30, marginBottom: -20 }}
          values={[this.state.currentMinSpeed, this.state.currentMaxSpeed]}
          min={this.state.windMin}
          max={this.state.windMax}
          onValuesChange={(values) => { this.setState({ currentMinSpeed: values[0], currentMaxSpeed: values[1] }) }}
        />

        <Text style={{ ...textStyle.normal, textAlign: 'center' }} >{'Move the sliders\nto fine tune the range'}</Text>
      </View>
    )
  }

  // onValuesChangeFinish={(values) => {
  //           this.setState({ currentMinSpeed: values[0], currentMaxSpeed: values[1] })
  //         }}

  _renderSegmented() {
    return (
      <View style={style.segmentedContainer} >
        <Text>{'Unit'}</Text>
        <SegmentedControls style={style.segmentedControl}
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[SpeedUnitsUI.mps, SpeedUnitsUI.kmh, SpeedUnitsUI.mph, SpeedUnitsUI.knots]}
          allowFontScaling={false} // default: true
          selectedOption={SpeedUnits[this.props.settings.windSpeed]}
          optionStyle={{ ...textStyle.normal }}
          onSelection={(e, i) => this._getWindSpeedValue(e)}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={2} />
      </View>
    )
  }

  _renderButtons() {
    if (this.state.isFromSettings === true) {
      return (
        <View style={{ justifyContent: 'center', marginBottom: 20 }} >
          <Button
            textStyle={style.buttonText}
            buttonStyle={style.bottonButtonNext}
            title="Back"
            onPress={this._onFinish} />
        </View>
      )
    } else {
      return (
        <View style={{ justifyContent: 'flex-end' }} >
          <Button
            textStyle={style.buttonText}
            buttonStyle={style.bottonButtonNext}
            title="Finish"
            onPress={this._onFinish} />
          <Button
            textStyle={{ color: Colors.textColor }}
            buttonStyle={style.bottonButtonBack}
            title="Back"
            onPress={() => { this.props.pop() }} />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={style.container} >
        {this._renderSlider()}
        {this._renderSegmented()}
        {this.renderExplanation()}
        {this._renderButtons()}
      </View>
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    harbor: reduxStore.harbor,
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveHarbor: bindActionCreators(saveHarbor, dispatch),
    saveProfile: bindActionCreators(saveProfile, dispatch),
    updateSettings: bindActionCreators(updateSettings, dispatch)

  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 30
  },
  segmentedContainer: {
    marginTop: 10
  },
  segmentedControl: {
    justifyContent: 'center',
    height: 40,
  },
  bottonButtonBack: {
    height: 50,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 5
  },
  bottonButtonNext: {
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: Colors.vaavudBlue,
    borderColor: 'white',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white'
  },
  spotTest: {
    marginRight: 1,
    height: 90,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spotContainerWind: {
    marginTop: 10,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  spotImageWind: {
    height: 45,
    width: 45,
    position: 'absolute',
    top: 0
  },
  spotLable: {
    fontSize: 11,
    color: Colors.textColor,
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  spotContainer: {
    flexDirection: 'row',
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center'
  },
})

export default connect(mapReduxStoreToProps, mapDispatchToProps)(WindHarbor)
