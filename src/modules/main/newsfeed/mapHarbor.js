// @flow

'use strict'

import React, { Component } from 'react'
import {
  Dimensions
} from 'react-native'

const {width, height} = Dimensions.get('window')
const imgHarbor = require('../../../../assets/pinMap.png')


const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0992;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import { SelectHabourView, IntroView } from '../../../views/main/newsfeed'


function getCoordinate(location) {
  return {
    latitude: location.lat,
    longitude: location.lon
  }
}

class MapHarbor extends Component {

  constructor(props) {
    super(props)

    this.state = {
      region: {
        ...getCoordinate(props.componentProps.harbor.location),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      harbor: props.componentProps.harbor
    }

    // this._onContinue = this._onContinue.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // onMapPress(e) {
  //   if (this.state.marker.length > 0) { return }

  //   this.setState({
  //     location: e.nativeEvent.coordinate,
  //     marker: {
  //       latitude: e.nativeEvent.coordinate.latitude,
  //       longitude: e.nativeEvent.coordinate.longitude,
  //     }
  //   })
  // }

  // _onContinue() {
  //   this.props.push({ key: 'windHarbor', props: { marker: this.state.marker, name: this.state.harborName, harbor: this.state.harbor } })
  // }


  render() {

    return (
      <SelectHabourView
        onPop={this.props.pop}
        onPressSave={this.props.push}
        location={getCoordinate(this.props.componentProps.harbor.location)}
        locationName={this.state.harbor.name}
        region={this.state.region} />
    )

    /*return (
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
    )*/
  }

}

export default MapHarbor
