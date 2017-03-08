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
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native'

import MapView from 'react-native-maps'

import moment from 'moment'

import ReactART from 'ReactNativeART'
import Colors from '../../../../assets/colorTheme'
import { SmallText } from '../../../components/text'

const {
  Shape,
  Surface,
  Path,
} = ReactART

const backButtonIcon = require('../../../../assets/icons/back-arrow.png')
const { width, height } = Dimensions.get('window')

const graphHeight = height * 0.3

export default class SummaryView extends Component {

  constructor(props) {
    super(props)
  }

  static propTypes = {
    dateTime: PropTypes.number.isRequired,
    locationName: PropTypes.string.isRequired,
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
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
      windSpeed: PropTypes.number.isRequired,
    })).isRequired,
    windAverage: PropTypes.number.isRequired,
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
        <Text style={style.dateText}>{moment(this.props.dateTime).format('llll')}</Text>
        <Text style={style.locationText}>{this.props.locationName}</Text>
      </View>
    )
  }

  _renderBackButton(){
    return (
      <TouchableOpacity style={style.backButtonStyle}
        onPress={this.props.onPressBack} >
        <Image
          style={{tintColor: 'black'}}
          source={backButtonIcon} />
      </TouchableOpacity>
    )
  }

  _renderMapArea() {
    return (
      <MapView
        style={style.map}
        mapType={'satellite'}
        pitchEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
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

  _renderResultArea(){
    const {
      startTime,
      endTime,
      windAverage,
      maxWindSpeed
    } = this.props
    var x = endTime - startTime
    var y = maxWindSpeed - 1
    return (
       <View style={style.resultContainer} >
         <SmallText textContent={'Duration: ' + moment.utc(x).format('HH:mm:ss')} />
         <SmallText textContent={'Avg: ' + windAverage + ' m/s'} />
         <SmallText textContent={'Max: ' + y + ' m/s'} />
       </View>
    )
  }

  _renderGraphArea() {
    if (this.props.paths.length < 3) {
      return null
    }
    let i = 0
    let path = Path().moveTo(0, graphHeight).lineTo(0, this._calculateY(this.props.paths[i].windSpeed))
    for (i = 1; i < this.props.paths.length - 2; i++) {
      path = path.curveTo(
        this._calculateX(i),
        this._calculateY(this.props.paths[i].windSpeed),
        this._calculateX(i) + 2,
        (this._calculateY(this.props.paths[i].windSpeed) + this._calculateY(this.props.paths[i + 1].windSpeed)) / 2
      )
    }
    path = path.lineTo(
      this._calculateX(i) + 2,
      (this._calculateY(this.props.paths[i].windSpeed) + this._calculateY(this.props.paths[i + 1].windSpeed)) / 2
    )

    path = path.lineTo(this._calculateX(i) + 2, graphHeight)

    const d = path.close()
    return (
        <View style={style.graphContainer}>
          {this._renderWindSpeedPoints()}
          <ScrollView
            ref={scrollView => { this._scrollView = scrollView }}
            automaticallyAdjustContentInsets={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}>
            <Surface width={(this.props.paths.length - 2) * 4} height={graphHeight}>
              <Shape d={d} stroke="#000" fill={Colors.vaavudBlue} strokeWidth={1} />
            </Surface>
            {this._renderGraphTimeGrid()}
          </ScrollView>
        </View>
    )
  }

  _getDirection(timestamp) {
    var len = this.props.directions.length
    for (let i = 0; i < len; i += 1) {
      if (this.props.directions[i].timestamp >= timestamp) {
        return this.props.directions[i].windDirection
      }
    }
  }

  _renderGraphTimeGrid() {
    const max = this.props.paths.length
    let render = []
    for (let i = 0; i < max; i += 1) {
      if (i % 20 === 0) {
        var x = this._getDirection(this.props.paths[i].timestamp)
        render.push(
          <View style={style.topGrid}
            pointerEvents="box-none" >
            <Text style={{ fontSize: 20, color: Colors.vaavudBlue, transform: [{ 'rotate': x + 'deg' }] }} >{'↑'}</Text>
            <SmallText style={{backgroundColor: 'transparent'}} textContent={moment(this.props.paths[i].timestamp).format('LT')} />
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
      if (i === max || i === min) {
        render.push(<SmallText textContent={'    '} />)
      } else {
        if (i % 2 === 0){
          render.push(<SmallText textContent={i + 'm/s'} />)
        } else {
          render.push(<SmallText textContent={'    '} />)
        }
      }
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
        {this._renderMapArea()}
        {this._renderHeader()}
        {this._renderBackButton()}
        {this._renderResultArea()}
        {this._renderGraphArea()}
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  sectionContainer: {
    position: 'absolute',
    width: width,
    padding: 5,
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  resultContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
    margin: 20,
    backgroundColor: Colors.container
  },
  backButtonStyle:{
    position: 'absolute',
    top: Platform.OS === 'ios' ? 25 : 15,
    left: 15,
  },
  dateText: {
    color: 'black',
    margin: 5,
  },
  locationText: {
    color: 'black',
    fontSize: 20
  },
  map: {
    width: width,
    height: height * 0.45,
    alignItems: 'center'
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    paddingBottom: 0,
    borderRadius: 5,
    backgroundColor: Colors.container,
    height: graphHeight + 40,
    justifyContent: 'center',
  },
  graphTimeText: {
    textAlign: 'center'
  },
  windSpeedContainer: {
    marginRight: 5,
    height: graphHeight,
    justifyContent: 'space-between'
  },
  topGrid: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRightWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    width: 80,
    height: graphHeight
  },
})
