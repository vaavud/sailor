// @flow

'use strict'

import React, { Component } from 'react'
// import { View } from 'react-native'
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import MapView from 'react-native-maps'
import MapMarker from '../../../components/mapMarker'

import { getMarkers } from '../../../actions/map'


function getCoordinate(location) {
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      markers: []
    }
  }

  componentDidMount() {

    getMarkers().then(markers => {
      this.setState({ markers })
    })
  }

  componentWillUnmount() {

  }

  _renderMarker(marker, key) {
    if (!('location' in marker)) { return }

    return (
      <MapView.Marker
        key={key}
        coordinate={getCoordinate(marker.location)}>
        <MapMarker speed={marker.windMean} direction={marker.windDirection} />
      </MapView.Marker>)
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={this.state.region}
        region={this.state.maxRegion}
        mapType="satellite" >
        {Object.keys(this.state.markers).map(key => (
          this._renderMarker(this.state.markers[key], key)
        ))}
      </MapView>)
  }

}

// const mapReduxStoreToProps = (reduxStore) => {
//   return {
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//   }
// }

// export default connect(mapReduxStoreToProps, mapDispatchToProps)(Map)
export default Map
