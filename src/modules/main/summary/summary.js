// @flow

'use strict'

import React, { Component } from 'react'
import {
  View
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MapView from 'react-native-maps'
import { SmoothLine } from 'react-native-pathjs-charts'


let data = [
  [{
    "x": -10,
    "y": -1000
  }, {
    "x": -9,
    "y": -729
  }, {
    "x": -8,
    "y": -512
  }, {
    "x": -7,
    "y": -343
  }, {
    "x": -6,
    "y": -216
  }, {
    "x": -5,
    "y": -125
  }, {
    "x": -4,
    "y": -64
  }, {
    "x": -3,
    "y": -27
  }, {
    "x": -2,
    "y": -8
  }, {
    "x": -1,
    "y": -1
  }, {
    "x": 0,
    "y": 0
  }, {
    "x": 1,
    "y": 1
  }, {
    "x": 2,
    "y": 8
  }, {
    "x": 3,
    "y": 27
  }, {
    "x": 4,
    "y": 64
  }, {
    "x": 5,
    "y": 125
  }, {
    "x": 6,
    "y": 216
  }, {
    "x": 7,
    "y": 343
  }, {
    "x": 8,
    "y": 512
  }, {
    "x": 9,
    "y": 729
  }, {
    "x": 10,
    "y": 1000
  }],
  [{
    "x": -10,
    "y": 100
  }, {
    "x": -9,
    "y": 81
  }, {
    "x": -8,
    "y": 64
  }, {
    "x": -7,
    "y": 49
  }, {
    "x": -6,
    "y": 36
  }, {
    "x": -5,
    "y": 25
  }, {
    "x": -4,
    "y": 16
  }, {
    "x": -3,
    "y": 9
  }, {
    "x": -2,
    "y": 4
  }, {
    "x": -1,
    "y": 1
  }, {
    "x": 0,
    "y": 0
  }, {
    "x": 1,
    "y": 1
  }, {
    "x": 2,
    "y": 4
  }, {
    "x": 3,
    "y": 9
  }, {
    "x": 4,
    "y": 16
  }, {
    "x": 5,
    "y": 25
  }, {
    "x": 6,
    "y": 36
  }, {
    "x": 7,
    "y": 49
  }, {
    "x": 8,
    "y": 64
  }, {
    "x": 9,
    "y": 81
  }, {
    "x": 10,
    "y": 100
  }]
]

let options = {
  width: 290,
  height: 290,
  color: '#2980B9',
  margin: {
    top: 20,
    left: 40,
    bottom: 30,
    right: 30
  },
  fill: "#2980B9",
  stroke: "#3E90F0",
  showLabels: true,
  animate: {
    type: 'delayed',
    duration: 200
  },
  label: {
    fontFamily: 'Arial',
    fontSize: 8,
    fontWeight: true,
    fill: '#34495E',
    showLabels: true
  },
  axisX: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: true,
    orient: 'bottom',
    label: {
      fontFamily: 'Arial',
      fontSize: 14,
      fontWeight: true,
      fill: '#34495E'
    },
    tickValues: [
      { value: 'name1' },
      { value: 'name2' },
      { value: 'name3' },
      { value: 'name4' },
      { value: 'name5' },
      { value: 'name6' },
      { value: 'name7' }
    ]
  },
  axisY: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: true,
    orient: 'left',
    label: {
      fontFamily: 'Arial',
      fontSize: 14,
      fontWeight: true,
      fill: '#000'
    }
  }
}


class Summary extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ height: 400, width: 200, backgroundColor: 'red' }} >

          <SmoothLine data={data} options={options} xKey="x" yKey="y" />

        </View>
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
