'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Welcome from './modules/auth/welcome'
import Main from './modules/main'
import Measurement from './modules/measure'
import Intro from './modules/intro'
import Loading from './modules/loading'
import MountingFlow from './modules/mounting'

//constants
import { NEEDS_AUTH, HOME_READY, SETUP, LOADING, CALIBRATE, MEASUREMENT } from './constants/auth'


const mapReduxStoreToProps = (reduxStore) => {
  return {
    app: reduxStore.app
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}

@connect(mapReduxStoreToProps, mapDispatchToProps)
export default class extends Component {
  render() {

    // return <MountingFlow />

    switch (this.props.app.state) {
      case NEEDS_AUTH:
        return (<Welcome />)
      case HOME_READY:
        return (<Main />)
      case CALIBRATE:
        return <MountingFlow />
      case SETUP:
        return (<MountingFlow />)
      case MEASUREMENT:
        return (<Measurement />)
      case LOADING:
        return (<Loading />)
      default:
        return (<Welcome />)
    }
  }
}
