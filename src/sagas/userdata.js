
import realm from '../store/realm'

import { takeEvery, put, select, call } from 'redux-saga/effects'

import { WORK_WITH_SERVER, STATUS, HOME_READY, SETUP } from '../constants/auth'
import { HARBOR_LOADED, RELOAD_FORECAST } from '../constants/harbor'

import { getSessions } from '../actions/history'
import { getSubscription, getProfile, getForecast } from '../actions/harbor'
import { harbor, settings, token, online } from '../selectors/common'
import { justSaveSessionInFirebase, sendPoints } from '../actions/measure'
import { introStatus, getBatteryLevel } from '../actions/bluetooth'



//
// try to get information from server and put them in redux
//


function* historyDaemonHandler(action) {
  console.log('Normal FLow')
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
  yield takeEvery('WORK_WITH_SERVER_POST_SYNC', historyDaemonHandler)
}

//
// once requested the getSubscription try to get forecast
//

function* forecastDeamonHandler() {
  if (yield select(online)) {
    const _harbor = yield select(harbor)
    console.log(_harbor)
    const _settings = yield select(settings)
    const _token = yield select(token)

    yield put(yield getForecast(_harbor.windMax, _harbor.windMin, _settings.windSpeed, _token, _harbor.key))
  }
}

export function* forecastDeamon() {
  yield takeEvery(HARBOR_LOADED, forecastDeamonHandler)
}

export function* refreshForecastDeamon() {
  yield takeEvery(RELOAD_FORECAST, forecastDeamonHandler)
}


//
// Verify if there is something in cache 
// if so, send them to the server
//

function* sessionDeamonHandler() {
  yield put({ type: STATUS, status: 'Syncing cache...' })

  if (yield select(online)) {

    let sessionPoints = [...realm.objects('SessionPoints').filtered('sent = false')]

    for (let i in sessionPoints) { //Get and save points
      let sessionPoint = sessionPoints[i]
      if (sessionPoint) {
        let currentPoints = realm.objects('SessionPoints').filtered(`key = "${sessionPoint.key}"`)
        let points = currentPoints[0].points
        let _points = []

        for (let x in points) {
          _points.push(points[x])
        }

        console.log('sessionPoint', sessionPoint.key)
        console.log('sessionPoint', _points)


        try {
          yield call(sendPoints, sessionPoint.key, _points)
          realm.write(() => {
            realm.delete(currentPoints)
          })
        }
        catch (e) {
          console.log('error wa wa wa', e)
        }

        console.log('everything went fine!')
      }
    }


    let objCopy = [...realm.objects('Session').filtered('sent = false')]

    for (let i in objCopy) {//Get and sessions
      let s = objCopy[i]
      if (s) {
        let currentSessions = realm.objects('Session').filtered(`key = "${s.key}"`)
        let item = { ...currentSessions[0] }

        let key = item.key
        delete item.key
        delete item.sent
        console.log('trying to send to firebase ', key, item)
        try {
          yield call(justSaveSessionInFirebase, item, key)
          realm.write(() => {
            currentSessions[0].sent = true
          })
        }
        catch (e) {
          console.log('error wa wa wa', e)
        }
      }
    }

    console.log('DONE :D....')
    yield put({ type: 'WORK_WITH_SERVER_POST_SYNC', status: 'Syncing cache...' })
  }
}

export function* sessionDeamon() {
  yield takeEvery(WORK_WITH_SERVER, sessionDeamonHandler)
}