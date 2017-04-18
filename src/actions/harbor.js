
import firebase from 'firebase'
import realm from '../store/realm'

import { HARBOR_LOADED, NO_HARBOR, FORECAST_LOADED, FORECAST_FAILD, PROFILE_LOADED, NO_PROFILE, RELOAD_FORECAST } from '../constants/harbor'

const google_Api_key = 'AIzaSyBcL4Hz1TeA52ZnrMDTRuo_Ff8wtZ7xY5E'
const googleApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?'


const apiUrl = 'https://apps-api.vaavud.com/sailing/'


export function getForecast(windMax, windMin, unit, token, subId) {
  return new Promise((resolve, reject) => {

    let finalUrl = apiUrl + `harbour/${windMax}/${windMin}/mps/${subId}`
    console.log(finalUrl)

    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', token)
    var request = new Request(finalUrl, {
      method: 'GET',
      headers: myHeaders
    })

    fetch(request)
      .then(response => response.json())
      .then(forecast => {
        console.log(forecast)
        if ('id' in forecast) {
          resolve({ type: FORECAST_LOADED, forecast: forecast })

          console.log('forecast[0]', forecast)

          //Save forecast in Realm
          var fore = realm.objects('Forecast')
          realm.write(() => {
            realm.delete(fore)
            realm.create('Forecast', { ...forecast })
          })

        }
        else {
          resolve({ type: FORECAST_FAILD })
        }
      })
      .catch(err => {
        console.log('_forecast', err)
        resolve({ type: FORECAST_FAILD })
        // reject(err)
      })
  })
}


//facebook:1019425681435560

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

          console.log(i)

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

export function saveProfile(profile, reloadForecast) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid

      firebase.database().ref('user/' + uid + '/sailing').set(profile)
      // Dispach profile information
      dispatch({ type: PROFILE_LOADED, windMax: profile.maxSpeed, windMin: profile.minSpeed })
      if (reloadForecast) {
        dispatch({ type: RELOAD_FORECAST })
      }
      resolve()
    })
  }
}


export function saveHarbor(payload, key) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      let uid = firebase.auth().currentUser.uid

      payload.windMin = 5
      payload.radius = 100
      payload.appName = 'sailor'
      payload.uid = uid
      payload.lastFired = Date.now()

      console.log(payload)

      // firebase.database().ref('user/' + uid + '/sailing').set(profile)
      // // Dispach profile information
      // dispatch({ type: PROFILE_LOADED, windMax: profile.maxSpeed, windMin: profile.minSpeed })

      let _key

      if (key) {
        _key = key
        firebase.database().ref('subscription').child(key).update(payload)
      }
      else {
        let ref = firebase.database().ref('subscription').push()
        _key = ref.key
        ref.set(payload)
      }


      // Dispach harbor information
      dispatch({
        type: HARBOR_LOADED,
        key: _key,
        directions: payload.directions,
        location: payload.location,
        name: payload.name
      })

      // Save for offline
      realm.write(() => {
        let harbor = realm.objects('Harbor')
        if (harbor[0] === undefined) {
          harbor = realm.create('Harbor', {})
        }
        else {
          harbor = harbor[0]
        }

        harbor.windMin = getState().harbor.windMin
        harbor.windMax = getState().harbor.windMax
        harbor.key = _key
        harbor.directions = payload.directions
        harbor.location = payload.location
        harbor.name = payload.name
      })

      resolve()

      // Request Forecast TODO

    })
  }
}



export function nameByLatLon(location) {
  return new Promise((resolve, reject) => {
    let request = `${googleApiUrl}latlng=${location.latitude},${location.longitude}&key=${google_Api_key}`

    fetch(request)
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.log('google api', err)
        reject(err)
      })
  })
}