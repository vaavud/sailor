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

    const { params } = props.navigation.state

    if (params.isNew) {
      this.state = {
        region: {
          latitude: 52.51212,
          longitude: 10.21515,
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
      }, (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 })
    }

  }

  componentWillUnmount() {

  }

  render = () => {
    const { params } = this.props.navigation.state

    return (
      <SelectHabourView
        onPop={this.props.pop}
        onPressSave={this.props.push}
        location={this.state.harborLocation}
        locationName={this.state.harbor.name}
        id={this.state.key}
        isNew={params.isNew}
        region={this.state.region} />
    )
  }

}

export default MapHarbor
