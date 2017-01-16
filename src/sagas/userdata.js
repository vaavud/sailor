import { takeEvery, take } from 'redux-saga/effects'

import { getSessions } from '../actions/history'

// function* historyDaemonHandler(action) {
//   console.log('historyDaemonHandler', action)
// }

export function* historyDaemon() {
  const action = yield take('ONLINE')
  const _ = yield getSessions()
}