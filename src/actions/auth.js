import firebase from 'firebase'

import { DISPLAY_ERROR } from '../constants/utils'
import { VERIFY_EXISTING_USER } from '../constants/auth'

export function doLogin(credential) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if (credential._type === 'password') {
        firebase.auth().signInWithEmailAndPassword(credential.email, credential.password).then(() => resolve())
          .catch(error => {
            dispatch({ type: DISPLAY_ERROR, title: 'Authentication error', code: error.code })
            reject()
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
      if (credential.type === 'password') {
        firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
          .then(user => {
            console.log(user.uid)
            setUserCredential(user.uid, credential)
            resolve()
          })
          .catch(error => {
            dispatch({ type: DISPLAY_ERROR, title: 'Authentication error', code: error.code })
            reject()
          })
      }
      else if (credential.type === 'facebook') {

        let _cFacebook = firebase.auth.FacebookAuthProvider.credential(credential.token)
        firebase.auth().signInWithCredential(_cFacebook)
          .then(user => {
            dispatch({ type: 'SAVE_FB_USER', credential, uid: user.uid })
            resolve()
          })
          .catch(err => {
            dispatch({ type: DISPLAY_ERROR, title: 'Authentication error', code: 'There was an error with facebook' })
            reject()
          })
      }
      else {
        //TODO 
      }
    })
  }
}

export function forgotPassword(email) {
  return new Promise((resolve, reject) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => resolve())
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

export function setUserCredential(uid, credential) {
  return new Promise((resolve, reject) => {
    delete credential.password
    delete credential.type
    delete credential.token
    console.log(uid, credential)
    firebase.database().ref('/user/' + uid).set(credential)
  })
}

export function getCurrentUser(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('user').child(uid).once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          resolve(snapshot.val())
        }
        else {
          reject()
        }
      })
      .catch(err => { console.log(err); reject() })
  })
}
