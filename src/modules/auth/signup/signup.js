// @flow

'use strict'

import React, { Component } from 'react'

import ReactNativeI18n from 'react-native-i18n'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {SignupView} from '../../../views/auth'

import { showError } from '../../../actions/utils'
import { doSignUp } from '../../../actions/auth'

class SignUp extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      lastName: '',
      firstName: '',
    }
    this._doSignUp = this._doSignUp.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _doSignUp() {

    if (this.state.email === '' || this.state.password === '' || this.state.firstName === '' || this.state.lastName === '') {
      this.props.showError({ title: 'Error', msg: 'Compleate the fields' })
    }
    else if (this.state.password.length < 6) {
      this.props.showError({ title: 'Error', msg: 'Password most be more than 6 characteres' })
    }
    else {
      let credential = {
        created: Date.now(),
        activity: 'sailing',
        country: 'dk',
        language: ReactNativeI18n.locale,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        password: this.state.password,
        type: 'email'
      }
      this.props.doSignUp(credential)
    }
  }

  render(){
    return (
      <SignupView
      onPressBack={this.props.pop}
      onPressSignup={this._doSignUp} />
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    doSignUp: bindActionCreators(doSignUp, dispatch),
    showError: bindActionCreators(showError, dispatch),
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(SignUp)
