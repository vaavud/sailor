
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
        console.log('summary', summary)
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



// export function initSession() {
//   return function (dispatch, getState) {
//     return new Promise((resolve, reject) => {

//       let uid = firebase.auth().currentUser.uid
//       let deviceKey = 'UNTRASONIC'
//       let nodeRef = firebase.database().ref('session').push()
//       key = nodeRef.key

//       let session = {
//         uid,
//         deviceKey,
//         timeStart: Date.now(),
//         windMeter: 'sleipnir',
//         key
//       }

//       realm.write(() => {
//         realm.create('Session', session)
//         realm.create('SessionPoints', { key })
//       })


//       console.log('my key', key)

//       resolve()
//     })
//   }
// }

// export function endSession(points) {
//   return function (dispatch, getState) {
//     return new Promise((resolve, reject) => {

//       let currentSession = realm.objects('Session').filtered(`key = "${key}"`)
//       realm.write(() => {
//         currentSession[0].timeEnd = Date.now()
//         currentSession[0].windMax = 12 //TODO get real value
//         currentSession[0].windMean = 12 //TODO get real value
//         currentSession[0].windDirection = 12 //TODO get real value
//       })

//       if (getState().app.online) {
//         sendPoints(key, points)
//           .then(() => saveSessionFb(key, currentSession[0]))
//           .then(() => {
//             realm.write(() => {
//               currentSession[0].sent = true
//             })
//             console.log('saved correcty in', key)
//             resolve({ success: true, key })

//           })
//           .catch(err => { // Some error with the server, save it and try later.

//             console.log('error save it for later')

//             let currentSessionPoints = realm.objects('SessionPoints').filtered(`key = "${key}"`)
//             realm.write(() => {
//               currentSessionPoints[0].points = points
//             })

//             resolve(false)
//           })
//       }
//       else { //Saved local

//         console.log('no internet, save in memory')

//         let currentSessionPoints = realm.objects('SessionPoints').filtered(`key = "${key}"`)
//         realm.write(() => {
//           currentSessionPoints[0].points = points
//         })

//         resolve(false)
//       }
//     })
//   }
// }


// export function saveSessionFb(_key, session) {
//   return new Promise((resolve, reject) => {

//     let _session = {
//       uid: session.uid,
//       deviceKey: session.deviceKey,
//       timeStart: session.timeStart,
//       windMeter: session.windMeter,
//       timeEnd: session.timeEnd,
//       windMax: session.windMax,
//       windMean: session.windMean,
//       windDirection: session.windDirection,
//     }

//     console.log('trying to save... ', _session)

//     firebase.database().ref('session').child(_key).set(_session, err => {
//       if (err) {
//         console.log('error from firebase', err)
//         reject()
//       }
//       else {
//         resolve()
//       }
//     })
//   })
// }


export function sendPoints(_key, points) {
  return new Promise((resolve, reject) => {
    let obj = {}
    obj[_key] = points

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
