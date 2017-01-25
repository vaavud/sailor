// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native'

import { SegmentedControls } from 'react-native-radio-buttons'

import Colors from '../../../../assets/colorTheme'

import I18n from '../../../components/i18n'

import {
  time_conv, speed_conv, SpeedUnits, temp_conv, angle_conv, TempCUnits,
  angle_conv_inverse, temp_conv_inverse
} from '../../../reactcommon/utils'

const { width, height } = Dimensions.get('window')

export default class SettingsView extends Component{

  static propTypes = {
    updateSettings: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
  }

  _renderSectionHeader(text){
    return (
      <View style={style.sectionHeader} >
        <Text>{I18n.t(text)}</Text>
      </View>
    )
  }

  _renderLink(text, func){
    // TODO =)
  }

  _renderWindspeedSelector(){
    return (
      <View style={style.segmentedContainer} >
        <Text>{I18n.t('windSpeed')}</Text>
        <SegmentedControls style={style.segmentedControl} //WindSpeed
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
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
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
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
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
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
          tint={'#f80046'}
          selectedTint={'white'}
          backTint={'#1e2126'}
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
  }
})
