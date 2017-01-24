// @flow

'use strict'

import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ForgotView } from '../../../views/auth'

class Forgot extends Component {

  constructor(props){
    super(props)

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }


  render () {
    return (
     <ForgotView
     onPressBack={this.props.pop}/>
    )
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

export default connect(mapReduxStoreToProps,mapDispatchToProps)(Forgot)
