// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  requireNativeComponent,
  Dimensions,
  Image
} from 'react-native'

let SelectorView = requireNativeComponent('SelectorViewSwift', Newsfeed)


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import MapView from 'react-native-maps'
const {width, height} = Dimensions.get('window')
const imgHarbor = require('../../../../assets/pinMap.png')


const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0992;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


import ForecastWeek from '../../../components/forecastWeek'

function getCoordinate(location) {
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class Newsfeed extends Component {

  constructor(props) {
    super(props)

    this.state = {
      region: {
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    console.log(this.props)
    if (this.props.harbor.loading) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> Loading </Text>
        </View>
      )
    }
    else {
      return (
        <View style={{position: 'absolute',top: 0,left: 0,width,height}} >
          <MapView
            style={{ height: 300, width }}
            initialRegion={{...this.state.region,...getCoordinate(this.props.harbor.location) }}
            mapType="satellite" >
            <MapView.Marker coordinate={getCoordinate(this.props.harbor.location)}>
                <Image source={imgHarbor} style={{height: 45,width: 45,}} />
            </MapView.Marker>
          </MapView>

          {this.props.harbor.forecast ?
            <ForecastWeek
              resolution={this.props.harbor.forecast.resolution}
              name={this.props.harbor.name}
              days={this.props.harbor.forecast.days} /> : null}

          <Button title="Edit" onPress={() => {
            this.props.push({ key: 'mapHarbor', props: { harbor: this.props.harbor } })
          }} />
        </View>
      )
    }
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    harbor: reduxStore.harbor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Newsfeed)
