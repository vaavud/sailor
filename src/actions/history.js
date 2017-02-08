
import firebase from 'firebase'
// import Realm from 'realm'
import realm from '../store/realm'
import { NO_HISTORY, HISTORY_LOADED } from '../constants/history'

export function getSessions() {
  return new Promise(function (resolve, reject) {

    let uid = firebase.auth().currentUser.uid
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