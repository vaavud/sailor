// @flow

'use strict'

import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {LoginView} from '../../../views/auth'

import { doLogin } from '../../../actions/auth'
import { showError } from '../../../actions/utils'


class Login extends Component {

  constructor(props) {
    super(props)
    this._doLogin = this._doLogin.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _doLogin(email, password) {
    if (email !== '' && password !== '') {
      const credential = {
        email: email,
        password: password,
        _type: 'password'
      }
      this.props.doLogin(credential)
    }
    else {
      this.props.showError({ 
        title: 'Something went wrong',
        msg: 'Make sure you are using the right credentials'
      })
    }
  }

  render(){
    return (
      <LoginView
      onPressLogin={this._doLogin}
      onPressSignup={this.props.SignUp}
      onPressForgotPassword={this.props.forgotPassword} />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: bindActionCreators(doLogin, dispatch),
    showError: bindActionCreators(showError, dispatch),
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Login)
