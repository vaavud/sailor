import { combineReducers } from 'redux'
import app from './app'
import login from './login'
import history from './history'

export default combineReducers({
  app,
  login,
  history
})
