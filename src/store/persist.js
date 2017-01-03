'use strict'

// import firebase from 'firebase'
//const urlFb = __DEV__ ? 'https://vaavud-core-demo.firebaseio.com' : 'https://vaavud-app.firebaseio.com'
// Hardcode production db for now

export function createPersist() {

  var config = {
    apiKey: 'AIzaSyAKk4W4m8kaleyuruapQkdfMr3s3ftGhqU',
    authDomain: 'vaavud-app.firebaseapp.com',
    databaseURL: 'https://vaavud-app.firebaseio.com'
  }

  // firebase.initializeApp(config)
  // const fireRef = firebase.database()
  // const authenticationRef = firebase.auth()
  return config
}
