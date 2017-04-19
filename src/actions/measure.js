
import firebase from 'firebase'
import realm from '../store/realm'

import { NEW_SESSION } from '../constants/history'

// let SERVER_URL = 'http://52.30.86.52/apps/'
let SERVER_URL = 'https://apps-api.vaavud.com/'

/*
  ::: USED IN :::
  measure [module]
  userData [saga]
*/

export function justSaveSessionInFirebase(session, _key) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('session').child(_key).set(session)
    resolve()
  })
}


export function saveSession(session) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid
      let deviceKey = 'UNTRASONIC'

      let nodeRef = firebase.database().ref('session').push()

      session.uid = uid
      session.deviceKey = deviceKey

      delete session.windMin
      delete session.key

      let key = nodeRef.key

      console.log('my key', key)

      if (getState().app.online) {
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
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        realm.create('Summary', summary)
        resolve(summary.key)
      })
    })
  }
}

function savePointsLocal(points, key) {
  realm.write(() => {
    realm.create('SessionPoints', { key, points })
  })
}

export function savePoints(points, key) {
  return (dispatch, getState) => {
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

    fetch(`${SERVER_URL}addMeasurements`, {
      method: 'POST',
      body: JSON.stringify([obj])
    })
      .then(response => response.json())
      .then(responseData => {

        if ('inserted' in responseData) {
          resolve()
        }
        else if ('msg' in responseData && responseData.msg === 'Payload accepted, will take a few minutes to process') { //TODO change flags
          resolve()
        }
        else {
          reject()
        }
      })
      .catch(err => {
        console.log('error server', err)
        reject()
      })
  })
}
