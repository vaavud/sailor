// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  TextInput
} from 'react-native'


import moment from 'moment'
import ReactNativeI18n from 'react-native-i18n'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showError } from '../../../actions/utils'
import { doSignUp } from '../../../actions/auth'


import Button from '../../../reactcommon/components/button'

// import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

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
    this.responseCallback = this.responseCallback.bind(this)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  responseCallback(error, result) {

    if (error) {
      this.props.showError({ title: 'Facebook error', msg: 'Problems with facebook server' })
    }
    else {
      AccessToken.getCurrentAccessToken()
        .then(user => {
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
              this.props.showError({ title: 'Facebook error', msg: 'Please allow email in facebook' })
            }
          }
          else {
            this.props.showError({ title: 'Facebook error', msg: 'Problems with facebook server' })
          }
        })
        .catch(err => this.props.showError({ title: 'Facebook error', msg: 'Problems with facebook server' }))
    }
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink', paddingTop: 50 }}>

        <TextInput
          placeholder="Email"
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(email) => {
            this.setState({ email })
          } } />

        <TextInput
          placeholder="Name"
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(firstName) => {
            this.setState({ firstName })
          } } />
        <TextInput
          placeholder="Last name"
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(lastName) => {
            this.setState({ lastName })
          } } />
        <TextInput
          placeholder="Password"
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(password) => {
            this.setState({ password })
          } } />


        <Button
          title="Continue with Facebook"
          onPress={() => {
            LoginManager.logInWithReadPermissions(['email', 'public_profile']).then(result => {
              if (result.isCancelled) {
                alert('Login cancelled')
              }
              else {

                const profileRequest = new GraphRequest('/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
                  null,
                  this.responseCallback,
                )

                new GraphRequestManager().addRequest(profileRequest).start()
              }
            })
              .catch(err => alert('Login fail with error: ' + err))
          } }
          style={{ ...this.props.style, backgroundColor: '#3b5998' }} />

        <Button title="SignUp" onPress={this._doSignUp} />
        <Button title="Go back" onPress={this.props.pop} />

      </View>
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
