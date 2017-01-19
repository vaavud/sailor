import { takeEvery, put, select } from 'redux-saga/effects'

import { ONLINE } from '../constants/auth'
import { HARBOR_LOADED } from '../constants/harbor'

import { getSessions } from '../actions/history'
import { getSubscription, getProfile, getForecast } from '../actions/harbor'
import { harbor, settings, token, online } from '../selectors/common'

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