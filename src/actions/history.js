
import firebase from 'firebase'

export function getSessions() {
  return new Promise(function (resolve, reject) {

    let uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref('session')
      .orderByChild('uid')
      .equalTo(uid)
      .once('value', snapshot => {
        if (snapshot.numChildren() > 0) {
          console.log(snapshot.val())
        }
        else {
          console.log('nothing to show')
        }
      }).catch(error => {
        console.log(error)
      })
  })
}