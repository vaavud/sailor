// @flow

'use strict'

import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import moment from 'moment'
import ReactNativeI18n from 'react-native-i18n'

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk'

import { LoginView } from '../../../views/auth'

import { doLogin, doSignUp } from '../../../actions/auth'
import { showError } from '../../../actions/utils'


class Login extends Component {

  constructor(props) {
    super(props)
    this._doLogin = this._doLogin.bind(this)
    this._doLoginWithFacebook = this._doLoginWithFacebook.bind(this)
    this.responseCallback = this.responseCallback.bind(this)
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

  _doLoginWithFacebook() {
    LoginManager.logInWithReadPermissions(['email', 'public_profile']).then(result => {
      if (result.isCancelled) {
        // TODO handle fb login cancelled
      } else {
        const profileRequest = new GraphRequest(
          '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
          null,
          this.responseCallback,
        )
        new GraphRequestManager().addRequest(profileRequest).start()
      }
    }).catch(err => {
      // TODO error handling
      console.log('login with facebook', err)
    })
  }

  responseCallback(error, result) {

    if (error) {
      this.props.showError({ title: 'Facebook error', msg: 'Problems with facebook server' })
    }
    else {
      AccessToken.getCurrentAccessToken().then(user => {
        if (user) {
          if ('email' in result) {

            let credential = {
              firstName: result.first_name,
              lastName: result.last_name,
              email: result.email,
              activity: 'sailing',
              country: 'dk',
              created: moment().valueOf(),
              language: ReactNativeI18n.locale,
              type: 'facebook',
              token: user.accessToken
            }

            this.props.doSignUp(credential)
          }
          else {
            this.props.showError({
              title: 'Facebook error',
              msg: 'Please allow email in facebook'
            })
          }
        }
        else {
          this.props.showError({
            title: 'Facebook error',
            msg: 'Problems with facebook server'
          })
        }
      }).catch(error => {
        console.log(error)
        this.props.showError({
          title: 'Facebook error',
          msg: 'Problems with facebook server'
        })
        //TODO error handling
      })
    }
  }

  render() {
    return (
      <LoginView
        onPressLogin={this._doLogin}
        onPressSignup={this.props.SignUp}
        onPressFBLogin={this._doLoginWithFacebook}
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
    doSignUp: bindActionCreators(doSignUp, dispatch),
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Login)
