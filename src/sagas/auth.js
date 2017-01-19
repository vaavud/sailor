
import { put, takeEvery, race, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import realm from '../store/realm'

import {
  IS_AUTH, CHECK_AUTH, NEEDS_AUTH, VERIFY_EXISTING_USER,
  ONLINE
} from '../constants/auth'
import { NO_HISTORY, HISTORY_LOADED } from '../constants/history'
import { HARBOR_LOADED, PROFILE_LOADED, FORECAST_LOADED } from '../constants/harbor'
import { SETTINGS_LOADED } from '../constants/settings'


import { getCurrentUser } from '../actions/auth'


function* verifyAuthHandler(action) {
  if (action.isAuth) {
    yield put({ type: IS_AUTH })
  }
  else {
    yield put({ type: NEEDS_AUTH })
  }
}

export function* verifyAuth() {
  yield takeEvery(CHECK_AUTH, verifyAuthHandler)
}

function* verifyExistingUserHandler(action) {
  const { timeout, otherCall } = yield race({
    timeout: call(delay, 5000),
    otherCall: call(getCurrentUser, action.uid)
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
    let history = realm.objects('Session')
    let harbor = realm.objects('Harbor')
    let sessions = []

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

    yield put({ type: ONLINE, online: false })
  }
  else { //Loading settings to Firebase
    yield put({ type: ONLINE, online: true })
  }
}

export function* verifyExistingUser() {
  yield takeEvery(VERIFY_EXISTING_USER, verifyExistingUserHandler)
}