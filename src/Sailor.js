'use strict'

import React, { Component } from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {connect} from 'react-redux'

import Welcome from './modules/auth/welcome'
import Spinner from 'react-native-loading-spinner-overlay'

class SailorMain extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Welcome />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}


export default connect(mapReduxStoreToProps)(SailorMain)
