'use strict'

import { Alert } from 'react-native'

import {takeEvery} from 'redux-saga/effects'
import {DISPLAY_ERROR} from '../constants/utils'


function errorMessageHandler(errorCode){
  switch (errorCode.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address'
    case 'auth/wrong-password':
      return 'Email or password is incorrect'
    case 'auth/user-not-found':
      return 'Email or password is incorrect'
    case 'auth/network-request-failed':
      return 'You cannot login right now because you have no internet connection'
    case 'auth/email-already-in-use':
      return 'This email is already in use'
    case 'auth/weak-password':
      return 'The password is to weak. Password must be at least 6 characters long'
    default:
      return errorCode.msg
      // return 'Something went wrong, please try again. If the problem persists, contact us at hello@vaavud.com'
  }
}

function* errorHandler(action) {
  Alert.alert(action.title,errorMessageHandler(action),[{text: 'OK'}])
}

export function* error() {
  yield takeEvery(DISPLAY_ERROR,errorHandler)
}
