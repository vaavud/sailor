'use strict'

import React, { Component } from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {connect} from 'react-redux'

import Welcome from './modules/auth/welcome'
import Main from './modules/main'
import Spinner from 'react-native-loading-spinner-overlay'

//constants
import {NEEDS_AUTH,IS_AUTH,SETUP,LOADING} from './constants/auth'


class SailorMain extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    switch (this.props.app.state) {
      case NEEDS_AUTH:
        return(<Welcome />)
      case IS_AUTH:
        return(<Main />)
      case SETUP:
        return(<View style={{backgroundColor:'gray',flex:1}} />)
      case LOADING:
        return(<View style={{backgroundColor:'purple',flex:1}} />)
      default:
        return(<Welcome />)
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


export default connect(mapReduxStoreToProps,mapDispatchToProps)(SailorMain)
