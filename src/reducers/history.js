
import { NO_HISTORY, HISTORY_LOADED } from '../constants/history'
import { LOGOUT } from '../constants/auth'


var initialState = {
  sessions: [],
  loading: true
}

export default function history(state = initialState, action) {
  switch (action.type) {
    case NO_HISTORY:
      return { ...state, loading: false }
    case HISTORY_LOADED:
      return { ...state, loading: false, sessions: action.list }
    case LOGOUT:
      return { ...state, ...initialState }
    default:
      return state
  }
}
