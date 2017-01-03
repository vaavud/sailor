
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware,compose } from 'redux'
import combineReducers from '../reducers/combine'

// import {reqLogout,createUser,error,authStatus,onlineStatus} from '../sagas/login'
// import {subscriptionDaemon,historyDaemon} from '../sagas/userData'
// import {onFirebaseAuth,onFirebaseConnection,firebaseAuthIterator} from '../sagas/firebase'
// import {amplitudeTrackerDaemon,dispatchAmplitudEvent} from '../sagas/amplitude'
import createPersist from './persist'

const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware()

const createStoreWithMiddleware = compose(
  applyMiddleware(
    loggerMiddleware,
    sagaMiddleware,
    thunkMiddleware,
  )
)

export const store = createStore(combineReducers,createStoreWithMiddleware)
