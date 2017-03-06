
import realm from '../store/realm'

import { takeEvery, put, select, call } from 'redux-saga/effects'

import { WORK_WITH_SERVER, STATUS, HOME_READY, SETUP } from '../constants/auth'
import { HARBOR_LOADED } from '../constants/harbor'

import { getSessions } from '../actions/history'
import { getSubscription, getProfile, getForecast } from '../actions/harbor'
import { harbor, settings, token, online } from '../selectors/common'
import { saveSession, sendPoints } from '../actions/measure'
import { introStatus, getBatteryLevel } from '../actions/bluetooth'



//
// try to get information from server and put them in redux
// 
//


function* historyDaemonHandler(action) {
  yield put({ type: STATUS, status: 'Loading user information...' })
  yield put(yield getBatteryLevel())
  yield put(yield getProfile())
  yield put(yield getSubscription())
  yield put(yield getSessions())

  let isSetupDone = yield introStatus()

  if (isSetupDone === 'true') { // AsyncStorage only supports String...
    yield put({ type: HOME_READY })
  }
  else {
    yield put({ type: SETUP })
  }
}

export function* historyDaemon() {
  yield takeEvery(WORK_WITH_SERVER, historyDaemonHandler)
}




//
// once requested the getSubscription try to get forecast
// 
//


function* forecastDeamonHandler() {
  if (yield select(online)) {
    const _harbor = yield select(harbor)
    const _settings = yield select(settings)
    const _token = yield select(token)

    yield put(yield getForecast(_harbor.windMax, _harbor.windMin, _settings.windSpeed, _token, _harbor.key))
  }
}

export function* forecastDeamon() {
  yield takeEvery(HARBOR_LOADED, forecastDeamonHandler)
}



//
// Verify if there is something in cache 
// if so, send them to the server
//


function deletePointsWraper(sessionPoint) {
  return new Promise((resolve, reject) => {
    realm.write(() => {
      console.log('removing from local', sessionPoint.key)
      realm.delete(sessionPoint)
      resolve()
    })
  })
}

function updateSession(session) {
  return new Promise((resolve, reject) => {
    realm.write(() => {
      console.log('sent to firebase', session.key)
      session.sent = true
      resolve()
    })
  })
}


function* sessionDeamonHandler() {
  if (yield select(online)) {

    // let sessionPoints = realm.objects('SessionPoints')

    // for (let i in sessionPoints) { //Get and save points
    //   let sessionPoint = sessionPoints[i]
    //   if (sessionPoint) {
    //     let points = sessionPoint.points
    //     let _points = []

    //     for (let x in points) {
    //       _points.push(points[x])
    //     }

    //     try {
    //       yield call(sendPoints, sessionPoint.key, _points)
    //       yield call(deletePointsWraper, sessionPoint)
    //     }
    //     catch (e) {
    //       console.log('error wa wa wa', e)
    //     }
    //   }
    // }

    // let currentSessions = realm.objects('Session').filtered('sent = false')

    // for (let i in currentSessions) {//Get and sessions
    //   let s = currentSessions[i]
    //   if (s) {
    //     let key = s.key
    //     delete s.key
    //     console.log('trying to send to firebase ', key)
    //     yield call(saveSession, s, key)
    //     yield call(updateSession, s)
    //   }
    // }

  }
}

export function* sessionDeamon() {
  yield takeEvery(WORK_WITH_SERVER, sessionDeamonHandler)
}