// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  TextInput
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from '../../../reactcommon/components/button'

import { doLogin } from '../../../actions/auth'
import { showError } from '../../../actions/utils'


class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: 'asdas@aaa.asd',
      password: 'asdasaaa'
    }
    this._doLogin = this._doLogin.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _doLogin() {
    if (this.state.email !== '' && this.state.password !== '') {
      let credential = {
        email: this.state.email,
        password: this.state.password,
        _type: 'password'
      }
      this.props.doLogin(credential)
    }
    else {
      this.props.showError({ title: 'Error', msg: 'Compleate the fields' })
    }
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink', paddingTop: 50 }}>

        <TextInput
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(email) => {
            this.setState({ email })
          } } />

        <TextInput
          style={{ width: 300, height: 50, backgroundColor: 'gray' }}
          onChangeText={(password) => {
            this.setState({ password })
          } } />

        <Button title="Login" onPress={this._doLogin} />
        <Button title="SignUp" onPress={this.props.SignUp} />


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
    doLogin: bindActionCreators(doLogin, dispatch),
    showError: bindActionCreators(showError, dispatch),
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Login)
