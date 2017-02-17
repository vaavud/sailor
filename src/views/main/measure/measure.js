// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Animated,
  Easing,
} from 'react-native'

import Colors from '../../../../assets/colorTheme'

const compass = require('../../../../assets/trueWindCompass.png')
const compassHand = require('../../../../assets/trueWindCompassHand.png')

export default class MeasureView extends Component {

  constructor(props){
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.state = {
      lastHeading: 0,
      newHeading: 0
    }
  }

  static propTypes = {
    lastWindHeading: PropTypes.number.isRequired,
    windHeading: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    windSpeedUnit: PropTypes.number.isRequired,
    groundSpeed: PropTypes.number, // optional =) default will be N/A
    groundSpeedUnit: PropTypes.number.isRequired,
    testStop: PropTypes.func.isRequired
  }

  animateNewHeading(){
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue, {
        toValue: 1,
        duration: 250,
        easing: Easing.linear
      }
    ).start()
  }

  _crazyMod(a, n) {
    return a - Math.floor(a / n) * n
  }
  

  _renderCompass(lastHeading, newHeading) {
    var l = lastHeading
    var n = newHeading
    var a = n - l
    newHeading = (this._crazyMod((n - l) + 180, 360) - 180) + l
    this.animateNewHeading()
    const animate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lastHeading + 'deg', newHeading + 'deg']
    })
    return (
      <View style={style.compassContainer} >
        <View style={style.compassInnerContainer} >
          <Image source={compass} />
          <Animated.Image
            style={{
                position: 'absolute',
                transform: [{ 'rotate': animate }]
            }}
            source={compassHand} />
        </View>
      </View>
    )
  }

  _renderWindText() {
    return (
      <View style={style.windTextContainer} >
        <Text style={style.windText} >{'TRUE'}</Text>
      </View>
    )
  }

  _renderSpeedContainer(groundSpeed, lastWindSpeed, windSpeed) {
    return (
      <View style={style.speedContainer} >
        {this._renderGroundSpeed(groundSpeed)}
        {this._renderWindSpeed(lastWindSpeed, windSpeed)}
      </View>
    )
  }

  _renderGroundSpeed(groundSpeed) {
    return (
      <View style={style.groundSpeedContainer} >
        <Text>{'Ground speed'}</Text>
        <Text style={style.speedText}>{groundSpeed}</Text>
        <Text>{'-'}</Text>
      </View>
    )
  }

  _renderWindSpeed(lastWindSpeed, windSpeed) {
    var dir = lastWindSpeed < windSpeed
    console.log('speeds l and n::::' + ' ' + lastWindSpeed + '  :: ' + windSpeed)
    return (
      <View style={style.windSpeedContainer} >
        <Text>{'Wind speed'}</Text>
        <AnimateNumber
          direction={dir}
          startFrom={lastWindSpeed}
          endWith={windSpeed} />
        <Text>{'m/s'}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={style.container} >
        {this._renderCompass(this.props.lastWindHeading, this.props.windHeading)}
        {this._renderWindText()}
        <Button title="Stop" onPress={this.props.testStop} />
        {this._renderSpeedContainer('N/A', this.props.windSpeed)}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: Colors.background
  },
  compassContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  windTextContainer: {
    margin: 20,
    alignItems: 'center',
  },
  windText: {
    fontSize: 26
  },
  speedContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  windSpeedContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderLeftWidth: 1,
    borderLeftColor: 'grey'
  },
  groundSpeedContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontSize: 30,
    fontWeight: 'bold'
  }
})
