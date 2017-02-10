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

    console.log('props', props.componentProps)


    this.state = {
      windMin: 1,
      windMax: 16,
      windSpeedUnit: 'mps',
      loading: false,
      currentMinSpeed: props.harbor.windMin,
      currentMaxSpeed: props.harbor.windMax,
      latlon: { lat: props.componentProps.location.latitude, lon: props.componentProps.location.longitude },
      name: props.componentProps.locationName,
      id: props.componentProps.id
    }

    this._onFinish = this._onFinish.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _onFinish() {
    let profile = {
      minSpeed: this.state.currentMinSpeed,
      maxSpeed: this.state.currentMaxSpeed
    }

    let harbor = {
      location: this.state.latlon,
      name: this.state.name,
      directions: { N: true, E: true, W: true, S: true, NE: true, NW: true, SW: true, SE: true }
    }

    this.props.saveHarbor(harbor, profile, this.state.id).then(() => this.props.pop(true))
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>

        <Text style={{ marginTop: 80 }}>Ready to roll!</Text>


        <View style={{ position: 'absolute', alignItems: 'center', height: 300, width, top: (width / 2) }} >

          <Text style={{}}>Your suggested wind range is </Text>
          <Text style={{ marginTop: 10, marginBottom: 50 }}>
            from
              <Text > {this.state.currentMinSpeed} </Text>
            to
              <Text > {this.state.currentMaxSpeed} </Text>
          </Text>

          <MultiSlider
            style={{ width }}
            values={[this.state.currentMinSpeed, this.state.currentMaxSpeed]}
            min={this.state.windMin}
            max={this.state.windMax}
            onValuesChange={() => { }}
            onValuesChangeFinish={values => {
              this.setState({ currentMinSpeed: values[0], currentMaxSpeed: values[1] })
            }}
          />

          <Text style={{ marginTop: 5 }}>Move the sliders to fine tune the range</Text>

          <SegmentedControlIOS
            style={{ width: width - 60, marginTop: 30 }}
            backTint={'#fff'}
            selectedTint={'#fff'}
            selectedIndex={0}
            values={['mps', 'kph', 'knot', 'mph']}
            onValueChange={event => { }} />
        </View>


        <View style={{ width: width - 80, height: 45, flexDirection: 'row', position: 'absolute', bottom: 50, left: 40 }} >
          <Button
            buttonStyle={{ flex: 0.3, backgroundColor: 'pink', margin: 5 }}
            textStyle={{ textAlign: 'center', marginTop: 8 }}
            title="Back" onPress={() => { this.props.pop() }} />
          <Button
            textStyle={{ textAlign: 'center', marginTop: 8 }}
            buttonStyle={{ flex: 0.7, backgroundColor: 'pink', margin: 5 }} title="Finish"
            onPress={this._onFinish} />
        </View>
      </View>
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    harbor: reduxStore.harbor,
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveHarbor: bindActionCreators(saveHarbor, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(WindHarbor)
