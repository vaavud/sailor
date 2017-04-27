// @flow

'use strict'

import React, {
  Component
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import I18n from '../../../components/i18n'

import { SignupView } from '../../../views/auth'

import { showError } from '../../../actions/utils'
import { doSignUp } from '../../../actions/auth'

class SignUp extends Component {

  constructor(props) {
    super(props)
    this._doSignUp = this._doSignUp.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _doSignUp(firstName, lastName, email, password, confirmPW) {
    if (firstName === '' || lastName === '' || email === '' || password === '' || confirmPW === '') {
      this.props.showError({
        title: I18n.t('errorTitle'),
        msg: I18n.t('completeFields')
      })
    }
    else if (password.length < 6) {
      this.props.showError({
        title: I18n.t('errorTitle'),
        msg: I18n.t('shortPasword')
      })
    } else if (password !== confirmPW) {
      this.props.showError({
        title: I18n.t('errorTitle'),
        msg: I18n.t('matchPassword')
      })
    }
    // TODO validate email client side ?
    else {
      let credential = {
        created: Date.now(),
        activity: 'sailing',
        country: 'dk',
        language: I18n.locale,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        type: 'password'
      }
      this.props.doSignUp(credential)
    }
  }

  render() {
    const { goBack } = this.props.navigation

    return (
      <SignupView
        onPressBack={() => goBack()}
        onPressSignup={this._doSignUp}
      />
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
