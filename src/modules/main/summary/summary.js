// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Animated,
  ScrollView,
  TouchableHighlight
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MapView from 'react-native-maps'


import ReactART from 'ReactNativeART'


const {
  Shape,
  Surface,
  Path,
  Group,
  Text,
  Wedge
} = ReactART


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

import { getSummaryInformation } from '../../../actions/summary'


// var paths = [{ "time": 1485206064773, "speed": 1.997632504255838 }, { "time": 1485206070372, "speed": 3.068956296859301 }, { "time": 1485206071372, "speed": 3.54159961623714 }, { "time": 1485206072372, "speed": 3.765967435454199 }, { "time": 1485206073372, "speed": 4.173442678368795 }, { "time": 1485206074372, "speed": 3.897974498030536 }, { "time": 1485206075372, "speed": 4.171193772728991 }, { "time": 1485206076372, "speed": 3.922153230579238 }, { "time": 1485206077372, "speed": 4.352127387661957 }, { "time": 1485206078371, "speed": 3.901507834743171 }, { "time": 1485206079372, "speed": 3.713187147557339 }, { "time": 1485206080372, "speed": 3.625968676548974 }, { "time": 1485206081372, "speed": 3.526898757324068 }, { "time": 1485206082372, "speed": 3.54577457915066 }, { "time": 1485206083372, "speed": 3.351251020246505 }, { "time": 1485206084372, "speed": 3.487413873666839 }, { "time": 1485206085372, "speed": 3.619336709520822 }, { "time": 1485206086373, "speed": 3.671533797561137 }, { "time": 1485206087376, "speed": 3.626054463107192 }, { "time": 1485206088379, "speed": 3.728547275693853 }, { "time": 1485206089378, "speed": 3.631790375221834 }, { "time": 1485206090372, "speed": 3.788737332049081 }, { "time": 1485206091381, "speed": 3.811115452112911 }, { "time": 1485206092373, "speed": 3.708675283447745 }, { "time": 1485206093380, "speed": 3.681595690124138 }, { "time": 1485206094380, "speed": 3.714363455998627 }, { "time": 1485206095373, "speed": 4.26920306789536 }]

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      sessionKey: props.componentProps.sessionKey,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylines:
      {
        id: 1,
        coordinates: []
      },
      paths: []
    }

    console.log('props', props)

  }

  componentDidMount() {
    getSummaryInformation(this.state.sessionKey).then(data => {
      console.log('getSummaryInformation', data)
    })
  }

  componentWillUnmount() {

  }



  _x(value) {
    return 100 - (value * 100) / 5
  }

  _y(i) {

    return i * 30
  }


  areaChart() {
    // console.log(w,h,points)demoArray//
    // let points = this.props.points
    if (this.state.paths.length < 3) return null

    // if (points.length > width) {
    //   points.splice(0, (points.length - width))
    //   // console.log((width - points.length))
    // }

    let i = 0
    let path = Path().moveTo(0, 100)
      .lineTo(0, this._x(this.state.paths[i].speed))

    for (i = 1; i < this.state.paths.length - 2; i++) {
      path = path.curveTo(this._y(i), this._x(this.state.paths[i].speed), this._y(i) + 15, (this._x(this.state.paths[i].speed) + this._x(this.state.paths[i + 1].speed)) / 2)
    }


    // .lineTo(10, 5 - paths[1].speed)
    // .lineTo(20, 5 - paths[2].speed)
    // .lineTo(30, 5 - paths[3].speed)
    // .lineTo(40, 5 - paths[4].speed)
    // .lineTo(50, 5 - paths[5].speed)
    // .lineTo(60, 5 - paths[6].speed)

    // for (i = 1; i < paths.length - 2; i++) {
    //   const p = paths[i]
    //   const q = paths[i + 1]
    //   const xc = (10 + (i * 10))
    //   const yc = (p.speed + q.speed) / 2
    //   path = path.curveTo((i * 10), p.speed, 10 + (i * 10), yc)
    // }

    path = path.lineTo(this._y(i) + 15, (this._x(this.state.paths[i].speed) + this._x(this.state.paths[i + 1].speed)) / 2)
    //   .lineTo(220, paths[i + 1].speed)


    const d = path.lineTo((this.state.paths.length - 2) * 30, 100).close()
    console.log(d)
    // const AnimatedShape = Animated.createAnimatedComponent(path)

    // console.log(d)
    // <AnimatedShape d={d} />
    // <Shape d={path} stroke="#000" strokeWidth={1} />

    return (
      <ScrollView
        ref={scrollView => { this._scrollView = scrollView; } }
        automaticallyAdjustContentInsets={false}
        horizontal={true}
        style={{ flex: 1 }} >

        <Surface width={(this.state.paths.length - 2) * 30} height={100} style={{ marginTop: 10 }}>
          <Shape d={d} stroke="#000" fill="#303030" strokeWidth={1} />
        </Surface>
      </ScrollView>
    )
  }

  render() {

    return (
      <View style={{ width, height, backgroundColor: 'pink' }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}>
          <MapView.Polyline
            key={this.state.polylines.id}
            coordinates={this.state.polylines.coordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1} />
        </MapView>
        {this.areaChart()}
      </View>
    )
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Summary)