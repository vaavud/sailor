'use strict'

import firebase from 'firebase'


export function createPersist() {

  var config = {
    apiKey: 'AIzaSyAKk4W4m8kaleyuruapQkdfMr3s3ftGhqU',
    authDomain: 'vaavud-app.firebaseapp.com',
    databaseURL: 'https://vaavud-app.firebaseio.com'
  }

  firebase.initializeApp(config)
  console.log("init firebase")
}
