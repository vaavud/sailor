// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native'

// let SelectorView = requireNativeComponent('SelectorViewSwift', Newsfeed)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import MapView from 'react-native-maps'
const { width, height } = Dimensions.get('window')

const imgHarbor = require('../../../../assets/icons/harbour-marker.png')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0992
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

import Icon from 'react-native-vector-icons/MaterialIcons'

import ForecastWeek from '../../../components/forecastWeek'
import { IntroView } from '../../../views/main/newsfeed'


function getCoordinate(location, skew) {
  return {
    latitude: location.lat - skew,
    longitude: location.lon
  }
}

import icons from '../../../reactcommon/icons'



class Newsfeed extends Component {

  static navigationOptions = {
    tabBarLabel: 'Harbour',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={icons.newsfeed}
        style={{ tintColor }}
      />
    )
  }

  state = {
    region: {
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
  }


  _renderEditBtn() {
    return (
      <TouchableOpacity style={{ position: 'absolute', flexDirection: 'row', alignItems: 'center', top: 30, right: 10, backgroundColor: 'transparent' }}
        onPress={() => {
          const { navigate } = this.props.navigation
          navigate('MapHarbor', this.props.harbor)
        }} >
        <Text style={{ marginRight: 5, fontSize: 16, color: 'white' }}>{'Edit'}</Text>
        <Icon style={{ fontSize: 16, color: 'white' }} name={'edit'} />
      </TouchableOpacity>
    )
  }

  render() {
    if (this.props.harbor.loading) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> Loading </Text>
        </View>
      )
    }
    else {
      if (!this.props.harbor.forecast) {
        const { navigate } = this.props.navigation
        return (
          <IntroView onNextPress={navigate} />
        )
      }
      else {
        return (
          <View style={{ position: 'absolute', top: 0, left: 0, width, height }} >
            <MapView
              style={{ height: height, width }}
              pitchEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{ ...this.state.region, ...getCoordinate(this.props.harbor.location, 0.02) }}
              mapType="satellite" >
              <MapView.Marker coordinate={getCoordinate(this.props.harbor.location, 0)}>
                <Image source={imgHarbor} />
              </MapView.Marker>
            </MapView>

            {this.props.harbor.forecast ?
              <View style={{ position: 'absolute', bottom: 40, left: 0 }} >
                <ForecastWeek
                  resolution={this.props.harbor.forecast.resolution}
                  name={this.props.harbor.name}
                  days={this.props.harbor.forecast.days}
                  settings={this.props.settings}
                />
              </View>
              : null}

            {this._renderEditBtn()}
          </View>
        )
      }
    }
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
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Newsfeed)
