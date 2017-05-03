

import { AsyncStorage } from 'react-native'

import { HOME_READY, SKIP_SETUP } from '../constants/auth'

//SKIP_SETUP

const skipIntro = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem('bleSetup', 'true')
      dispatch({ type: HOME_READY })
    })
  }
}

const doneIntro = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: SKIP_SETUP })
    })
  }
}

const introStatus = () => {
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

const goToBleSetup = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'SETUP' })
  }
}

const saveLastBLEStatus = battery => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem('bleSetup', 'true')
      AsyncStorage.setItem('battery', battery.toString())
      dispatch({ type: 'BATTERY', battery })
      resolve()
    })
  }
}

const getBatteryLevel = () => {
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

export { getBatteryLevel, saveLastBLEStatus, goToBleSetup, introStatus, doneIntro, skipIntro }
