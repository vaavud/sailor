// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  TextInput
} from 'react-native'

import MapView from 'react-native-maps'

let id = 0

class MapHarbor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      marker: []
    }

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onRegionChange(region) {
    this.setState({ region })
  }

  onMapPress(e) {
    if (this.state.marker.length > 0) { return }

    this.setState({
      location: e.nativeEvent.coordinate,
      marker: [{
        coordinate: e.nativeEvent.coordinate,
        key: id++,
      }]
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }} >
        <Text> Map from harbor </Text>
        <Button title="Continue" onPress={() => {
          // this.props.pop()
          this.props.push({ key: 'windHarbor', props: { location: this.state.location, harborName: this.state.harborName } })
          console.log(this.state.location)
        } } />
        <Button title="Cancel" onPress={() => {
          this.props.pop()
          // this.props.push({ key: 'windHarbor' })
        } } />
        <TextInput
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(harborName) => {
            this.setState({ harborName })
          } } />

        <MapView
          style={{ flex: 1 }}
          region={this.state.region}
          onPress={this.onMapPress.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          >
          {this.state.marker.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              onDragEnd={(e) => this.setState({ location: { lat: e.nativeEvent.coordinate.latitude, lon: e.nativeEvent.coordinate.longitude } })}
              draggable
              />
          ))}
        </MapView>

      </View>
    )
  }

}

export default MapHarbor
