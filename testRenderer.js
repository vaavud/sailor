import React, { Component } from 'react'
import { AppRegistry, Dimensions } from 'react-native'

import moment from 'moment'

import TestView from './src/views/main/summary'

const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let paths = []



class App extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {

    for (let i = 0; i <= 10; i += 1) {
      paths.push({ "time": 1485206064773, "speed": 3.997632504255838 }, { "time": 1485206070372, "speed": 3.068956296859301 }, { "time": 1485206071372, "speed": 3.54159961623714 }, { "time": 1485206072372, "speed": 3.765967435454199 }, { "time": 1485206073372, "speed": 4.173442678368795 }, { "time": 1485206074372, "speed": 3.897974498030536 }, { "time": 1485206075372, "speed": 4.171193772728991 }, { "time": 1485206076372, "speed": 3.922153230579238 }, { "time": 1485206077372, "speed": 4.352127387661957 }, { "time": 1485206078371, "speed": 3.901507834743171 }, { "time": 1485206079372, "speed": 3.713187147557339 }, { "time": 1485206080372, "speed": 3.625968676548974 }, { "time": 1485206081372, "speed": 3.526898757324068 }, { "time": 1485206082372, "speed": 3.54577457915066 }, { "time": 1485206083372, "speed": 3.351251020246505 }, { "time": 1485206084372, "speed": 2.5 }, { "time": 1485206085372, "speed": 3.619336709520822 }, { "time": 1485206086373, "speed": 3.671533797561137 }, { "time": 1485206087376, "speed": 3.626054463107192 }, { "time": 1485206088379, "speed": 3.728547275693853 }, { "time": 1485206089378, "speed": 3.631790375221834 }, { "time": 1485206090372, "speed": 3.788737332049081 }, { "time": 1485206091381, "speed": 3.811115452112911 }, { "time": 1485206092373, "speed": 3.708675283447745 }, { "time": 1485206093380, "speed": 3.681595690124138 }, { "time": 1485206094380, "speed": 3.714363455998627 }, { "time": 1485206095373, "speed": 4.26920306789536 })
    }
  }

  render() {
    return (
      <TestView
        region={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        dateTime={1486053616211}
        locationName={'Islands brygge'}
        tripCoordinates={{
          id: 1,
          coordinates: null
        }}
        paths={paths}
        maxWindSpeed={4} />
    )
  }
}

AppRegistry.registerComponent('sailing', () => App)
