import { combineReducers } from 'redux'
import app from './app'
import login from './login'
import history from './history'
import harbor from './harbor'
import settings from './settings'

export default combineReducers({
  app,
  login,
  history,
  harbor,
  settings
})
