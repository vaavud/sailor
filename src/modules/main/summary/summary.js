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
let id = 0;

import { getSummaryInformation, getSummaryFromServer } from '../../../actions/summary'

import TestView from '../../../views/main/summary'

class Summary extends Component {

  constructor(props) {
    super(props)

    // var paths = []
    // for (let i in props.componentProps.speed) {
    //   paths.push({ 'speed': props.componentProps.speed[i].value, 'time': props.componentProps.speed[i].timestamp })
    // }

    console.log('props.componentProps', props.componentProps)

    this.state = {
      sessionKey: props.componentProps.sessionKey,
      sessionFound: false,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      tripCoordinates: props.componentProps.tripCoordinates,
    }
  }

  componentDidMount() {

    getSummaryInformation(this.state.sessionKey).then(summary => {
      if (summary) {
        this.setState({ sessionFound: true })
        console.log('summary in cache', summary)
      }
      else {
        getSummaryFromServer(this.state.sessionKey).then(_summary => {
          this.setState({ sessionFound: true })
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
    return (
      <View />
    )
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