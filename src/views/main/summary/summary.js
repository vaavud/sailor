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
  Image,
  InteractionManager,
  Animated
} from 'react-native'

import { connect } from 'react-redux'

import MapView from 'react-native-maps'
import { SpeedUnits, convertWindSpeed } from '../../../reactcommon/utils'
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

const graphHeight = 150

class SummaryView extends Component {


  state = { renderPlaceholderOnly: true }

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

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false })
    })
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

  _renderBackButton() {
    return (
      <TouchableOpacity style={style.backButtonStyle}
        onPress={this.props.onPressBack} >
        <Image
          style={{ tintColor: 'black' }}
          source={backButtonIcon} />
      </TouchableOpacity>
    )
  }

  _renderMapArea() { //this.props.tripCoordinates.coordinates

    return (
      <View style={{ position: 'absolute', top: 0, left: 0, width, height, justifyContent: 'flex-end' }} >
        <MapView
          style={style.map}
          mapType={'satellite'}
          pitchEnabled={false}
          scrollEnabled={true}
          zoomEnabled={true}
          initialRegion={this.props.region} >
          <MapView.Polyline
            key={this.props.tripCoordinates.id}
            coordinates={this.props.tripCoordinates.coordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1} />
        </MapView>
      </View>
    )
  }

  _renderResultArea() {
    const {
      windAverage,
      maxWindSpeed
    } = this.props



    let timeStart = this.props.paths[0].timestamp
    let timeEnd = this.props.paths[this.props.paths.length - 1].timestamp
    let time = timeEnd - timeStart
    var y = maxWindSpeed - 1
    return (
      <View style={style.resultContainer} >
        <View>
          <SmallText style={{ marginRight: 5, textAlign: 'center', backgroundColor: 'transparent', color: '#0080b3', fontWeight: 'bold' }} textContent={SpeedUnits[this.props.settings.windSpeed]} />
        </View>
        <SmallText textContent={'Duration: ' + moment.utc(time).format('HH:mm:ss')} />
        <SmallText textContent={'Avg: ' + parseFloat(convertWindSpeed(windAverage, this.props.settings.windSpeed)).toFixed(1) + ' ' + SpeedUnits[this.props.settings.windSpeed]} />
      </View>
    )
  }

  _renderGraphArea() {
    if (this.props.paths.length < 3) {
      return (
        <View style={style.emptyGraphContainer}>
          <SmallText style={style.emptyGraphText} textContent={'This measurement doesn\'t contain enough\n measurment points to draw a graph'} />
        </View>
      )
    }
    let i = 0
    let path = Path().moveTo(0, graphHeight).lineTo(this.props.minWindSpeed, this._calculateY(this.props.paths[i].windSpeed))
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
            <Shape d={d}
              stroke={'#0080b3'}
              fill={'#99d0e6'}
              strokeWidth={1} />
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
            <Text style={{ fontSize: 20, color: '#0080b3', transform: [{ 'rotate': x + 'deg' }] }} >{'↑'}</Text>
            <SmallText style={{ backgroundColor: 'transparent', color: '#0080b3', fontWeight: 'bold' }} textContent={moment(this.props.paths[i].timestamp).format('LT')} />
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


  _renderWorkingView() {
    return (
      <View style={{ backgroundColor: Colors.vaavudBlue, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}> Working with data </Text>
        <Text style={{ color: 'white' }}> please wait a moment... </Text>
      </View>)

  }

  _renderWindSpeedPoints() {
    const max = convertWindSpeed(this.props.maxWindSpeed, this.props.settings.windSpeed).toFixed(0)
    const min = 0
    const mid = max / 2
    let render = []
    for (let i = 1; i < 4; i++) {
      if (i === 1) {
        render.push(<SmallText style={{ marginRight: 5, textAlign: 'center', backgroundColor: 'transparent', color: '#0080b3', fontWeight: 'bold' }} textContent={max} />)
      } else if (i === 2) {
        render.push(<SmallText style={{ marginRight: 5, textAlign: 'center', backgroundColor: 'transparent', color: '#0080b3', fontWeight: 'bold' }} textContent={mid} />)
      } else {
        render.push(<SmallText style={{ marginRight: 5, textAlign: 'center', backgroundColor: 'transparent', color: '#0080b3', fontWeight: 'bold' }} textContent={min} />)
      }
    }
    return (
      <View style={style.windSpeedContainer}>
        {render}
      </View>
    )
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderWorkingView()
    }

    return (
      <View style={style.container}>
        {this._renderMapArea()}
        {this._renderHeader()}
        {this._renderBackButton()}
        {this._renderResultArea()}
        {this._renderGraphArea()}
      </View>
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(SummaryView)

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
  resultContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: width - 20,
    left: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#80a4b3',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    bottom: graphHeight + 50,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  backButtonStyle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 25 : 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    transform: [{
      scale: 0.8
    }],
    left: 0,
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
    height: height,
    alignItems: 'center'
  },
  graphContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 10,
    left: 10,
    width: width - 20,
    padding: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: 'rgba(255,255,255,1)',
    height: graphHeight + 40,
    justifyContent: 'center',
  },
  emptyGraphContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 10,
    left: 10,
    width: width - 20,
    padding: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: 'rgba(255,255,255,1)',
    height: graphHeight + 40,
    justifyContent: 'center',
  },
  emptyGraphText: {
    textAlign: 'center',
    fontSize: 16
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
    borderRightWidth: 1,
    borderColor: '#80a4b3',
    width: 80,
    height: graphHeight
  },
})
