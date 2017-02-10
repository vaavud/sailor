// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Dimensions,
} from 'react-native'

import { connect } from 'react-redux'


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import { getSummaryInformation, getSummaryFromServer } from '../../../actions/summary'

import TestView from '../../../views/main/summary'

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      sessionKey: props.componentProps.sessionKey,
      sessionFound: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinates: []
    }
    console.log('state', this.state)
  }

  componentDidMount() {

    getSummaryInformation(this.state.sessionKey).then(summary => {
      if (summary) {
        let speeds = summary.speeds
        let latlon = summary.locations
        let paths = []
        let coordinates = []
        let _direc = summary.directions
        let directions = []

        for (let i in latlon) {
          coordinates.push(latlon[i])
        }

        for (let i in speeds) {
          paths.push({ timestamp: speeds[i].timestamp, speed: speeds[i].value })
        }

        for (let i in _direc) {
          directions.push({ timestamp: _direc[i].timestamp, direction: _direc[i].value })
        }

        console.log('from local')
        this.setState({ sessionFound: true, maxWindSpeed: summary.windMax, paths, coordinates, directions })
      }
      else {
        getSummaryFromServer(this.state.sessionKey).then(_summary => {
          // this.setState({ sessionFound: true })
          console.log('summary in server', _summary)
        })
          .catch(() => {
            console.log('No summary::: Sad face')
          })
      }
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
          maxWindSpeed={Math.ceil(this.state.maxWindSpeed)}
          minWindSpeed={0} />
      )
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