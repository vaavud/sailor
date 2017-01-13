import firebase from 'firebase'

import { DISPLAY_ERROR } from '../constants/utils'
import { VERIFY_EXISTING_USER } from '../constants/auth'

export function doLogin(credential) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (credential._type === 'password') {
        firebase.auth().signInWithEmailAndPassword(credential.email, credential.password).catch(error => {
          dispatch({ type: DISPLAY_ERROR, title: 'Authentication error', code: error.code })
        })
      }
      else {
      }
    })
  }
}


export function doSignUp(credential) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
        .then((user) => {
          console.log(user.uid)
          setUserCredential(user.uid, credential)
          // dispatch({ type: VERIFY_EXISTING_USER, credential, uid: user.uid })
        })
        .catch(error => {
          dispatch({ type: DISPLAY_ERROR, title: 'Authentication error', code: error.code })
        })
    })
  }
}

export function setUserCredential(uid, credential) {
  return new Promise((resolve, reject) => {
    delete credential.password
    console.log(uid, credential)
    firebase.database().ref('/user/' + uid).set(credential)
  })
}

export function getCurrentUser(uid) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('user').child(uid).once('value').then(snapshot => {

      })
    })
  }
}
