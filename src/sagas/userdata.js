
import firebase from 'firebase'
import realm from '../store/realm'

import { takeEvery, put, select, call } from 'redux-saga/effects'

import { ONLINE } from '../constants/auth'
import { HARBOR_LOADED } from '../constants/harbor'

import { getSessions } from '../actions/history'
import { getSubscription, getProfile, getForecast } from '../actions/harbor'
import { harbor, settings, token, online } from '../selectors/common'
import { saveSessionFb, sendPoints } from '../actions/measure'

function* historyDaemonHandler(action) {
  if (action.online) {
    // yield put(yield getProfile())
    // yield put(yield getSubscription())
    // yield put(yield getSessions())
  }
}

export function* historyDaemon() {
  yield takeEvery(ONLINE, historyDaemonHandler)
}

function* forecastDeamonHandler() {
  if (yield select(online)) {
    // const _harbor = yield select(harbor)
    // const _settings = yield select(settings)
    // const _token = yield select(token)

    // yield put(yield getForecast(_harbor.windMax, _harbor.windMin, _settings.windSpeed, _token, _harbor.key))
  }
}

export function* forecastDeamon() {
  yield takeEvery(HARBOR_LOADED, forecastDeamonHandler)
}


function* sessionDeamonHandler() {
  if (yield select(online)) {

    let currentSession = realm.objects('Session').filtered('sent = false')

    if (currentSession.length > 0) {

      for (var i in currentSession) {

        if (!currentSession[i]) { continue }

        let key = currentSession[i].key
        let sessionPoints = realm.objects('SessionPoints').filtered(`key = "${key}"`)

        console.log(key)

        if (sessionPoints[0].points.length > 0) {

          let points = sessionPoints[0].points
          let _points = []

          for (let x in points) {
            _points.push(points[x])
          }

          try {
            yield call(sendPoints, key, _points)
            yield call(saveSessionFb, key, currentSession[i])

            console.log('Saved with key :D', key)

            realm.write(() => {
              currentSession[i].sent = true
            })

          }
          catch (e) {
            console.log('error wa wa wa', e)
          }
        }
        else { //just save session

          //FIXME
          realm.write(() => {
            currentSession[i].sent = true
          })
        }
      }







      // let key = currentSession[0].key
      // console.log('myKey', key)

      // let sessionPoints = realm.objects('SessionPoints').filtered(`key = "${key}"`)
      // if (sessionPoints.length > 0) {
      //   console.log('sending to location', sessionPoints[0])
      //   let points = sessionPoints[0].points
      //   let _points = []

      //   for (let i in points) {
      //     _points.push(points[i])
      //   }

      //   let obj = {}
      //   obj[key] = _points

      //   fetch('http://10.0.1.129:8083/apps/addMeasurements', {
      //     method: 'POST',
      //     body: JSON.stringify([obj])
      //   })
      //   .then(response => response.json())
      //   .then(responseData => {

      //       if ('insetred' in responseData && responseData.insetred > 0) {
      //         realm.write(() => {
      //           currentSession[0].sent = true
      //           sessionPoints[0].sent = true
      //         })
      //         console.log('responseData', responseData)
      //       }
      //   })
      //   .catch(err => console.log(err))
      // }
    }
    else {
      console.log('nothing to send...')
    }
  }
}


export function* sessionDeamon() {
  yield takeEvery(ONLINE, sessionDeamonHandler)
}
