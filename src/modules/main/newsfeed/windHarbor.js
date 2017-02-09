// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  SegmentedControlIOS,
  Dimensions
} from 'react-native'

import Button from '../../../reactcommon/components/button'


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {width, height} = Dimensions.get('window')

import MultiSlider from 'react-native-multi-slider' //https://github.com/JackDanielsAndCode/react-native-multi-slider

import { saveHarbor } from '../../../actions/harbor'

// let SelectorView = requireNativeComponent('SelectorViewSwift', WindHarbor)


class WindHarbor extends Component {

  constructor(props) {
    super(props)
    // this.state = {
    //   marker: props.componentProps.marker,
    //   name: props.componentProps.name,
    //   windMax: 10,
    //   windMin: 3,
    //   ...props.componentProps.harbor
    // }

    // this._onFinish = this._onFinish.bind(this)
    // console.log('this.props', props.componentProps)

    this.state = {
      minSpeed: 1,
      maxSpeed: 16,
      windSpeedUnit: 'mps',
      loading: false
    }

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _onFinish() {
    let profile = {
      minSpeed: this.state.windMin,
      maxSpeed: this.state.windMax
    }

    let harbor = {
      location: { lat: this.state.marker.latitude, lon: this.state.marker.longitude },
      name: this.state.name,
      directions: this.state.directions
    }

    this.props.saveHarbor(harbor, profile, this.state.key).then(() => this.props.pop(true))
  }

  render() {
    // var maxSpeed = Math.floor(convertWindSpeed(this.state.maxSpeed, this.state.windSpeedUnit)).toFixed(0)
    // var minSpeed = Math.floor(convertWindSpeed(this.state.minSpeed, this.state.windSpeedUnit)).toFixed(0)
    // if (this.state.maxSpeed > 15) {
    //   maxSpeed = Math.floor(convertWindSpeed(15, this.state.windSpeedUnit)).toFixed(0) + '+'
    // }
    var windSpeedUnitNr = 0
    // switch (speed_conv[this.state.windSpeedUnit].short) {
    //   case 'm/s':
    //     windSpeedUnitNr = 0
    //     break
    //   case 'km/h':
    //     windSpeedUnitNr = 1
    //     break
    //   case 'knot':
    //     windSpeedUnitNr = 2
    //     break
    //   case 'mph':
    //     windSpeedUnitNr = 3
    //     break
    //   case 'bft':
    //     windSpeedUnitNr = 4
    //     break
    // }
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>

        <Text style={{ marginTop: 80 }}>Ready to roll!</Text>


        <View style={{ position: 'absolute', alignItems: 'center', height: 300, width, top: (width / 2) }} >

          <Text style={{}}>Your suggested wind range is </Text>
          <Text style={{ marginTop: 10, marginBottom: 50 }}>
            from
              <Text > {5} </Text>
            to
              <Text > {7} </Text>
          </Text>

          <MultiSlider
            style={{ width }}
            values={[1, 6]}
            min={this.state.windMin}
            max={this.state.windMax}
            onValuesChange={() => { }}
            onValuesChangeFinish={values => {
              console.log(values)
            }}
          />

          <Text style={{ marginTop: 5 }}>Move the sliders to fine tune the range</Text>

          <SegmentedControlIOS
            style={{ width: width - 60, marginTop: 30 }}
            backTint={'#fff'}
            selectedTint={'#fff'}
            selectedIndex={windSpeedUnitNr}
            values={['mps', 'kph', 'knot', 'mph']}
            onValueChange={event => { }} />

        </View>


        <View style={{ width: width - 80, height: 45, flexDirection: 'row', position: 'absolute', bottom: 50, left: 40 }} >
          <Button
            buttonStyle={{ flex: 0.3, backgroundColor: 'pink', margin: 5 }}
            textStyle={{ textAlign: 'center', marginTop: 8 }}
            title="Back" onPress={() => { }} />
          <Button
            textStyle={{ textAlign: 'center', marginTop: 8 }}
            buttonStyle={{ flex: 0.7, backgroundColor: 'pink', margin: 5 }} title="Finish"
            onPress={() => { }} />
        </View>

      </View>
    )

    /*<View>
          <Text>
            Ready to roll!
        </Text>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
            <Text>Your suggested wind range is </Text>
            <Text style={{ fontSize: 12, fontWeight: '100', color: '#ffffff', marginTop: 5, textAlign: 'center' }}>
              from
              <Text style={{ fontWeight: '700' }}> {12} </Text>
              to
              <Text style={{ fontWeight: '700' }}> {18} </Text>

            </Text>
            <RangeSlider
              min={1}
              max={16}
              minValue={this.state.minSpeed}
              maxValue={this.state.maxSpeed === 100 ? 15 : this.state.maxSpeed}
              thumbRadius={10}
              trackSize={2}
              onChange={curValue => this.setState({ minSpeed: Math.floor(curValue.min), maxSpeed: Math.floor(curValue.max) > 15 ? 16 : Math.floor(curValue.max) })} />
            <Text style={{ textAlign: 'center' }}>Move the sliders to fine tune the range</Text>

            <View style={{ marginTop: 32 }}>
              <View>
                <SegmentedControlIOS
                  backTint={'#ffffff'}
                  selectedTint={'#ffffff'}
                  selectedIndex={windSpeedUnitNr}
                  values={'mps'}
                  onValueChange={event => {
                  }} />
              </View>
            </View>
          </View>
        </View>*/


    /*return (
      <View style={{ flex: 1, backgroundColor: 'black' }} >
        <Text> Wind from Harbor </Text>
        <Button title="Go Back" onPress={this.props.pop} />
        <Button title="Finish" onPress={this._onFinish} />
        <RangeSlider
          min={1}
          max={16}
          minValue={this.state.windMin}
          maxValue={this.state.windMax}
          lowerTrackColor={'#3f3f3f'}
          upperTrackColor={'#3f3f3f'}
          thumbRadius={10}
          trackSize={2}
          style={{ width: 300 }}
          onChange={(curValue) => {
            this.setState({ windMax: Math.round(curValue.max), windMin: Math.round(curValue.min) })
          }} />
        <SelectorView
          ref={r => { this.selectorView = r }}
          style={{ width: 200, height: 200, backgroundColor: 'white' }}
          directions={this.state.directions}
          onChange={e => {
            let directions = e.nativeEvent
            delete directions.target
            this.setState({ directions })

          }} />
      </View>
    )*/
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveHarbor: bindActionCreators(saveHarbor, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(WindHarbor)
