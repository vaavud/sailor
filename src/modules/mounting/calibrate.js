import React, {
  Component
} from 'react'

import {
  CalibrateView,
} from '../../views/mounting/'

import { DeviceEventEmitter } from 'react-native'
import ReactNativeHeading from 'react-native-heading'


export default class extends Component {

  state = {
    heading: 0
  }

  componentDidMount = () => {
    ReactNativeHeading.start(1).then(didStart => {
      console.log('started', didStart)
      this.setState({ headingIsSupported: didStart })
    })
      .catch(err => console.log(err))

    DeviceEventEmitter.addListener('headingUpdated', this.headingUpdated)
  }

  componentWillUnmount = () => {

  }

  stop = () => {
    ReactNativeHeading.stop()
    DeviceEventEmitter.removeAllListeners('headingUpdated')
  }

  headingUpdated = data => {
    this.setState({ heading: data.heading })
    console.log('New heading is:', data.heading)
  }


  onNext = () => {
    ReactNativeHeading.stop()
    DeviceEventEmitter.removeAllListeners('headingUpdated')

    const { navigate } = this.props.navigation
    const { params } = this.props.navigation.state

    navigate('Result', { headingFromBle: params.headingFromBle, headingFromPhone: this.state.heading })
  }

  render = () => {
    return <CalibrateView onNext={this.onNext} heading={this.state.heading} />
  }
}
