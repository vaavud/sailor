// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text
} from 'react-native'

import { connect } from 'react-redux'


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import { getSummaryInformation } from '../../../actions/summary'

import TestView from '../../../views/main/summary'


function getCoordinate(location) {
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      sessionKey: props.componentProps.sessionKey,
      sessionFound: false,
      summaryLost: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinates: []
    }
  }

  componentDidMount() {
    console.log(this.state.sessionKey)
    getSummaryInformation(this.state.sessionKey).then(summary => {
      let latslons = summary.locations.map(latlon => getCoordinate(latlon))
      this.setState({ sessionFound: true, windMin: summary.windMin, windMax: summary.windMax, paths: summary.windSpeeds, coordinates: latslons, directions: summary.windDirections })
    }).catch(err => {
      this.setState({ summaryLost: true })
    })
  }

  componentWillUnmount() {

  }

  render() {
    if (this.state.sessionFound)
      return (
        <TestView
          region={this.state.region}
          dateTime={1486053616211}
          locationName={'Islands brygge'}
          tripCoordinates={{
            id: 1,
            coordinates: this.state.coordinates
          }}
          directions={this.state.directions}
          paths={this.state.paths}
          maxWindSpeed={Math.ceil(this.state.windMax + 1)}
          minWindSpeed={Math.floor(this.state.windMin)} />
      )
    else if (this.state.summaryLost) {
      return (
        <View style={{ marginTop: 50, flex: 1 }} >
          <Text>{'Forgive us!!!!, we lost your points.... Contact Malle@vaavud.com if you want to complaing... (btw he uses Tinder)'}</Text>
        </View >
      )
    }
    else { return <View /> }
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Summary)
