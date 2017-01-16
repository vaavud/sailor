
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware, compose } from 'redux'
import combineReducers from '../reducers/combine'
import firebase from 'firebase'

import { createPersist } from './persist'


// constants
import { CHECK_AUTH, VERIFY_EXISTING_USER } from '../constants/auth'


//sagas
import { verifyAuth, verifyExistingUser } from '../sagas/auth'
import { error } from '../sagas/utils'
import { historyDaemon } from '../sagas/userdata'

const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware()

const createStoreWithMiddleware = compose(
  applyMiddleware(
    // loggerMiddleware,
    sagaMiddleware,
    thunkMiddleware,
  )
)

export const store = createStore(combineReducers, createStoreWithMiddleware)

sagaMiddleware.run(verifyAuth)
sagaMiddleware.run(verifyExistingUser)
sagaMiddleware.run(error)
sagaMiddleware.run(historyDaemon)


createPersist()

// firebase.auth().signOut()

firebase.auth().onAuthStateChanged(authData => {
  if (authData) {
    store.dispatch({ type: VERIFY_EXISTING_USER, uid: authData.uid })
    store.dispatch({ type: CHECK_AUTH, isAuth: true, authData })
  }
  else {
    store.dispatch({ type: CHECK_AUTH, isAuth: false })
  }
})
