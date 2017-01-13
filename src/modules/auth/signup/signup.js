// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  TextInput
} from 'react-native'


import ReactNativeI18n from 'react-native-i18n'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { showError } from '../../../actions/utils'
import { doSignUp } from '../../../actions/auth'


import Button from '../../../reactcommon/components/button'

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
        password: this.state.password
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
