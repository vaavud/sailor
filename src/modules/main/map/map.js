// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  InteractionManager
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getMarkers } from '../../../actions/map'

import MapView from 'react-native-maps'


function getCoordinate(location) {
  // console.log('getCoordinate',location)
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

    this.props.getMarkers()
      .then(markers => {
        this.setState({ markers })
      })

  }

  componentWillUnmount() {

  }


  _onRegionChangeComplete(region) {
    InteractionManager.runAfterInteractions(() => {
      if (region.longitudeDelta < 100) {
        this.setState({ region: region })
      }
    })
    this.setState({ rendercycle: this.state.rendercycle + 1 })
  }

  _renderMarker(marker, key) {
    if (!('location' in marker)) { return }

    return (<MapView.Marker
      key={key}
      coordinate={getCoordinate(marker.location)}
      title={marker.title}
      description={marker.description}
      />)

  }



  render() {
    console.log(this.state.markers)
    return (
      <View style={{ flex: 1 }} >
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          region={this.state.maxRegion}
          mapType="satellite"
          >
          {Object.keys(this.state.markers).map(key => (
            this._renderMarker(this.state.markers[key],key)
          ))}

        </MapView>
      </View>)
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMarkers: bindActionCreators(getMarkers, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Map)
