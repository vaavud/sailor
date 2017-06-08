// @flow

'use strict'

import React, { Component } from 'react'
import {
  Dimensions
} from 'react-native'

const { width, height } = Dimensions.get('window')
const imgHarbor = require('../../../../assets/pinMap.png')


const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0992;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import { SelectHabourView, IntroView } from '../../../views/main/newsfeed'


function getCoordinate(location) {
  if (location === undefined) return
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class MapHarbor extends Component {

  constructor(props) {
    super(props)

    const { params, key } = props.navigation.state
    console.log(key)

    if (params.isNew) {
      this.state = {
        keyRoot: key,
        region: {
          latitude: 55.6711876,
          longitude: 12.420757,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        harbor: {
          name: ''
        },
        needsLoaction: true
      }
    }
    else {
      this.state = {
        keyRoot: key,
        region: {
          ...getCoordinate(params.location),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        harborLocation: getCoordinate(params.location),
        harbor: params,
        key: params.key,
        needsLoaction: false
      }
    }
  }

  componentDidMount() {
    if (this.state.needsLoaction) {
      navigator.geolocation.getCurrentPosition(position => {
        let region = { ...this.state.region }
        region.latitude = position.coords.latitude
        region.longitude = position.coords.longitude
        this.setState({ region })
      }, (error) => { console.log(error) },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 })
    }

  }

  componentWillUnmount() {

  }

  render = () => {
    const { params } = this.props.navigation.state
    const { navigate, goBack } = this.props.navigation

    return (
      <SelectHabourView
        onPop={() => goBack()}
        onPressSave={navigate}
        location={this.state.harborLocation}
        locationName={this.state.harbor.name}
        id={this.state.key}
        keyRoot={this.state.keyRoot}
        isNew={params.isNew}
        region={this.state.region} />
    )
  }

}

export default MapHarbor
