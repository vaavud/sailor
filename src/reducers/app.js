

import {
  IS_AUTH, NEEDS_AUTH,
  LOADING, ONLINE,
  LOGOUT, TOKEN,
  STATUS, OFFLINE,
  HOME_READY, SKIP_SETUP,
  SETUP, BATTERY,
  CALIBRATE, SKIP_CALIBRATION,
  MEASUREMENT
} from '../constants/auth'

import {ALIGNING_DEVICE} from '../constants/settings'

var initialState = {
  uid: undefined,
  deviceId: undefined,
  isLoading: false,
  provider: 'unknown',
  isAuth: false,
  state: LOADING,
  status: '',
  online: false,
  token: undefined,
  battery: 'n/a'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case IS_AUTH:
      return { ...state, isAuth: true }
    case BATTERY:
      return { ...state, battery: action.battery }
    case SETUP:
      return { ...state, state: action.type }
    case SKIP_SETUP:
      return { ...state, state: CALIBRATE }
    case SKIP_CALIBRATION:
      return { ...state, state: HOME_READY }
    case MEASUREMENT:
      return { ...state, state: MEASUREMENT }
    case NEEDS_AUTH:
      return { ...state, isAuth: false, state: action.type }
    case HOME_READY:
      return { ...state, state: action.type }
    case ONLINE:
      return { ...state, online: true }
    case OFFLINE:
      return { ...state, online: false }
    case STATUS:
      return { ...state, status: action.status }
    case LOGOUT:
      return { ...initialState, state: NEEDS_AUTH }
    case TOKEN:
      return { ...state, uid: action.uid, token: action.token }
    default:
      return state
  }
}
