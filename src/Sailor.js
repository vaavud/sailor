'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Welcome from './modules/auth/welcome'
import Main from './modules/main'
import Intro from './modules/intro'
import Loading from './modules/loading'
import MountingFlow from './modules/mounting'


//constants
import { NEEDS_AUTH, HOME_READY, SETUP, LOADING, CALIBRATE } from './constants/auth'


class SailorMain extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    switch (this.props.app.state) {
      case NEEDS_AUTH:
        return (<Welcome />)
      case HOME_READY:
        return (<Main />)
      case CALIBRATE:
        return <MountingFlow />
      case SETUP:
        return (<Intro />)
      case LOADING:
        return (<Loading />)
      default:
        return (<Welcome />)
    }
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    app: reduxStore.app
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
  }
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(SailorMain)
