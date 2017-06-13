// @flow
'use strict'

import React, { Component, PropTypes } from 'react'

import {
  Dimensions,
  View,
  Linking,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
} from 'react-native'

import PopupDialog from 'react-native-popup-dialog'
import { SegmentedControls } from 'react-native-radio-buttons'

import Colors from '../../../../assets/colorTheme'

import I18n from '../../../components/i18n'

import {
  NormalText,
  HeadingText,
  textStyle
} from '../../../components/text'

import Button from '../../../reactcommon/components/button'

import { connect } from 'react-redux'

import {
  convertWindSpeed,
  SpeedUnits,
  temp_conv,
  angle_conv,
  TempCUnits,
  angle_conv_inverse,
  temp_conv_inverse,
  SpeedUnitsUI,
  mSpeeedUnits
} from '../../../reactcommon/utils'

const { width, height } = Dimensions.get('window')
const isIos = Platform.OS === 'ios'


class SettingsView extends Component {

  static propTypes = {
    updateSettings: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    windMin: PropTypes.number.isRequired,
    windMax: PropTypes.number.isRequired,
    isBleDeviceConnected: PropTypes.bool,
    deviceSerialNo: PropTypes.string,
    deviceBatteryLevel: PropTypes.number,
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

  _renderSectionHeader(text) {
    return (
      <View style={style.sectionHeader} >
        <NormalText textContent={I18n.t(text)} />
      </View>
    )
  }

  _renderDeviceText(description, value) {
    return (
      <View style={style.deviceTextContainer} >
        <NormalText style={style.deviceText} textContent={description} />
        <NormalText style={style.deviceText} textContent={value} />
      </View>
    )
  }

  _renderLink(text, func) {
    return (
      <Button
        textStyle={style.buttonText}
        title={I18n.t(text)}
        onPress={func} />
    )
  }

  _renderWindspeedSelector() {
    return (
      <View style={style.segmentedContainer} >
        <Text style={textStyle.normal} >{I18n.t('windSpeed')}</Text>
        <SegmentedControls style={style.segmentedControl} //WindSpeed
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[SpeedUnitsUI.mps, SpeedUnitsUI.kmh, SpeedUnitsUI.mph, SpeedUnitsUI.knots]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getWindSpeedValue(e)}
          selectedOption={SpeedUnits[this.props.settings.windSpeed]}
          optionStyle={{ ...textStyle.normal }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={isIos ? 1 : 2}
        />
      </View>
    )
  }

  _renderDirectionSelector() {
    return (
      <View style={style.segmentedContainer} >
        <Text style={textStyle.normal}>{I18n.t('direction')}</Text>
        <SegmentedControls style={style.segmentedControl} //WindSpeed
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[angle_conv.deg.long, angle_conv.card.long]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getDirectionValue(e)}
          selectedOption={angle_conv[this.props.settings.direction].long}
          optionStyle={{ ...textStyle.normal }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={isIos ? 1 : 2}
        />
      </View>
    )
  }

  _renderTemperatureSelector() {
    return (
      <View style={style.segmentedContainer} >
        <Text style={textStyle.normal}>{I18n.t('temperature')}</Text>
        <SegmentedControls //Temperature
          tint={Colors.segmSelectedTint}
          selectedTint={Colors.segmentedTint}
          backTint={Colors.segmentedTint}
          options={[temp_conv.cel.short, temp_conv.fahr.short]}
          allowFontScaling={false} // default: true
          onSelection={(e, i) => this._getTemperatureValue(e)}
          selectedOption={TempCUnits[this.props.settings.temperature]}
          optionStyle={{ ...textStyle.normal }}
          optionContainerStyle={style.segmentedControl}
          containerBorderWidth={isIos ? 1 : 2}
        />
      </View>
    )
  }

  _renderWindPrefrences() {
    const {
      windMin,
      windMax
    } = this.props
    return (
      <View style={style.prefernceContainer} >
        <NormalText style={style.preferenceText} textContent={'Your preferred wind range is'} />
        <NormalText style={style.preferenceText} textContent={convertWindSpeed(windMin, this.props.settings.windSpeed).toFixed(0) + ' to ' + convertWindSpeed(windMax, this.props.settings.windSpeed).toFixed(0) + ' ' + SpeedUnits[this.props.settings.windSpeed]} />
        {this._renderLink('editPref', () => {
          this.props.push('WindHarbor', { isFromSettings: true })
        })}
      </View>
    )
  }

  _renderWarningPopup = () => {
    return (
      <View style={style.popupContainer} >
        <View style={style.popupInnerContainer} >
          <HeadingText style={style.popupImpText} textContent={'IMPORTANT'} />
          <HeadingText style={style.popupHeadingOne} textContent={'Please be aware that to\nre-calibrate Vaavud Ultrasonic you need to be able to rotate the device.'} />
          <HeadingText style={style.popupHeadingTwo} textContent={'Please note that launching\nre-calibration deletes the current calibration.'} />
        </View>
        <View style={{ flexDirection: 'row' }} >
          <Button
            buttonStyle={style.popupButtonCalibrate}
            textStyle={style.popupButtonCalibrateText} onPress={() => {
              this.popupDialog.dismiss()
              this.props.calibrateBle()
            }}
            title="CALIBRATE" />
        </View>
        <Button textStyle={style.popupButtonCnacelText}
          onPress={() => {
            this.popupDialog.dismiss()
          }} title="CANCEL" />
      </View>
    )
  }

  _renderConnectBle() {
    return (
      <View style={style.otherSectionContainer} >
        <Button
          textStyle={style.buttonText}
          title={'Calibrate Ultrasonic'}
          onPress={() => this.popupDialog.show()} />
        <Button
          textStyle={style.buttonText}
          title={'Align Ultrasonic'}
          onPress={this.props.goToAlignUltrasonic} />
      </View>
    )
  }

  _renderPopup = () => {
    return (
      <PopupDialog
        ref={(popupDialog) => { this.popupDialog = popupDialog }}
        dialogStyle={style.popup}
        width={width - 40}
        height={isIos ? height - 89 : height - 109} >
        {this._renderWarningPopup()}
      </PopupDialog>
    )
  }

  /* TODO: clean up
    _renderShowColors() {
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
            selectedOption={'Yes'}
            optionStyle={{ ...textStyle.normal }}
            optionContainerStyle={style.segmentedControl}
            containerBorderWidth={isIos ? 1 : 2}
          />
        </View>
      )
    }*/

  /* TODO: clean up
    _renderDeviceStatus() {
      const {
        isBleDeviceConnected
      } = this.props
      return (
        <View style={style.deviceStatusContainer} >
          <View style={style.deviceStatusInnerContainer} >
            {this._renderDeviceText('Ultrasonic.', ' ')}
            {this._renderDeviceText('Battery level', this.props.battery + '%')}
          </View>
        </View>
      )
    }*/

  _handleClickLink(link) {
    Linking.canOpenURL(link).then(
      Linking.openURL(link),
      //TODO: handle reject
    ).catch((error) => {
      //TODO: error handling
    })
  }

  _renderOthersSection() {
    return (
      <View style={style.otherSectionContainer} >
        {this._renderLink('vaavud', () => this._handleClickLink('https://vaavud.com'))}
        {this._renderLink('termsButton', () => this._handleClickLink('https://vaavud.com/terms/'))}
        {this._renderLink('privacyButton', () => this._handleClickLink('https://vaavud.com/privacy-policy/'))}
        {this._renderLink('logout', () => this.props.logout())}
        {this._renderLink('appGuide', () => this._handleClickLink('https://vaavud.com/faq/'))}
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }} >
        <ScrollView style={style.container} >
          {this._renderSectionHeader('unitText')}
          {this._renderWindspeedSelector()}
          {this._renderTemperatureSelector()}
          {this._renderSectionHeader('prefrencesText')}
          {this._renderWindPrefrences()}
          <View style={style.sectionHeader} >
            <NormalText textContent={'Ultrasonic'} />
          </View>
          {this._renderConnectBle()}
          {this._renderSectionHeader('otherSection')}
          {this._renderOthersSection()}
        </ScrollView>
        {this._renderPopup()}
      </View>
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(SettingsView)

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: Colors.background
  },
  firstSectionHeader: {
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor
  },
  segmentedContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  segmentedControl: {
    justifyContent: 'center',
    height: 40
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
    marginBottom: 10,
    alignItems: 'center'
  },
  preferenceText: {
    margin: 5,
    fontSize: 16
  },
  buttonText: {
    ...textStyle.normal,
    margin: 15,
    color: Colors.vaavudBlue
  },
  otherSectionContainer: {
    margin: 20,
    marginTop: 10,
    alignItems: 'center'
  },
  popup: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.vaavudBlue
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  popupInnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  popupImpText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  popupHeadingOne: {
    textAlign: 'center',
    color: 'white',
    marginTop: 10,
    fontSize: 18
  },
  popupHeadingTwo: {
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
    fontSize: 18
  },
  popupButtonCalibrate: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
    height: 40,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  popupButtonCalibrateText: {
    ...textStyle.normal,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.vaavudBlue
  },
  popupButtonCnacelText: {
    ...textStyle.normal,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white'
  }
})
