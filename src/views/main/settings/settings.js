// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'

import { SegmentedControls } from 'react-native-radio-buttons'

import Colors from '../../../../assets/colorTheme'

import I18n from '../../../components/i18n'

import {
  SmallText,
  NormalText
} from '../../../components/text'

import Button from '../../../reactcommon/components/button'

import {
  time_conv, speed_conv, SpeedUnits, temp_conv, angle_conv, TempCUnits,
  angle_conv_inverse, temp_conv_inverse
} from '../../../reactcommon/utils'

export default class SettingsView extends Component{

  static propTypes = {
    updateSettings: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isBleDeviceConnected: PropTypes.bool.isRequired,
    deviceSerialNo: PropTypes.string.isRequired,
    deviceBatteryLevel: PropTypes.number.isRequired,
  }

  _getTemperatureValue(e) {
    this.props.updateSettings('temperature', temp_conv_inverse[e])
  }

  _getDirectionValue(e) {
    this.props.updateSettings('direction', angle_conv_inverse[e])
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

  _renderSectionHeader(text){
    return (
      <View style={style.sectionHeader} >
        <NormalText textContent={I18n.t(text)} />
      </View>
    )
  }

  _renderDeviceText(description, value){
    return (
      <View style={style.deviceTextContainer} >
        <NormalText style={style.deviceText} textContent={description} />
        <NormalText style={style.deviceText} textContent={value} />
      </View>
    )
  }

  _renderLink(text, func){
    return (
      <Button
        textStyle={style.buttonText}
        title={I18n.t(text)}
        onPress={func}/>
    )
  }

  _renderWindspeedSelector(){
    return (
      <View style={style.segmentedContainer} >
        <Text>{I18n.t('windSpeed')}</Text>
        <SegmentedControls style={style.segmentedControl} //WindSpeed
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[speed_conv['m/s'].short, speed_conv['km/h'].short, speed_conv.knots.short, speed_conv.mph.short]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getWindSpeedValue(e)}
          selectedOption={SpeedUnits[this.props.settings.windSpeed]}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={2}
          containerStyle={{borderRadius: 2}}
          />
      </View>
    )
  }

   _renderDirectionSelector(){
    return (
      <View style={style.segmentedContainer} >
        <Text>{I18n.t('direction')}</Text>
        <SegmentedControls style={style.segmentedControl} //WindSpeed
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[angle_conv.deg.long, angle_conv.card.long]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getDirectionValue(e)}
          selectedOption={angle_conv[this.props.settings.direction].long}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={2}
          containerStyle={{borderRadius: 2}}
          />
      </View>
    )
  }

  _renderTemperatureSelector(){
    return (
      <View style={style.segmentedContainer} >
        <Text>{I18n.t('temperature')}</Text>
        <SegmentedControls //Temperature
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[temp_conv.cel.short, temp_conv.fahr.short]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getTemperatureValue(e)}
          selectedOption={TempCUnits[this.props.settings.temperature]}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={2}
          containerStyle={{borderRadius: 2}}
          />
      </View>
    )
  }

  _renderWindPrefrences(){
    return (
      <View style={style.prefernceContainer} >
        <NormalText style={style.preferenceText} textContent={'Your preferred wind range is'} />
        <NormalText style={style.preferenceText} textContent={'5 m/s to 11 m/s'} />
        {this._renderLink('editPref', () => console.log('hit edit pref'))}
      </View>
    )
  }

  _renderShowColors(){
    return (
      <View style={style.segmentedContainer} >
        <Text>{I18n.t('showColors')}</Text>
        <SegmentedControls //Temperature
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={['Yes', 'No']}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => console.log('TODO')}
          selectedOption={1}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={2}
          containerStyle={{borderRadius: 2}}
          />
      </View>
    )
  }

  _renderDeviceStatus(){
    const {
      isBleDeviceConnected
    } = this.props
    return (
      <View style={style.deviceStatusContainer} >
        <View style={style.deviceStatusInnerContainer} >
          {this._renderDeviceText('Serial no.', 'xxxxx-xxxx-xxxxx')}
          {this._renderDeviceText('Battery level', '88 %')}
          <Button
            title={isBleDeviceConnected ? 'Disconnect' : 'Connect'}
            textStyle={style.buttonText} />
        </View>
      </View>
    )
  }

  _goToWeb(link){
    this.props.push(({key: 'web', props:{url: link}}))
  }

  _renderOthersSection(){
    return (
      <View style={style.otherSectionContainer} >
        {this._renderLink('vaavud', () =>  this._goToWeb('https://vaavud.com'))}
        {this._renderLink('termsButton', () => this._goToWeb('https://vaavud.com/terms/') )}
        {this._renderLink('privacyButton', () => this._goToWeb('https://vaavud.com/privacy-policy/') )}
        {this._renderLink('logout', () => this.props.logout() )}
        {this._renderLink('appGuide', () => {
          console.log('hit vaavud link')
          //TODO app guide link??
          }
        )}
      </View>
    )
  }

  render(){
    return (
        <ScrollView style={style.container} >
          {this._renderSectionHeader('unitText')}
          {this._renderWindspeedSelector()}
          {this._renderDirectionSelector()}
          {this._renderTemperatureSelector()}
          {this._renderSectionHeader('deviceStatus')}
          {this._renderDeviceStatus()}
          {this._renderSectionHeader('prefrencesText')}
          {this._renderWindPrefrences()}
          {this._renderShowColors()}
          {this._renderSectionHeader('otherSection')}
          {this._renderOthersSection()}
        </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: Colors.background
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  segmentedContainer: {
    paddingHorizontal: 15,
    paddingTop: 15
  },
  segmentedControl: {
    justifyContent:'center',
    height: 30,
  },
  deviceStatusContainer: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 20,
  },
  deviceStatusInnerContainer: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    borderRadius: 5
  },
  deviceTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deviceText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16
  },
  prefernceContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center'
  },
  preferenceText: {
    margin: 5,
    fontSize: 16
  },
  buttonText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    color: Colors.vaavudBlue
  },
  otherSectionContainer: {
    margin: 30,
    alignItems: 'center'
  }
})
