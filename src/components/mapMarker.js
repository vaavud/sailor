import {
  View,
  Text,
  Image
} from 'react-native'

import React, { Component } from 'react'

import map_markers from '../reactcommon/markerIcons'

import { convertWindSpeed } from '../reactcommon/utils'

class MapMarker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      hasDirection: props.direction !== undefined
    }
  }
  render() {
    return (
      <View style={styles.bubble} >
        <Image
        source={this.state.hasDirection ? map_markers.markerRedDirection : map_markers.markerRed}
        style={{
          height: 45,
          width: 45,
          position: 'absolute',
          top: 0,
          transform: [{ 'rotate': `${this.state.hasDirection ? this.props.direction : 0}deg` }]
        }} />
        <Text style={styles.speed}>{this.props.speed.toFixed(1)}</Text>
      </View>
    )
  }

}

const styles = {
  bubble: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speed: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
}

export default MapMarker
