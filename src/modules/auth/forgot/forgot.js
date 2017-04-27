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
    this._sendResetMail = this._sendResetMail.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _sendResetMail(email) {
    this.props.resetPassword(email)
  }


  render() {
    const { goBack } = this.props.navigation
    return (
      <ForgotView
        onPressBack={() => goBack()}
        onPressSendResetLink={this._sendResetMail}
        showError={this.props.showError} />
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
