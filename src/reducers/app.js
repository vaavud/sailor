

import { IS_AUTH, NEEDS_AUTH, LOADING, ONLINE, LOGOUT, TOKEN, STATUS, OFFLINE, HOME_READY } from '../constants/auth'

var initialState = {
  uid: undefined,
  deviceId: undefined,
  isLoading: false,
  provider: 'unknown',
  isAuth: false,
  state: LOADING,
  status: '',
  online: false,
  token: undefined
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case IS_AUTH:
      return { ...state, isAuth: true }
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
      return { ...state, isAuth: false, state: NEEDS_AUTH }
    case TOKEN:
      return { ...state, uid: action.uid, token: action.token }
    default:
      return state
  }
}
