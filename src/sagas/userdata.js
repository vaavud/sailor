
import firebase from 'firebase'
import realm from '../store/realm'

import { takeEvery, put, select, call } from 'redux-saga/effects'

import { ONLINE } from '../constants/auth'
import { HARBOR_LOADED } from '../constants/harbor'

import { getSessions } from '../actions/history'
import { getSubscription, getProfile, getForecast } from '../actions/harbor'
import { harbor, settings, token, online } from '../selectors/common'
import { saveSession, sendPoints } from '../actions/measure'

function* historyDaemonHandler(action) {
  if (action.online) {
    yield put(yield getProfile())
    yield put(yield getSubscription())
    yield put(yield getSessions())
  }
}

export function* historyDaemon() {
  yield takeEvery(ONLINE, historyDaemonHandler)
}

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

    let sessionPoints = realm.objects('SessionPoints')

    for (let i in sessionPoints) {
      let sessionPoint = sessionPoints[i]
      if (sessionPoint) {
        let points = sessionPoint.points
        let _points = []

        for (let x in points) {
          _points.push(points[x])
        }

        try {
          yield call(sendPoints, sessionPoint.key, _points)
          yield call(deletePointsWraper, sessionPoint)
        }
        catch (e) {
          console.log('error wa wa wa', e)
        }
      }

    }


    let currentSessions = realm.objects('Session').filtered('sent = false')
    for (let i in currentSessions) {
      let s = currentSessions[i]
      if (s) {
        let key = s.key
        delete s.key
        console.log('trying to send to firebase ', key)
        yield call(saveSession, s, key)
        yield call(updateSession, s)
      }
    }


    //   let currentSessions = realm.objects('Session').filtered('sent = false')
    //   let keySaved = []


    //   if (currentSessions.length > 0) {

    //     for (let i in currentSessions) {

    //       if (currentSessions[i] === undefined) { continue }

    //       let key = currentSessions[i].key
    //       console.log('key', key)
    //       let sessionPoints = realm.objects('SessionPoints').filtered(`key = "${key}"`)

    //       if (sessionPoints[0].points.length > 0) {

    //         let points = sessionPoints[0].points
    //         let _points = []

    //         for (let x in points) {
    //           _points.push(points[x])
    //         }

    //         try {
    //           yield call(sendPoints, key, _points)
    //           yield call(saveSessionFb, key, currentSessions[i])
    //           keySaved.push(key)

    //           console.log('Saved with key :D', key)

    //         }
    //         catch (e) {
    //           console.log('error wa wa wa', e)
    //         }
    //       }
    //       else { //just save session
    //         console.log('no points, just session') // This should never happen
    //         keySaved.push(key)
    //       }
    //     }

    //     for (let index in keySaved) {
    //       realm.write(() => {
    //         let session = realm.objects('Session').filtered(`key = "${keySaved[index]}"`)
    //         session[0].sent = true
    //       })
    //     }
    //     console.log('everythin done...')
    //   }
    //   else {
    //     console.log('nothing to send...')
    //   }
  }
}

export function* sessionDeamon() {
  yield takeEvery(ONLINE, sessionDeamonHandler)
}