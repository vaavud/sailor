// @flow

'use strict'

import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { resetPassword } from '../../../actions/auth'

import { ForgotView } from '../../../views/auth'

class Forgot extends Component {

  constructor(props){
    super(props)
    this._sendResetMail = this._sendResetMail.bind(this)
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  _sendResetMail(email){
    this.props.resetPassword(email)
  }


  render () {
    return (
      <ForgotView
        onPressBack={this.props.pop}
        onPressSendResetLink={this._sendResetMail}/>
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: bindActionCreators(resetPassword, dispatch)
  }
}

export default connect(mapReduxStoreToProps,mapDispatchToProps)(Forgot)
