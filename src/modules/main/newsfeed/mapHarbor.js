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
      marker: props.componentProps.harbor ? { latitude: props.componentProps.harbor.location.lat, longitude: props.componentProps.harbor.location.lon } : undefined,
      harborName: props.componentProps.harbor.name,
      harbor: {
        key: props.componentProps.harbor.key,
        windMin: props.componentProps.harbor.windMin,
        windMax: props.componentProps.harbor.windMax,
        directions: props.componentProps.harbor.directions,
      }

    }

    this._onContinue = this._onContinue.bind(this)
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
      marker: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      }
    })
  }

  _onContinue() {
    this.props.push({ key: 'windHarbor', props: { marker: this.state.marker, name: this.state.harborName, harbor: this.state.harbor } })
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }} >
        <Text> Map from harbor </Text>
        <Button title="Continue" onPress={this._onContinue} />
        <Button title="Cancel" onPress={this.props.pop} />
        <TextInput
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          value={this.state.harborName}
          onChangeText={harborName => {
            this.setState({ harborName })
          } } />

        <MapView
          style={{ flex: 1 }}
          region={this.state.region}
          onPress={this.onMapPress.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          >
          {this.state.marker ?
            <MapView.Marker
              coordinate={this.state.marker}
              onDragEnd={e => this.setState({ marker: { latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude } })}
              draggable
              /> : null
          }
        </MapView>

      </View>
    )
  }

}

export default MapHarbor
