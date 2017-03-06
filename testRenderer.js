import React, { Component } from 'react'
import {
  AppRegistry,
  Dimensions,
  Animated ,
  Easing,
  StyleSheet,
  Button,
  View,
  Image,
  Text
} from 'react-native'

import Colors from './assets/colorTheme'

const compass = require('./assets/images/compass.png')
const compassHand = require('./assets/images/test_compass.png')

const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let paths = []

const compassSize = width * 0.8

class App extends Component {

   constructor(props){
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.state = {
      lastHeading: 0,
      newHeading: 0
    }
  }
  animateNewHeading(){
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear
      }
    ).start()
  }

  _crazyMod(a, n) {
    return a - Math.floor(a / n) * n
  }


  _renderCompass(lastHeading, newHeading) {
    var l = 90
    var n = 110
    var a = n - l
    newHeading = (this._crazyMod((n - l) + 180, 360) - 180) + l
    this.animateNewHeading()
    const animate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0 + 'deg', 180 + 'deg']
    })
    return (
      <View style={style.compassContainer} >
        <View style={style.compassInnerContainer} >
          <Image style={{width: compassSize, height: compassSize}}
            source={compass}
             />
          <Animated.Image
          resizeMode={'contain'}
            style={{
                position: 'absolute',
                top: 13,
                left: 13,
                width: compassSize - 26,
                height: compassSize - 26,
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

  _renderWindSpeed(windSpeed) {
    return (
      <View style={style.windSpeedContainer} >
        <Text>{'Wind speed'}</Text>
        <Text style={style.speedText} >{windSpeed}</Text>
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

AppRegistry.registerComponent('sailing', () => App)

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

