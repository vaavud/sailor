
import realm from '../store/realm'
import firebase from 'firebase'

import { LOGOUT } from '../constants/auth'
import { SETTING_UPDATED,ALIGNING_DEVICE } from '../constants/settings'
import { AsyncStorage } from 'react-native'


const updateSettings = (key, value) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      realm.write(() => {
        let settings = realm.objects('Settings')
        settings[0][key] = value
        dispatch({ type: SETTING_UPDATED, key, value })
      })
    })
  }
}

const logout = time => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      realm.write(() => {
        let sessionPoints = realm.objects('SessionPoints')
        realm.delete(sessionPoints)

        let _history = realm.objects('Session')
        realm.delete(_history)

        let harbor = realm.objects('Harbor')
        realm.delete(harbor)

        let settings = realm.objects('Settings')
        realm.delete(settings)
      })

      AsyncStorage.setItem('bleSetup', 'false')
      AsyncStorage.setItem('battery', 'n/a')

      firebase.auth().signOut()
      //TODO clean settings
      dispatch({ type: LOGOUT })
    })
  }
}


export {logout,updateSettings}
