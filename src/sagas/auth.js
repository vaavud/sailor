
import { put, takeEvery, race, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {
  IS_AUTH, CHECK_AUTH, NEEDS_AUTH, VERIFY_EXISTING_USER,
  ONLINE
} from '../constants/auth'

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

  if (timeout) {
    yield put({ type: ONLINE, online: false })
  }
  else {
    yield put({ type: ONLINE, online: true })
  }
}

export function* verifyExistingUser() {
  yield takeEvery(VERIFY_EXISTING_USER, verifyExistingUserHandler)
}