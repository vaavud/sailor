// @flow

'use strict'

import React, { Component } from 'react'

import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native'
// import { View } from 'react-native'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import MapView from 'react-native-maps'
import MapMarker from '../../../components/mapMarker'

import { SpeedUnits} from '../../../reactcommon/utils'
import { getMarkers } from '../../../actions/map'

const { width } = Dimensions.get('window')

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

  onRegionChange(region) {
  }

  componentWillUnmount() {

  }

  _renderMarker(marker, key) {
    if (!('location' in marker)) { return }

    return (
      <MapView.Marker
        key={key}
        coordinate={getCoordinate(marker.location)}>
        <MapMarker speed={marker.windMean} direction={marker.windDirection} settings={this.props.settings} />
      </MapView.Marker>)
  }

  render() {
    return (
      <View style={style.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={this.state.region}
        region={this.state.maxRegion}
        onRegionChange={this.onRegionChange}
        mapType="satellite" >
        {Object.keys(this.state.markers).map(key => (
          this._renderMarker(this.state.markers[key], key)
        ))}
      </MapView>
      <LinearGradient
          colors={['rgba(0,0,0,0)', 'black']}
          style={{position:'absolute',
            width:width,
            height:40,
            flex: 1,
            bottom:0,
          }}>
          <View style={{flex: 1,flexDirection: 'row',justifyContent: 'space-between', backgroundColor:'transparent'}}>
            <Text style={{fontSize:16,color:'white', marginTop:10, marginLeft:30  }}> { SpeedUnits[this.props.settings.windSpeed]} </Text>
            <Text style={{fontSize:16,color:'white',textAlign:'right', marginTop:10, marginRight:30  }}> {'24h'} </Text>
          </View>
        </LinearGradient>
      </View>
      )
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const style = StyleSheet.create({
  container:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
})

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Map)
