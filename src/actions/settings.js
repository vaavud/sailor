
import realm from '../store/realm'
import firebase from 'firebase'

import { LOGOUT } from '../constants/auth'
import { SETTING_UPDATED } from '../constants/settings'

export function updateSettings(key, value) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {

      realm.write(() => {
        let settings = realm.objects('Settings')
        settings[0][key] = value
        dispatch({ type: SETTING_UPDATED, key, value })
      })
    })
  }
}


export function logout(time) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {

      realm.write(() => {
        let _history = realm.objects('Session')
        realm.delete(_history)

        let harbor = realm.objects('Harbor')
        realm.delete(harbor)

        let settings = realm.objects('Settings')
        realm.delete(settings)

      })

      firebase.auth().signOut()
      //TODO clean settings
      dispatch({ type: LOGOUT })
    })
  }
}
