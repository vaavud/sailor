// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RangeSlider from '../../../components/rangeSlider'

import { saveHarbor } from '../../../actions/harbor'


class WindHarbor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      location: props.componentProps.location,
      name: props.componentProps.harborName
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }} >
        <Text> Wind from Harbor </Text>
        <Button title="Go Back" onPress={() => {
          this.props.pop()
        } } />
        <Button title="Finish" onPress={() => {

          let profile = {
            minSpeed: this.state.windMin,
            maxSpeed: this.state.windMax
          }

          let harbor = {
            location: this.state.location,
            name: this.state.name,
            directions: { N: true, S: true, E: true, W: true }
          }

          this.props.saveHarbor(harbor, profile)

        } } />
        <RangeSlider
          min={1}
          max={16}
          minValue={1}
          maxValue={16}
          lowerTrackColor={'#3f3f3f'}
          upperTrackColor={'#3f3f3f'}
          thumbRadius={10}
          trackSize={2}
          style={{ width: 300 }}
          onChange={curValue => {
            this.setState({ windMax: Math.round(curValue.max), windMin: Math.round(curValue.min) })
          } } />
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
    saveHarbor: bindActionCreators(saveHarbor, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(WindHarbor)
