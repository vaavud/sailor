

import { AsyncStorage } from 'react-native'

import { SKIP_SETUP } from '../constants/auth'

export function skipIntro() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem('bleSetup', 'true')
      dispatch({ type: SKIP_SETUP })
    })
  }
}

export function introStatus() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('bleSetup').then(status => {
      console.log(status)
      if (status !== null) {
        resolve(status)
      }
      else {
        resolve('false')
      }
    })
  })
}

export function goToBleSetup(){
  return (dispatch, getState) => {
    dispatch({type: 'SETUP'})
  }
}

export function saveLastBLEStatus(battery) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem('bleSetup', 'true')
      AsyncStorage.setItem('battery', battery.toString())
      dispatch({ type: 'BATTERY', battery })
      resolve()
    })
  }
}

export function getBatteryLevel() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('battery').then(battery => {
      if (battery !== null) {
        resolve({ type: 'BATTERY', battery })
      }
      else {
        resolve({ type: 'BATTERY', battery: 'n/a' })
      }
    })
  })
}
