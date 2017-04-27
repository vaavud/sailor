// @flow

'use strict'

import React, {
  Component
} from 'react'

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

import I18n from '../../../components/i18n'

import { LoginView } from '../../../views/auth'

import {
  doLogin,
  doSignUp
} from '../../../actions/auth'

import { showError } from '../../../actions/utils'


class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  componentDidMount = () => {

  }

  componentWillUnmount = () => {

  }

  _doLogin = (email, password) => {
    if (email !== '' && password !== '') {
      const credential = {
        email: email,
        password: password,
        _type: 'password'
      }
      this.setState({ isLoading: true })
      this.props.doLogin(credential).catch(() => this.setState({ isLoading: false }))

    }
    else {
      this.props.showError({
        title: I18n.t('errorTitle'),
        msg: I18n.t('wrongCred')
      })
    }
  }

  _doLoginWithFacebook = () => {
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

  responseCallback = (error, result) => {
    this.setState({isLoading: true})
    if (error) {
      this.setState({isLoading: true})      
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

            this.props.doSignUp(credential).catch(() => this.setState({isLoading: false}))
          }
          else {
            this.setState({isLoading: false})
            this.props.showError({
              title: 'Facebook error',
              msg: 'Please allow email in facebook'
            })
          }
        }
        else {
          this.setState({isLoading: false})
          this.props.showError({
            title: 'Facebook error',
            msg: 'Problems with facebook server'
          })
        }
      }).catch(error => {
        this.setState({isLoading: false})
        console.log(error)
        this.props.showError({
          title: 'Facebook error',
          msg: 'Problems with facebook server'
        })
        //TODO error handling
      })
    }
  }

  render = () => {
    const { navigate } = this.props.navigation
    return (
      <LoginView
        navigate={navigate}
        onPressLogin={this._doLogin}
        onPressSignup={this.props.SignUp}
        onPressFBLogin={this._doLoginWithFacebook}
        onPressForgotPassword={this.props.forgotPassword}
        isLoading={this.state.isLoading} />
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
