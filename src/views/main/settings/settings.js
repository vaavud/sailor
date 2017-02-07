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

import Button from '../../../reactcommon/components/button'

import {
  time_conv, speed_conv, SpeedUnits, temp_conv, angle_conv, TempCUnits,
  angle_conv_inverse, temp_conv_inverse
} from '../../../reactcommon/utils'

export default class SettingsView extends Component{

  static propTypes = {
    updateSettings: PropTypes.func.isRequired,
    isBleDeviceConnected: PropTypes.bool.isRequired,
    deviceSerialNo: PropTypes.string.isRequired,
    deviceBatteryLevel: PropTypes.number.isRequired,
  }

  _renderSectionHeader(text){
    return (
      <View style={style.sectionHeader} >
        <Text>{I18n.t(text)}</Text>
      </View>
    )
  }

  _renderDeviceText(description, value){
    return (
      <View style={style.deviceTextContainer} >
        <Text style={style.deviceText}>{description}</Text>
        <Text style={style.deviceText}>{value}</Text>
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
          selectedOption={1}
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
          selectedOption={1}
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
          selectedOption={1}
          optionStyles={{ fontFamily: 'AvenirNext-Medium' }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={2}
          containerStyle={{borderRadius: 2}}
          />
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
          {this._renderDeviceText('serialNo', 'TODO get value =)')}
          {this._renderDeviceText('batteryLevel', 'TODO get value =)')}
          <Button
            title={isBleDeviceConnected ? 'Disconnect' : 'Connect'}
            textStyle={style.buttonText} />
        </View>
      </View>
    )
  }

  _renderOthersSection(){
    return (
      <View style={style.otherSectionContainer} >
        {this._renderLink('vaavud', () => console.log('hit vaavud link') )}
        {this._renderLink('termsButton', () => console.log('hit vaavud link') )}
        {this._renderLink('privacyButton', () => console.log('hit vaavud link') )}
        {this._renderLink('logout', () => console.log('hit vaavud link') )}
        {this._renderLink('appGuide', () => console.log('hit vaavud link') )}        
      </View>
    )
  }

  render(){
    return (
      <View style={style.container} >
        <ScrollView style={style.scrollView} >
          {this._renderSectionHeader('unitText')}
          {this._renderWindspeedSelector()}
          {this._renderDirectionSelector()}
          {this._renderTemperatureSelector()}
          {this._renderSectionHeader('prefrencesText')}
          {/* TODO find out what goes in this section */}
          {this._renderShowColors()}
          {this._renderSectionHeader('deviceStatus')}
          {this._renderDeviceStatus()}
          {this._renderSectionHeader('otherSection')}
          {this._renderOthersSection()}
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 40,
  },
  deviceStatusContainer: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 20,
  },
  deviceStatusInnerContainer: {
    padding: 10,
    backgroundColor: 'grey'
  },
  deviceTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  deviceText: {
    margin: 5,
    fontSize: 16
  },
  buttonText: {
    margin: 5,
    fontSize: 16,
    color: Colors.vaavudBlue
  },
  otherSectionContainer: {
    margin: 30,
    alignItems: 'center'
  }
})
