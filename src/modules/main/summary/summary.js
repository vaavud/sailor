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

const ASPECT_RATIO = width / height
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

import { getSummaryInformation } from '../../../actions/summary'

import SummaryView from '../../../views/main/summary'

import NoSummary from '../../../components/noSummary'
import LoadingModal from '../../../components/loadingModal'



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
      fromHistory: props.componentProps.fromHistory,
      sessionKey: props.componentProps.sessionKey,
      sessionFound: false,
      summaryLost: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinates: [],
      endTime: 0
    }

    this.onBackPress = this.onBackPress.bind(this)
  }

  componentDidMount() {
    getSummaryInformation(this.state.sessionKey).then(summary => {
      let latslons = summary.locations.map(latlon => getCoordinate(latlon))
      this.setState({
        sessionFound: true,
        windMin: summary.windMin,
        windMax: summary.windMax,
        paths: summary.windSpeeds,
        coordinates: latslons,
        directions: summary.windDirections,
        timeStart: summary.windSpeeds[0].timestamp,
        timeEnd: summary.windSpeeds[summary.windSpeeds.length - 1].timestamp
      })
    }).catch(err => {
      this.setState({ summaryLost: true })
    })
  }

  componentWillUnmount() {

  }

  onBackPress() {
    if (this.state.fromHistory) {
      console.log(this.props)
      this.props.pop()
    }
    else {
      this.props.jump('history', true)
    }
  }

  render() {
    if (this.state.sessionFound) {
      return (
        <SummaryView
          region={this.state.region}
          dateTime={this.state.timeStart}
          locationName={this.props.componentProps.locationName}
          tripCoordinates={{
            id: 1,
            coordinates: this.state.coordinates
          }}
          directions={this.state.directions}
          paths={this.state.paths}
          maxWindSpeed={Math.ceil(this.state.windMax + 1)}
          minWindSpeed={Math.floor(this.state.windMin)}
          windAverage={this.props.componentProps.windMean.toFixed(1)}
          startTime={this.state.timeStart}
          endTime={this.state.endTime}
          onPressBack={this.onBackPress} />
      )
    }
    else if (this.state.summaryLost) {
      return (
        <NoSummary pop={this.props.pop} />
      )
    }
    else { return <LoadingModal isActive={true} message={'Fetching data...'} /> }
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
