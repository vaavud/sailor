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

    let icon = map_markers.markerRedDirection
    // if (this.props.loading) {

    // }
    // else if (convertWindSpeed(this.props.speed, this.props.settings.wind_speed).toFixed(1) > Math.floor(convertWindSpeed(this.props.profile.maxSpeed, this.props.settings.wind_speed))) {
    //   icon = this.props.direction ? map_markers.markerRedDirection : map_markers.markerRed
    // }
    // else if (convertWindSpeed(this.props.speed, this.props.settings.wind_speed).toFixed(1) < Math.floor(convertWindSpeed(this.props.profile.minSpeed, this.props.settings.wind_speed))) {
    //   icon = this.props.direction ? map_markers.markerGrayDirection : map_markers.markerGray
    // }
    // else {
    //   icon = this.props.direction ? map_markers.markerBlueDirection : map_markers.markerBlue
    // }

    this.state = {
      icon: <Image
        source={icon}
        style={{
          height: 45,
          width: 45,
          position: 'absolute',
          top: 0,
          transform: [{ 'rotate': `${this.props.direction ? this.props.direction : 0}deg` }]
        }} />
    }

  }
  render() {
    // console.log(this.state.icon)
    return (
      <View style={styles.bubble} >
        {this.state.icon}
        <Text style={styles.speed}>12</Text>
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
