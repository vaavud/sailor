// @flow

'use strict'

import React, { Component } from 'react'
import  {
  View
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Map extends Component {

  constructor(props){
    super(props)

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }


  render () {
    return(<View/>)
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps,mapDispatchToProps)(Map)
