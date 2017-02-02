// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  requireNativeComponent
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RangeSlider from '../../../components/rangeSlider'

import { saveHarbor } from '../../../actions/harbor'

let SelectorView = requireNativeComponent('SelectorViewSwift', WindHarbor)


class WindHarbor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marker: props.componentProps.marker,
      name: props.componentProps.name,
      windMax: 10,
      windMin: 3,
      ...props.componentProps.harbor
    }

    this._onFinish = this._onFinish.bind(this)
    console.log('this.props', this.state)

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
    return (
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
          } } />
        <SelectorView
          ref={r => { this.selectorView = r } }
          style={{ width: 200, height: 200, backgroundColor: 'white' }}
          directions={this.state.directions}
          onChange={e => {
            let directions = e.nativeEvent
            delete directions.target
            this.setState({ directions })

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
