
import { NO_HISTORY, HISTORY_LOADED, NEW_SESSION, SESSION_DELETED } from '../constants/history'
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
      console.log(action.list)
      return { ...state, loading: false, sessions: action.list }
    case NEW_SESSION:
      let sessions = state.sessions
      sessions.push(action.session)
      return { ...state, sessions }
    case SESSION_DELETED:
      let _sessions = state.sessions

      let index = _sessions.indexOf(_sessions.find(item => item !== undefined && item.key === action.sessionKey))
      delete _sessions[index]
      let cloneSessions = []
      for (let index in _sessions) {
        cloneSessions.push(_sessions[index])
      }

      return { ...state, sessions: cloneSessions }

    case LOGOUT:
      return { ...state, ...initialState }
    default:
      return state
  }
}
