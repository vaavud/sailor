// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native'

import { SegmentedControls } from 'react-native-radio-buttons'

import Button from '../../../reactcommon/components/button'

import Colors from '../../../../assets/colorTheme'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const {width, height} = Dimensions.get('window')

import MultiSlider from '@ptomasroos/react-native-multi-slider'
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
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginTop: 80 }}>Ready to roll!</Text>

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
        </View>
        <View style={style.segmentedContainer} >
          <SegmentedControls style={style.segmentedControl}
            tint={Colors.segmSelectedTint}
            selectedTint={Colors.segmentedTint}
            backTint={Colors.segmentedTint}
            options={['mps', 'kph', 'knot', 'mph']}
            allowFontScaling={false} // default: true
            onSelection={(e, i) => console.log('TODO ')}
            selectedOption={'mps'}
            optionStyles={{ fontFamily: 'Roboto-Medium' }}
            optionContainerStyle={style.segmentedControl}
            containerBorderWidth={3}
            containerStyle={{ borderRadius: 2 }}
          />
        </View>


        <View style={{ width: width - 80, height: 90, position: 'absolute', bottom: 40, left: 40 }} >
          <Button
            textStyle={{ textAlign: 'center', color: 'white', marginTop: 8, fontSize: 16 }}
            buttonStyle={{ flex: 1, backgroundColor: Colors.vaavudBlue, margin: 5 }} title="Finish"
            onPress={this._onFinish} />
          <Button
            buttonStyle={{ flex: 1, margin: 5 }}
            textStyle={{ textAlign: 'center', backgroundColor: 'transparent', marginTop: 8, fontSize: 16, }}
            title="Back" onPress={() => { this.props.pop() }} />
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

const style = StyleSheet.create({
  segmentedContainer: {
    paddingHorizontal: 15,
    paddingTop: 15
  },
  segmentedControl: {
    justifyContent: 'center',
    height: 40,
  },
})

export default connect(mapReduxStoreToProps, mapDispatchToProps)(WindHarbor)
