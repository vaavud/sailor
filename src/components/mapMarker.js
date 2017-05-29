import {
  View,
  Animated,
  Text,
  Platform
} from 'react-native'

import {
  textStyle
} from './text'

import React, { Component } from 'react'

import map_markers from '../reactcommon/markerIcons'

import { convertWindSpeed } from '../reactcommon/utils'

const isIos = Platform.OS === 'ios'

class MapMarker extends Component {

  constructor(props) {
    super(props)
    this.springValue = new Animated.Value(0.5)
    this.state = {
      hasDirection: props.direction !== undefined
    }
    this.spring = this.spring.bind(this)
  }

  componentDidMount() {
    this.spring()
  }

  spring() {
    this.springValue.setValue(0.5)
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1.5
      }
    ).start()
  }

  render() {
    return (
      <View style={styles.bubble} >
        <Animated.Image
          source={this.state.hasDirection ? map_markers.markerRedDirection : map_markers.markerRed}
          style={{
            height: 45,
            width: 45,
            position: 'absolute',
            top: 0,
            transform: isIos ? [
              { 'rotate': `${this.state.hasDirection ? this.props.direction : 0}deg` },
              { scale: this.springValue }]
              :
              [{ 'rotate': `${this.state.hasDirection ? this.props.direction : 0}deg` }]
          }} />
        <Text style={styles.speed}>{convertWindSpeed(this.props.speed, this.props.settings.windSpeed).toFixed(0)}</Text>
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
    ...textStyle.normal,
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
  },
}

export default MapMarker
