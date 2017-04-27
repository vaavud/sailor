// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

import { getSummaryInformation } from '../../../actions/summary'
import { goToMain } from '../../../actions/measure'

import SummaryView from '../../../views/main/summary' 

import NoSummary from '../../../components/noSummary'
import LoadingModal from '../../../components/loadingModal'


const getCoordinate = location => {
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class Summary extends Component {

  constructor(props) {
    super(props)

    const { params } = props.navigation.state

    this.state = {
      fromHistory: params.fromHistory,
      sessionKey: params.sessionKey,
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
      console.log('error summary', err)
      this.setState({ summaryLost: true })
    })
  }

  componentWillUnmount() {

  }

  onBackPress() {
    if (this.state.fromHistory) {
      const { goBack } = this.props.navigation
      goBack()
    }
    else {
      this.props.goToMain()
      // this.props.jump('history', true)
    }
  }

  render() {
    const { params } = this.props.navigation.state

    if (this.state.sessionFound) {
      return (
        <SummaryView
          region={this.state.region}
          dateTime={this.state.timeStart}
          locationName={params.locationName}
          tripCoordinates={{
            id: 1,
            coordinates: this.state.coordinates
          }}
          directions={this.state.directions}
          paths={this.state.paths}
          maxWindSpeed={Math.ceil(this.state.windMax + 1)}
          minWindSpeed={Math.floor(this.state.windMin)}
          windAverage={params.windMean.toFixed(1)}
          startTime={this.state.timeStart}
          settings={this.props.settings}
          endTime={this.state.endTime}
          onPressBack={this.onBackPress} />
      )
    }
    else if (this.state.summaryLost) {
      const { goBack } = this.props.navigation
      return (
        <NoSummary pop={goBack} />
      )
    }
    else { return <LoadingModal isActive={true} message={'Fetching data...'} /> }
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMain: bindActionCreators(goToMain, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Summary)
