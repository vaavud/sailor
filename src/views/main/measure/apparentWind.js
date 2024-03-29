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
  Animated,
  Easing,
  Dimensions
} from 'react-native'

import {textStyle} from '../../../components/text'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Colors from '../../../../assets/colorTheme'

const { width } = Dimensions.get('window')

// const compass = require('../../../../assets/trueWindCompass.png')
// const compassHand = require('../../../../assets/trueWindCompassHand.png')
const compass = require('../../../../assets/images/aw_compass.png')
const compassHand = require('../../../../assets/images/test_compass.png')

const compassSize = width * 0.8

export default class ApparentWindView extends Component {

  constructor(props) {
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
    groundSpeed: PropTypes.number, // optional =) default will be N/A
    testStop: PropTypes.func.isRequired
  }

  animateNewHeading() {
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
    newHeading = (this._crazyMod((n - l) + 180, 360) - 180) + l
    this.animateNewHeading()
    const animate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [lastHeading + 'deg', newHeading + 'deg']
    })
    return (
      <View style={style.compassContainer} >
        <View style={style.compassInnerContainer} >
          <Image style={{ width: compassSize, height: compassSize }}
            source={compass}
          />
          <Animated.Image
            resizeMode={'cover'}
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
        <Text style={style.windText} >{'Apparent wind'}</Text>
      </View>
    )
  }

  _renderSpeedContainer(groundSpeed, windSpeed) {
    if (groundSpeed < 0) {
      groundSpeed = 0
    }
    return (
      <View style={style.speedContainer} >
        {this._renderGroundSpeed(groundSpeed)}
        {this._renderWindSpeed(windSpeed)}
      </View>
    )
  }

  _renderGroundSpeed(groundSpeed) {
    return (
      <View style={style.groundSpeedContainer} >
        <Text style={textStyle.normal} >{'Ground speed'}</Text>
        <Text style={style.speedText}>{groundSpeed}</Text>
        <Text style={textStyle.normal}>{this.props.windUnit}</Text>
      </View>
    )
  }

  _renderWindSpeed(windSpeed) {
    return (
      <View style={style.windSpeedContainer} >
        <Text style={textStyle.normal}>{'Wind speed'}</Text>
        <Text style={style.speedText}  >{windSpeed}</Text>
        <Text style={textStyle.normal} >{this.props.windUnit}</Text>
      </View>
    )
  }

  _renderHeader = () => {
    return (
      <View style={style.headerContainer} >
        <View style={style.headerLeft} >
          <Icon.Button name="close-circle-outline" backgroundColor={Colors.vaavudRed} onPress={this.props.testStop}>
            <Text style={{...textStyle.normal, color: 'white'}} >Stop</Text>
        </Icon.Button>
        </View>
        <View style={style.headerRight} >
          <Text style={{ ...textStyle.normal, fontSize: 24 }} >{this.props.batteryLevel + ' % '}</Text>
          <Icon style={{ fontSize: 24 }} name="battery" />
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={style.container}>
        {this._renderHeader()}
        {this._renderCompass(this.props.lastWindHeading, this.props.windHeading)}
        {this._renderWindText()}
        {this._renderSpeedContainer(this.props.velocity, this.props.windSpeed)}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    width,
    flex: 1,
    backgroundColor: Colors.background
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerLeft: {
    flex: 2,
    height: 100,
    alignItems: 'flex-start',
    paddingLeft: 20,
    justifyContent: 'center',
  },
  headerRight: {
    flex: 2,
    flexDirection: 'row',
    height: 100,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  compassContainer: {
    flex: 2,
    marginTop: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  windTextContainer: {
    margin: 20,
    alignItems: 'center',
  },
  windText: {
    ...textStyle.normal,
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
    height: 100,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.2)'
  },
  groundSpeedContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  speedText: {
    ...textStyle.normal,
    fontSize: 30,
    fontWeight: 'bold'
  }
})
