// @flow

'use strict'

import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ForgotView } from '../../../views/auth'
import { showError } from '../../../actions/utils'
class Forgot extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    return (
      <ForgotView
        showError={this.props.showError}
        onPressBack={this.props.pop} />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showError: bindActionCreators(showError, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Forgot)
