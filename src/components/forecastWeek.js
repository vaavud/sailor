import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import React, { Component, PropTypes } from 'react'

const {width, height} = Dimensions.get('window')

const resolution = require('../../assets/resolution.png')
const geoIcon = require('../../assets/geoIcon.png')
const rightArrow = require('../../assets/right-arrow.png')
const windIcontTemp = require('../../assets/windBlue.png')


export default class ForecastWeek extends Component {

  constructor(props) {
    super(props)
  }

  _renderDays(spots) {

    let days = []

    for (let index in spots) {
      days.push(
        <View style={{ marginRight: 1, height: 140, flex: 1, justifyContent: 'center', alignItems: 'center' }} key={index}>
          <Text style={{ fontSize: 11, color: '#fff', backgroundColor: 'transparent', textAlign: 'center' }}>{spots[index].temperature}°</Text>
          <View style={spots.spotContainerWind}>
            <Image
              resizeMode="cover"
              source={windIcontTemp}
              style={[{ height: 45, width: 45, position: 'absolute', top: 0 }, { transform: [{ 'rotate': (spots[index].windDirection + 180) + 'deg' }] }]} />
            <Text style={{ fontSize: 11, color: '#fff', backgroundColor: 'transparent', textAlign: 'center' }}>{spots[index].windSpeed}</Text>
          </View>
          <Text style={{ fontSize: 11, color: '#fff', backgroundColor: 'transparent', textAlign: 'center' }}>{spots[index].day}</Text>
        </View>
      )
    }
    return days
  }

  render() {

    return (
      <View style={{ height: 180, width, marginTop: 5, backgroundColor: '#666' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.7, marginLeft: 10, marginTop: 13, marginRight: 5 }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
              //TODO
            } }>
              <Image style={{ width: 15, height: 15, tintColor: '#ffffff', marginRight: 2 }} source={geoIcon} resizeMode={Image.resizeMode.contain} />
              <Text numberOfLines={1} style={{ fontSize: 13, color: '#fff', backgroundColor: 'transparent' }}>{this.props.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 40, justifyContent: 'center' }}>

            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Text style={{ fontSize: 13, marginRight: 5, color: '#fff', backgroundColor: 'transparent' }}>{this.props.resolution}</Text>
              <Image source={resolution} style={{ tintColor: '#ffffff' }} resizeMode="contain" />
            </View>

            <TouchableOpacity style={{ width: 20, padding: 10, marginRight: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
              //TODO
            } }>
              <Image source={rightArrow} style={{ width: 15, height: 15, tintColor: '#ffffff' }} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width, height: 1, backgroundColor: '#575757' }} />
        <View style={{ flexDirection: 'row', marginRight: 10, marginLeft: 10, alignItems: 'center' }}>
          {this._renderDays(this.props.days)}
        </View>
      </View>)
  }


}