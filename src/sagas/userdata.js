import { takeEvery, put } from 'redux-saga/effects'

import {ONLINE} from '../constants/auth'

import { getSessions } from '../actions/history'
import { getSubscription, getProfile } from '../actions/harbor'

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