import firebase from 'firebase'

import realm from '../store/realm'

import { HARBOR_LOADED, NO_HARBOR, FORECAST_LOADED, PROFILE_LOADED, NO_PROFILE } from '../constants/harbor'


export function getSubscription() {
  return new Promise((resolve, reject) => {
    let uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref('subscription')
      .orderByChild('uid')
      .equalTo(uid)
      .once('value', snapshot => {
        if (snapshot.numChildren() > 0) {

          let subs = snapshot.val()
          let i = Object.keys(subs).filter(o => 'appName' in subs[o]).filter(e => subs[e].appName === 'sailor')

          if (i.length > 0) {
            let s = subs[i[0]]

            // load redux
            resolve({
              type: HARBOR_LOADED,
              key: i[0],
              directions: s.directions,
              location: s.location,
              name: s.name
            })

            //Save to offline
            realm.write(() => {
              let _profile = realm.objects('Harbor')
              _profile[0].directions = s.directions
              _profile[0].location = s.location
              _profile[0].key = i[0]
              _profile[0].name = s.name
            })


          }
          else {
            resolve({ type: NO_HARBOR })
          }
        }
        else {
          resolve({ type: NO_HARBOR })
        }
      }).catch(error => {
        console.log(error)
        resolve({ type: NO_HARBOR })
      })
  })
}

export function getProfile() {
  return new Promise((resolve, reject) => {
    let uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref('user/' + uid + '/sailing')
      .once('value', snapshot => {
        let obj = snapshot.val()
        if (snapshot.numChildren() > 0) {
          realm.write(() => {
            let _profile = realm.objects('Harbor')
            if (_profile.length > 0) {
              _profile[0].windMin = obj.minSpeed
              _profile[0].windMax = obj.maxSpeed
            }
            else {
              realm.create('Harbor', { id: 1, windMin: obj.maxSpeed, windMax: obj.minSpeed })
            }
          })
          resolve({ type: PROFILE_LOADED, windMax: obj.maxSpeed, windMin: obj.minSpeed })
        }
        else {
          resolve({ type: NO_PROFILE })
        }
      }).catch(error => {
        console.log(error)
        resolve({ type: NO_PROFILE })
      })
  })
}


export function saveHarbor(payload, profile) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid

      payload.windMin = 5
      payload.radius = 100
      payload.appName = 'sailor'
      payload.uid = uid
      payload.lastFired = Date.now()

      console.log(payload, profile)

      firebase.database().ref('user/' + uid + '/sailing').set(profile)
      // Dispach profile information
      dispatch({ type: PROFILE_LOADED, windMax: profile.maxSpeed, windMin: profile.minSpeed })

      var ref = firebase.database().ref('subscription').push()
      console.log(ref.key)
      ref.set(payload).then(() => {

        // Dispach harbor information
        dispatch({
          type: HARBOR_LOADED,
          key: ref.key,
          directions: payload.directions,
          location: payload.location,
          name: payload.name
        })

        // Save for offline
        realm.write(() => {
          let harbor = realm.objects('Harbor')
          harbor[0].windMin = profile.minSpeed
          harbor[0].windMax = profile.maxSpeed
          harbor[0].key = ref.key
          harbor[0].directions = payload.directions
          harbor[0].location = payload.location
          harbor[0].name = payload.name
        })

        // Request Forecast

      })
        .catch(err => console.log(err))
    })
  }
}
