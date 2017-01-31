

import { IS_AUTH, NEEDS_AUTH, LOADING, ONLINE, LOGOUT,TOKEN } from '../constants/auth'

var initialState = {
  uid: undefined,
  deviceId: undefined,
  isLoading: false,
  provider: 'unknown',
  isAuth: false,
  state: LOADING,
  online: false,
  token: undefined
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case IS_AUTH:
      return { ...state, isAuth: true, state: action.type }
    case NEEDS_AUTH:
      return { ...state, isAuth: false, state: action.type }
    case ONLINE:
      return { ...state, online: action.online }
    case LOGOUT:
      return { ...state, isAuth: false, state: NEEDS_AUTH, deviceId: undefined }
    case TOKEN:
      return { ...state, uid: action.uid, token: action.token }

    default:
      return state
  }
}
