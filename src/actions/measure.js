
import firebase from 'firebase'
import realm from '../store/realm'
import { AsyncStorage } from 'react-native'

import { NEW_SESSION } from '../constants/history'
import { MEASUREMENT, SKIP_CALIBRATION } from '../constants/auth'

// let SERVER_URL = 'http://52.30.86.52/apps/'
let SERVER_URL = 'https://apps-api.vaavud.com/'

/*
  ::: USED IN :::
  measure [module]
  userData [saga]
*/

const offlineOffset = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('offset').then(d => {
      let data = JSON.parse(d)
      resolve({ type: 'UPDATE_OFFSET', data })
    })
  })
}

const fetchOffset = () => {
  return new Promise((resolve, reject) => {
    fetch(`${SERVER_URL}sailing/compass-offset`)
      .then(response => response.json())
      .then(responseData => {
        AsyncStorage.setItem('offset', JSON.stringify(responseData))
        resolve({ type: 'UPDATE_OFFSET', data: responseData })
      })
  })
}


const justSaveSessionInFirebase = (session, _key) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('session').child(_key).set(session)
    resolve()
  })
}

const goToMeasurement = () => {
  return (dispatch, getState) => {
    dispatch({ type: MEASUREMENT })
  }
}

const goToMain = () => {
  return (dispatch, getState) => {
    dispatch({ type: SKIP_CALIBRATION })
  }
}


const saveSession = session => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid
      let deviceKey = 'Ultrasonic'

      let nodeRef = firebase.database().ref('session').push()

      session.uid = uid
      session.deviceKey = deviceKey
      session.windMeter = 'sleipnir'

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

const saveSummary = summary => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      realm.write(() => {
        realm.create('Summary', summary)
        resolve(summary.key)
      })
    })
  }
}

const savePointsLocal = (points, key) => {
  realm.write(() => {
    realm.create('SessionPoints', { key, points })
  })
}

const savePoints = (points, key) => {
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


const sendPoints = (_key, points) => {
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

export { goToMeasurement, sendPoints, savePoints, saveSummary, saveSession, justSaveSessionInFirebase, goToMain, fetchOffset, offlineOffset }
