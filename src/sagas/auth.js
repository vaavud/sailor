
import { put, select,call} from 'redux-saga/effects'
import { delay,takeEvery } from 'redux-saga'

import {IS_AUTH,CHECK_AUTH,NEEDS_AUTH} from '../constants/auth'


function* verifyAuthHandler(action) {

  if(action.isAuth) {
    yield put({type: IS_AUTH})
  }
  else {
    yield put({type: NEEDS_AUTH})

  }
}

export function* verifyAuth() {
  yield* takeEvery(CHECK_AUTH,verifyAuthHandler)
}
