// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Dimensions,
} from 'react-native'

import { connect } from 'react-redux'


const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height;
const LATITUDE = 55.66674646433456
const LONGITUDE = 12.580140583275785
const LATITUDE_DELTA = 0.0092;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

import { getSummaryInformation } from '../../../actions/summary'

import TestView from '../../../views/main/summary'

class Summary extends Component {

  constructor(props) {
    super(props)

    var paths = []
    for (let i in props.componentProps.speed) {
      paths.push({ 'speed': props.componentProps.speed[i].value, 'time': props.componentProps.speed[i].timestamp })
    }

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
        coordinates: []
      },
      paths
    }

    console.log('props', props, this.state,paths)

  }

  componentDidMount() {
    // getSummaryInformation(this.state.sessionKey).then(data => {
    //   let paths = []
    //   let locations = []
    //   let directions = []

    //   console.log('init', Date.now())
    //   for (let index in data.windSpeeds) {
    //     paths.push({ speed: data.windSpeeds[index], time: data.timestamps[index] })
    //     locations.push(({ location: data.locations[index], time: data.timestamps[index] }))
    //     directions.push(({ direction: data.windDirections[index], time: data.timestamps[index] }))
    //   }
    //   console.log('end', Date.now())


    //   this.setState({ paths, locations })
    //   console.log('getSummaryInformation', data)
    // })
  }

  componentWillUnmount() {

  }



  /*_x(value) {
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
        ref={scrollView => { this._scrollView = scrollView; }}
        automaticallyAdjustContentInsets={false}
        horizontal={true}
        style={{ flex: 1 }} >

        <Surface width={(this.state.paths.length - 2) * 30} height={100} style={{ marginTop: 10 }}>
          <Shape d={d} stroke="#000" fill="#303030" strokeWidth={1} />
        </Surface>
      </ScrollView>
    )
  }*/

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
        paths={this.state.paths}
        maxWindSpeed={5} />
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