import {
  View,
  Dimensions,
  Text,
  Image,
  StyleSheet
} from 'react-native'
import React, { Component, PropTypes } from 'react'

const {width, height} = Dimensions.get('window')

const resolution = require('../../assets/resolution.png')
const geoIcon = require('../../assets/geoIcon.png')
const rightArrow = require('../../assets/right-arrow.png')
const windIcontTemp = require('../../assets/windBlue.png')


export default class ForecastWeek extends Component {

  _renderHeader() {
    return (
      <View style={style.header}>
        <View style={style.headerTitle} >
          <Image style={[style.img, { marginLeft: 5, marginRight: 2 }]} source={geoIcon} resizeMode={'contain'} />
          <Text numberOfLines={1} style={[style.text, { fontSize: 13 }]}>{this.props.name}</Text>
        </View>
        <View style={style.headerDescription} >
          <Image source={resolution} style={[style.img, { marginRight: 5 }]} resizeMode="contain" />
          <Text style={[style.text, { fontSize: 13, marginRight: 10 }]}>{this.props.resolution}</Text>
          <Image source={rightArrow} style={[style.img, { marginRight: 10 }]} resizeMode="contain" />
        </View>
      </View>
    )
  }


  _renderFooter() {
    return (
      <View style={style.footer} >
        <Text style={[style.text, { width }]}>m/s</Text>
      </View>
    )
  }

  _renderTemperature(temp) {
    return (
      <View style={{ flex: 0.3, alignItems: 'center' }} >
        <View style={{ width: 20, height: 20, backgroundColor: 'red', marginTop: 5 }} />
        <Text style={style.text}>{temp}°</Text>
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
        <Text style={style.speedText}>{speed}</Text>
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
        {this._renderTemperature(spot.temperature)}
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
        <View style={style.divider} />
        {this._renderFooter()}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    height: 180,
    width,
    marginTop: 5,
    backgroundColor: '#666'
  },
  divider: {
    width,
    height: 1,
    backgroundColor: '#555'
  },
  body: {
    width, height: 125, flexDirection: 'row'
  },
  text: {
    fontSize: 11, color: '#fff', textAlign: 'center'
  },
  header: {
    height: 35, width, flexDirection: 'row'
  },
  footer: {
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
    width: 15, height: 15, tintColor: '#fff'
  }
})
