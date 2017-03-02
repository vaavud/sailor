
import firebase from 'firebase'
import realm from '../store/realm'

import { NEW_SESSION } from '../constants/history'

// let SERVER_URL = 'http://52.30.86.52/apps/'
let SERVER_URL = 'https://dev.vaavud.com/apps/'


/*
  ::: USED IN :::
  measure [module]
  userData [saga]
*/

export function saveSession(session, _key) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid
      let deviceKey = 'UNTRASONIC'

      let nodeRef
      if (_key) {
        nodeRef = firebase.database().ref('session').child(_key)
      }
      else {
        nodeRef = firebase.database().ref('session').push()
      }


      session.uid = uid
      session.deviceKey = deviceKey

      delete session.windMin
      delete session.key

      let key = _key === undefined ? nodeRef.key : _key

      console.log('my key', key)

      if (getState().app.online) {  // TODO 

        nodeRef.set(session)
        realm.write(() => {
          console.log('saving session', { key, ...session, sent: true })
          realm.create('Session', { key, ...session, sent: true })
        })
      }
      else {
        realm.write(() => {
          console.log('saving session', { key, ...session })
          realm.create('Session', { key, ...session })
        })
      }
      session.key = key
      dispatch({ type: NEW_SESSION, session })
      resolve(key)
    })
  }
}

export function saveSummary(summary) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        console.log('summary saving', summary)
        realm.create('Summary', summary)
        resolve(summary.key)
      })
    })
  }
}

function savePointsLocal(points, key) {
  realm.write(() => {
    console.log('saving points...', { key, points })
    realm.create('SessionPoints', { key, points })
  })
}

export function savePoints(points, key) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      if (getState().app.online) {
        sendPoints(key, points).then(() => {
          resolve(key)
        })
          .catch(err => { //Saved local
            savePointsLocal(points, key)
            resolve(key)
          })
      }
      else { //Saved local
        savePointsLocal(points, key)
        resolve(key)
      }
    })
  }
}


export function sendPoints(_key, points) {
  return new Promise((resolve, reject) => {
    let obj = {}
    obj[_key] = points

    console.log('summary', JSON.stringify(obj))

    fetch(SERVER_URL + 'addMeasurements', {
      method: 'POST',
      body: JSON.stringify([obj])
    })
      .then(response => response.json())
      .then(responseData => {

        console.log('responseData', responseData)

        if ('inserted' in responseData) {
          resolve()
        }
        else {
          reject()
        }
      })
      .catch(err => {
        console.log(err)
        reject()
      })
  })
}
