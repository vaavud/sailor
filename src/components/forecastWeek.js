import {
  View,
  Dimensions,
  Text,
  Image,
  Platform,
  StyleSheet
} from 'react-native'
import React, { Component } from 'react'

import icoMoonConfig from '../reactcommon/selection.json'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import { textStyle } from './text'

const Icon = createIconSetFromIcoMoon(icoMoonConfig)

const {width} = Dimensions.get('window')

const geoIcon = require('../../assets/geoIcon.png')
const windIcontTemp = require('../../assets/windBlue.png')

import { SpeedUnits, convertWindSpeed } from '../reactcommon/utils'


export default class ForecastWeek extends Component {

  _renderHeader() {
    return (
      <View style={style.header}>
        <View style={style.headerTitle} >
          <Image style={[style.img, { marginLeft: 5, marginRight: 2 }]} source={geoIcon} resizeMode={'contain'} />
          <Text numberOfLines={1} style={style.text}>{this.props.name}</Text>
        </View>
        <View style={style.headerDescription} >
          <Text style={{ ...textStyle.normal, marginRight: 5 }} >{SpeedUnits[this.props.settings.windSpeed]}</Text>
        </View>
      </View>
    )
  }

  _renderTemperature(temp, icon) {
    return (
      <View style={{ flex: 0.3, alignItems: 'center', marginTop: 15 }} >
        <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }} >
          <Icon name={icon} style={textStyle.normal} />
        </View>
        <Text style={textStyle.small}>{temp}°</Text>
      </View>
    )
  }

  _renderSpeed(speed, direction) {
    return (
      <View style={{ flex: 0.4, alignItems: 'center' }} >
        <Image
          resizeMode="cover"
          source={windIcontTemp}
          style={[{ height: 45, width: 45, marginTop: 5 }, { transform: [{ 'rotate': `${direction}deg` }] }]} />
        <Text style={style.speedText}>{convertWindSpeed(speed, this.props.settings.windSpeed).toFixed(0)}</Text>
      </View>
    )
  }


  _renderDays(day) {
    return (
      <View style={{ flex: 0.3, alignItems: 'center' }} >
        <Text style={[style.text, { marginTop: 7 }]}>{day}</Text>
      </View>
    )
  }

  _renderBodyRow(index, spot) {

    return (
      <View style={{ flex: 1 }} key={index} >
        {this._renderTemperature(spot.temperature, spot.icon)}
        {this._renderSpeed(spot.windSpeed, spot.windDirection)}
        {this._renderDays(spot.day)}
      </View>
    )
  }

  _renderBody() {

    let spots = this.props.days
    let days = []

    for (let index in spots) {
      days.push(this._renderBodyRow(index, spots[index]))
    }

    return (
      <View style={style.body} >
        {days}
      </View>
    )
  }

  render() {
    return (
      <View style={style.container} >
        {this._renderHeader()}
        <View style={style.divider} />
        {this._renderBody()}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    width,
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255, 0.85)'
  },
  divider: {
    width,
    height: 1,
    backgroundColor: '#555'
  },
  body: {
    width,
    height: 125,
    marginBottom: Platform.OS === 'ios' ? 20 : 40,
    flexDirection: 'row'
  },
  text: {
    ...textStyle.normal,
    textAlign: 'center'
  },
  header: {
    height: 35, width, flexDirection: 'row'
  },
  footer: {
    padding: 5,
    width, height: 20
  },
  headerTitle: {
    flex: 1, flexDirection: 'row', alignItems: 'center'
  },
  headerDescription: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'
  },
  speedText: {
    fontSize: 12, color: '#fff', backgroundColor: 'transparent', textAlign: 'center', position: 'absolute', top: 20, width: width / 7
  },
  img: {
    width: 15, height: 15, tintColor: '#263238'
  }
})
