
import firebase from 'firebase'
import realm from '../store/realm'

let SERVER_URL = 'http://52.30.86.52/apps/'

/*
  ::: USED IN :::
  measure [module]
  userData [saga]
*/

export function saveSession(session) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid
      let deviceKey = 'UNTRASONIC'
      let nodeRef = firebase.database().ref('session').push()

      session.uid = uid
      session.deviceKey = deviceKey

      nodeRef.set(session)
      let key = nodeRef.key

      realm.write(() => {
        console.log('saving session', { key, ...session })
        realm.create('Session', { key, ...session })
      })
      console.log('my key', key)
      console.log('session', session)

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
    realm.create('SessionPoints', { key, ...points })
  })
}

export function savePoints(points, key) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      if (getState().app.online) {
        sendPoints(key, points).then(() => {
          resolve({ key })
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
