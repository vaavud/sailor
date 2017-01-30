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
  StyleSheet
} from 'react-native'

import Colors from '../../../../assets/colorTheme'


const compass = require('../../../../assets/trueWindCompass.png')
const compassHand = require('../../../../assets/trueWindCompassHand.png')

export default class MeasureView extends Component {

  static propTypes = {
    windHeading: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    windSpeedUnit: PropTypes.number.isRequired,
    groundSpeed: PropTypes.number, // optional =) default will be N/A
    groundSpeedUnit: PropTypes.number.isRequired
  }

  _renderCompass(heading){
    // hook up heading
    return (
      <View style={style.compassContainer} >
        <View style={style.compassInnerContainer} >
          <Image source={compass} />
          <Image 
          style={
            {
              position: 'absolute',
              transform: [{'rotate': heading + 'deg'}]
            }
            } source={compassHand} />
        </View>
      </View>
    )
  }

  _renderWindText(){
    return (
      <View style={style.windTextContainer} >
        <Text style={style.windText} >{'TRUE'}</Text>
      </View>
    )
  }

  _renderSpeedContainer(){
    return (
      <View style={style.speedContainer} >
        {this._renderGroundSpeed()}
        {this._renderWindSpeed()}
      </View>
    )
  }

  _renderGroundSpeed(){
    return (
      <View style={style.groundSpeedContainer} >
        <Text>{'Ground speed'}</Text>
        <Text style={style.speedText}>{'N/A'}</Text>
        <Text>{'knots'}</Text>
      </View>
    )
  }

  _renderWindSpeed(windSpeed){
    return (
      <View style={style.windSpeedContainer} >
        <Text>{'Wind speed'}</Text>
        <Text style={style.speedText} >{'12'}</Text>
        <Text>{'knots'}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={style.container} >
        {this._renderCompass('90')/* TODO get heading from container */ }
        {this._renderWindText()}
        {this._renderSpeedContainer('N/A', 12)}
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
