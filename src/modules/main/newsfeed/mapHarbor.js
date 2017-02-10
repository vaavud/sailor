// @flow

'use strict'

import React, { Component } from 'react'
import {
  Dimensions
} from 'react-native'

const {width, height} = Dimensions.get('window')
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

    if (props.componentProps.isNew) {
      this.state = {
        region: {
          latitude: 52.51212,
          longitude: 10.21515,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        harbor: {
          name: ''
        }
      }
    }
    else {
      this.state = {
        region: {
          ...getCoordinate(props.componentProps.harbor.location),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        harborLocation: getCoordinate(props.componentProps.harbor.location),
        harbor: props.componentProps.harbor,
        key: props.componentProps.harbor.key
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <SelectHabourView
        onPop={this.props.pop}
        onPressSave={this.props.push}
        location={this.state.harborLocation}
        locationName={this.state.harbor.name}
        id={this.state.key}
        isNew={this.props.componentProps.isNew}
        region={this.state.region} />
    )
  }

}

export default MapHarbor
