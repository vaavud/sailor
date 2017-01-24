// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Animated,
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
  Text
} = ReactART


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 13
const LONGITUDE = 13
const LATITUDE_DELTA = 12.9922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;


var paths = [{ "time": 1485206064773, "speed": 1.997632504255838 }, { "time": 1485206070372, "speed": 3.068956296859301 }, { "time": 1485206071372, "speed": 3.54159961623714 }, { "time": 1485206072372, "speed": 3.765967435454199 }, { "time": 1485206073372, "speed": 4.173442678368795 }, { "time": 1485206074372, "speed": 3.897974498030536 }, { "time": 1485206075372, "speed": 4.171193772728991 }, { "time": 1485206076372, "speed": 3.922153230579238 }, { "time": 1485206077372, "speed": 4.352127387661957 }, { "time": 1485206078371, "speed": 3.901507834743171 }, { "time": 1485206079372, "speed": 3.713187147557339 }, { "time": 1485206080372, "speed": 3.625968676548974 }, { "time": 1485206081372, "speed": 3.526898757324068 }, { "time": 1485206082372, "speed": 3.54577457915066 }, { "time": 1485206083372, "speed": 3.351251020246505 }, { "time": 1485206084372, "speed": 3.487413873666839 }, { "time": 1485206085372, "speed": 3.619336709520822 }, { "time": 1485206086373, "speed": 3.671533797561137 }, { "time": 1485206087376, "speed": 3.626054463107192 }, { "time": 1485206088379, "speed": 3.728547275693853 }, { "time": 1485206089378, "speed": 3.631790375221834 }, { "time": 1485206090372, "speed": 3.788737332049081 }, { "time": 1485206091381, "speed": 3.811115452112911 }, { "time": 1485206092373, "speed": 3.708675283447745 }, { "time": 1485206093380, "speed": 3.681595690124138 }, { "time": 1485206094380, "speed": 3.714363455998627 }, { "time": 1485206095373, "speed": 4.26920306789536 }]

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylines:
      {
        id: 1,
        coordinates: [
          {
            latitude: 10,
            longitude: 10
          },
          {
            latitude: 11,
            longitude: 11
          },
          {
            latitude: 12,
            longitude: 12
          },
          {
            latitude: 13,
            longitude: 13
          },
          {
            latitude: 14,
            longitude: 14
          },
          {
            latitude: 15,
            longitude: 15
          },
          {
            latitude: 16,
            longitude: 16
          },
          {
            latitude: 17,
            longitude: 17
          }
        ]
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // <MapView
  //         style={{ flex: 1 }}
  //         initialRegion={this.state.region}
  //         >
  //         <MapView.Polyline
  //           key={this.state.polylines.id}
  //           coordinates={this.state.polylines.coordinates}
  //           strokeColor="#000"
  //           fillColor="rgba(255,0,0,0.5)"
  //           strokeWidth={1}
  //           />

  //       </MapView>


  areaChart() {
    // console.log(w,h,points)demoArray//
    // let points = this.props.points
    // if (points.length < 3) return null

    // if (points.length > width) {
    //   points.splice(0, (points.length - width))
    //   // console.log((width - points.length))
    // }

    let i = 0
    // let path = Path().moveTo(0, 101)
    //   .lineTo(2, paths[i].speed)
    //   .lineTo(paths[i].time, paths[i].speed)

    // for (i = 1; i < paths.length - 2; i++) {
    //   const p = paths[i]
    //   const q = paths[i + 1]
    //   const xc = (paths[i].time + paths[i + 1].time) / 2
    //   const yc = (p.speed + q.speed) / 2
    //   path = path.curveTo(paths[i].time, p.speed, xc, yc)
    // }

    // path = path.curveTo(paths[i].time, paths[i].speed, paths[i + 1].time, paths[i + 1].speed)
    //   .lineTo(paths[i + 1].time, paths[i + 1].speed)

    const path = Path();
    path.moveTo(1, 1); //将起始点移动到(1,1) 默认(0,0)
    path.lineTo(300, 1); //连线到目标点(300,1)

    // const d = path.lineTo(width, 200)
    // const AnimatedShape = Animated.createAnimatedComponent(path)

    // console.log(d)
    // <AnimatedShape d={d} />
    // <Shape d={path} stroke="#000" strokeWidth={1} />


    return (
      <Surface width={700} height={700}>
        <Shape fill="#7BC7BA" d={BG_PATH} />
      </Surface>
    )
  }



  render() {

    return (
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', }}>
        <Surface width={500} height={500} style={{ backgroundColor: 'blue' }}>
          <Group x={210} y={135} style={{ backgroundColor: 'red' }}>
            <Shape fill="#D97B76" d={RED_DOT_PATH} />
            <Shape fill="#DBBB79" d={YELLOW_DOT_PATH} />
            <Shape fill="#A6BD8A" d={GREEN_DOT_PATH} />
          </Group>
        </Surface>
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


const BG_PATH = "M3.00191459,1 C1.34400294,1 0,2.34785514 0,4.00550479 L0,217.994495 C0,219.65439 1.34239483,221 3.00191459,221 L276.998085,221 C278.655997,221 280,219.652145 280,217.994495 L280,4.00550479 C280,2.34561033 278.657605,1 276.998085,1 L3.00191459,1 Z M3.00191459,1";
const RED_DOT_PATH = "M12.5,17 C16.0898511,17 19,14.0898511 19,10.5 C19,6.91014895 16.0898511,4 12.5,4 C8.91014895,4 6,6.91014895 6,10.5 C6,14.0898511 8.91014895,17 12.5,17 Z M12.5,17";
const YELLOW_DOT_PATH = "M31.5,17 C35.0898511,17 38,14.0898511 38,10.5 C38,6.91014895 35.0898511,4 31.5,4 C27.9101489,4 25,6.91014895 25,10.5 C25,14.0898511 27.9101489,17 31.5,17 Z M31.5,17";
const GREEN_DOT_PATH = "M50.5,17 C54.0898511,17 57,14.0898511 57,10.5 C57,6.91014895 54.0898511,4 50.5,4 C46.9101489,4 44,6.91014895 44,10.5 C44,14.0898511 46.9101489,17 50.5,17 Z M50.5,17";
