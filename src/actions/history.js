
import firebase from 'firebase'
// import Realm from 'realm'
import realm from '../store/realm'
import { NO_HISTORY, HISTORY_LOADED, SESSION_DELETED } from '../constants/history'


const saveSessionInCache = () => {
  //TODO

  // let _history = realm.objects('SessionCache')
  // for (let i in _history) { //Get and save points
  //   let session = _history[i]

  //   firebase.database()
  //     .ref('session')
  //     .child(session.key)
  //     .set(session)
  // }

  // realm.write(() => {
  //   let _history = realm.objects('SessionCache')
  //   realm.delete(_history)
  // })
}





const getSessions = () => {
  return new Promise((resolve, reject) => {

    let uid = firebase.auth().currentUser.uid

    saveSessionInCache()

    firebase.database()
      .ref('session')
      .orderByChild('uid')
      .equalTo(uid)
      .once('value', snapshot => {
        if (snapshot.numChildren() > 0) {

          let historyList = []

          realm.write(() => {
            let _history = realm.objects('Session')
            realm.delete(_history)

            snapshot.forEach(snap => {
              var obj = snap.val()
              if (snap.val().deviceKey === 'UNTRASONIC') {
                obj.key = snap.key
                historyList.push(obj)
                obj.sent = true
                realm.create('Session', obj)
              }
            })
          })
          resolve({ type: HISTORY_LOADED, list: historyList })
        }
        else {
          resolve({ type: NO_HISTORY })
        }
      }).catch(error => {
        console.log(error)
        resolve({ type: NO_HISTORY })
      })
  })
}

const deleteSession = sessionKey => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref('session').child(sessionKey).remove()
      dispatch({ type: SESSION_DELETED, sessionKey })
    })
  }
}


export { getSessions, deleteSession }