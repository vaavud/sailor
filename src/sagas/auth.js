
import { put, takeEvery, race, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import realm from '../store/realm'

import {
  IS_AUTH, CHECK_AUTH, NEEDS_AUTH, VERIFY_EXISTING_USER,
  ONLINE, WORK_WITH_CACHE, OFFLINE, STATUS, WORK_WITH_SERVER, HOME_READY
} from '../constants/auth'
import { NO_HISTORY, HISTORY_LOADED } from '../constants/history'
import { HARBOR_LOADED, PROFILE_LOADED, FORECAST_LOADED } from '../constants/harbor'
import { SETTINGS_LOADED } from '../constants/settings'


import { getCurrentUser } from '../actions/auth'



// 
// Verify if user has been auth
// 
//

function* verifyAuthHandler(action) {
  if (!action.isAuth) {
    yield put({ type: NEEDS_AUTH })
  }
  else {
    yield put({ type: IS_AUTH })
  }
}

export function* verifyAuth() {
  yield takeEvery(CHECK_AUTH, verifyAuthHandler)
}




//
// Verify if user exists and its online
// if false check if there is something in memory
//


function* verifyExistingUserHandler(action) {
  yield put({ type: STATUS, status: 'Checking connection...' })


  const { timeout, otherCall } = yield race({
    timeout: call(delay, 5000),
    otherCall: call(getCurrentUser, action.uid) //Save in redux, so far its not needed. Just to validate if there is interenet
  })


  //Loading settings to Redux
  var settings = realm.objects('Settings')
  if (settings.length === 0) {
    realm.write(() => {
      settings = realm.create('Settings', {})
    })
  }
  else {
    settings = settings[0]
  }

  yield put({ type: SETTINGS_LOADED, settings })

  if (timeout) { //Loading information from Realm
    yield put({ type: STATUS, status: 'Working offline' })
    yield put({ type: OFFLINE })
    yield put({ type: WORK_WITH_CACHE })
  }
  else { //Loading settings to Firebase
    yield put({ type: STATUS, status: 'App connected' })
    yield put({ type: ONLINE })
    yield put({ type: WORK_WITH_SERVER })
  }
}

export function* verifyExistingUser() {
  yield takeEvery(VERIFY_EXISTING_USER, verifyExistingUserHandler)
}


//
// Put in redux information from cache
//
//

function* workWithCacheHandler() {

  let history = realm.objects('Session')
  let harbor = realm.objects('Harbor')
  let sessions = []

  yield put({ type: STATUS, status: 'Loading information from cache...' })

  if (harbor.length > 0) {
    if (harbor[0].key) {
      yield put({
        type: HARBOR_LOADED,
        key: harbor[0].key,
        directions: harbor[0].directions,
        location: harbor[0].location,
        name: harbor[0].name
      })

      //Load forecast in Redux
      var forecast = realm.objects('Forecast')
      if (forecast.length > 0) {
        yield put({
          type: FORECAST_LOADED,
          forecast: forecast[0],
        })
      }
    }

    yield put({
      type: PROFILE_LOADED,
      windMin: harbor[0].windMin,
      windMax: harbor[0].windMin
    })
  }

  for (let session of history.values()) {
    sessions.push(session)
  }

  if (history.length > 0) {
    yield put({ type: HISTORY_LOADED, list: sessions })
  }
  else {
    yield put({ type: NO_HISTORY })
  }

  yield put({ type: HOME_READY })
}


export function* workWithCache() {
  yield takeEvery(WORK_WITH_CACHE, workWithCacheHandler)
}
