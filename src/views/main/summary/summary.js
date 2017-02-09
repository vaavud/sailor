// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet
} from 'react-native'

import MapView from 'react-native-maps'

import moment from 'moment'

import ReactART from 'ReactNativeART'
import Colors from '../../../../assets/colorTheme'
import {SmallText, NormalText} from '../../../components/text'

const {
  Shape,
  Surface,
  Path,
} = ReactART

const { width, height } = Dimensions.get('window')

const graphHeight = 150

export default class SummaryView extends Component {

  constructor(props) {
    super(props)
    console.log('final logs', props)
  }

  static propTypes = {
    dateTime: PropTypes.number.isRequired,
    locationName: PropTypes.string.isRequired,
    region: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number.isRequired,
      longitudeDelta: PropTypes.number.isRequired
    }).isRequired,

    tripCoordinates: PropTypes.shape({
      id: PropTypes.number.isRequired,
      coordinates: PropTypes.arrayOf(PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired
      })).isRequired
    }).isRequired,

    paths: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      speed: PropTypes.number.isRequired,
    })).isRequired,
    minWindSpeed: PropTypes.number.isRequired,
    maxWindSpeed: PropTypes.number.isRequired
  }

  _calculateY(value) {
    return (this.props.maxWindSpeed - value) * (graphHeight / (this.props.maxWindSpeed - this.props.minWindSpeed))
  }

  _calculateX(i) {
    return i * 4
  }

  _renderHeader() {
    return (
      <View style={style.sectionContainer} >
        <Text style={style.dateText}>{moment(this.props.dateTime).format('LLLL')}</Text>
        <Text style={style.locationText}>{this.props.locationName}</Text>
      </View>
    )
  }

  _renderMapArea() {
    return (
      <MapView
        style={style.map}
        initialRegion={this.props.region} >
        <MapView.Polyline
          key={this.props.tripCoordinates.id}
          coordinates={this.props.tripCoordinates.coordinates}
          strokeColor="#000"
          fillColor="rgba(255,0,0,0.5)"
          strokeWidth={1} />
      </MapView>
    )
  }

  _renderGraphArea() {
    if (this.props.paths.length < 3) {
      return null
    }
    let i = 0
    let path = Path().moveTo(0, this._calculateY(this.props.paths[i].speed))
    for (i = 1; i < this.props.paths.length - 2; i++) {
      path = path.curveTo(
        this._calculateX(i),
        this._calculateY(this.props.paths[i].speed),
        this._calculateX(i) + 2,
        (this._calculateY(this.props.paths[i].speed) + this._calculateY(this.props.paths[i + 1].speed)) / 2
      )
    }
    path = path.lineTo(
      this._calculateX(i) + 2,
      (this._calculateY(this.props.paths[i].speed) + this._calculateY(this.props.paths[i + 1].speed)) / 2
    )
    const d = path
    return (
      <View style={style.graphAreaContainer}>
        <View style={style.graphContainer}>
          {this._renderWindSpeedPoints()}
          <ScrollView
            ref={scrollView => { this._scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}>

            <Surface width={(this.props.paths.length - 2) * 4} height={graphHeight}>
              <Shape d={d} stroke="#000" strokeWidth={1} />
            </Surface>
            {this._renderGraphTimeGrid()}
          </ScrollView>
        </View>
      </View>
    )
  }

  _getDirection(timestamp){
    var len = this.props.directions.length
    for (let i = 0; i < len; i += 1){
      if (this.props.directions[i].timestamp >= timestamp) {
        return this.props.directions[i].direction
      }
    }
  }

  _renderGraphTimeGrid() {
    const max = this.props.paths.length
    let render = []
    for (let i = max; i > 0; i -= 1) {
      if (i % 20 === 0) {
        var x = this._getDirection(this.props.paths[i].timestamp)
        render.push(
          <View style={style.topGrid}
            pointerEvents="box-none" >
            <Text style={{fontSize: 20, color: Colors.vaavudBlue, transform: [{'rotate': x + 'deg'}]}} >{'↑'}</Text>
          </View>
        )
      }
    }
    return (
      <View style={{ position: 'absolute', flexDirection: 'row' }}>
        {render}
      </View>
    )
  }

  _renderWindSpeedPoints() {
    const max = this.props.maxWindSpeed
    const min = this.props.minWindSpeed
    let render = []
    for (let i = max; i >= min; i -= 1) {
      render.push(
        <SmallText textContent={i !== min ? i + ' m/s' : '   '} /> // i like this one =)
      )
    }
    return (
      <View style={style.windSpeedContainer}>
        {render}
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={style.container}>
        {this._renderHeader()}
        {this._renderMapArea()}
        {this._renderGraphArea()}
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.025,
    backgroundColor: Colors.background
  },
  sectionContainer: {
    padding: 5,
    alignItems: 'center',
  },
  dateText: {
    margin: 5
  },
  locationText: {
    fontSize: 20
  },
  map: {
    width: width * 0.9,
    height: height * 0.3
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  graphTimeText: {
    textAlign: 'center'
  },
  windSpeedContainer: {
    height: graphHeight,
    justifyContent: 'space-between'
  },
  topGrid: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    width: 80,
    height: graphHeight
  },
})
