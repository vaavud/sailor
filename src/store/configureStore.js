
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware,compose } from 'redux'
import combineReducers from '../reducers/combine'
import firebase from 'firebase'

import {createPersist} from './persist'


// constants
import {CHECK_AUTH} from '../constants/auth'


//sagas
import {verifyAuth} from '../sagas/auth'




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

sagaMiddleware.run(verifyAuth)

createPersist()

firebase.auth().onAuthStateChanged(authData => {
  if (authData) {
    store.dispatch({type: CHECK_AUTH,isAuth:true,authData})
  }
  else {
    store.dispatch({type: CHECK_AUTH,isAuth:false})
  }
})

firebase.database().ref('.info/connected').on('value', snap => {
  var isConnected = snap.val()

  console.log("isConnected",isConnected)

})
