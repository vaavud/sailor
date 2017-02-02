// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  requireNativeComponent,
  Dimensions,
} from 'react-native'

let SelectorView = requireNativeComponent('SelectorViewSwift', Newsfeed)


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import MapView from 'react-native-maps'
const {width, height} = Dimensions.get('window')

import ForecastWeek from '../../../components/forecastWeek'

function getCoordinate(location) {
  console.log('getCoordinate', location)
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class Newsfeed extends Component {

  constructor(props) {
    super(props)
    this.state = {
      current: {
        coords: {
          speed: '',
          latitude: '',
          longitude: ''
        }
      }
    }
  }

  componentDidMount() {

  }

  // <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> {this.state.current.coords.speed} </Text>
  //       <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> {this.state.current.coords.latitude} </Text>
  //       <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> {this.state.current.coords.longitude} </Text>

  //       <Button title="Summary" onPress={() => {
  //         this.props.push({ key: 'summary' })
  //       } } />

  componentWillUnmount() {

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
      console.log(this.props.harbor)

      return (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: width,
          height: height,
          flexDirection: 'column'
        }} >

          <MapView
            style={{ height: 300, width }}
            mapType="satellite"
            >
            <MapView.Marker
              key={'TODO'}
              coordinate={getCoordinate(this.props.harbor.location)}
              title={'My harbor'}
              description={''}
              />
          </MapView>

          {this.props.harbor.forecast ?
            <ForecastWeek
              resolution={this.props.harbor.forecast.resolution}
              name={this.props.harbor.name}
              days={this.props.harbor.forecast.days} /> : null}

          <Button title="Edit" onPress={() => {
            this.props.push({ key: 'mapHarbor', props: { harbor: this.props.harbor } })
          } } />


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
