

import firebase from 'firebase'

import {DISPLAY_ERROR} from '../constants/utils'

export function doLogin(credential) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      if(credential._type === 'password') {
        firebase.auth().signInWithEmailAndPassword(credential.email, credential.password).catch(error => {
          dispatch({type:DISPLAY_ERROR,title:'Authentication error',code: error.code})
        })
      }
      else {


      }
    })
  }
}
