
import thunkMiddleware from 'redux-thunk'

// import createLogger from 'redux-logger'
// import { composeWithDevTools } from 'remote-redux-devtools'


import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware, compose } from 'redux'
import combineReducers from '../reducers/combine'
import firebase from 'firebase'

import { createPersist } from './persist'


// constants
import { CHECK_AUTH, VERIFY_EXISTING_USER, TOKEN, STATUS } from '../constants/auth'


//sagas
import { verifyAuth, verifyExistingUser, workWithCache, saveUserIfNeeded } from '../sagas/auth'
import { error } from '../sagas/utils'
import { historyDaemon, forecastDeamon, sessionDeamon, refreshForecastDeamon } from '../sagas/userdata'

// const loggerMiddleware = createLogger()
const sagaMiddleware = createSagaMiddleware()
// const composeEnhancers = composeWithDevTools({ realtime: true, port: 8080, hostname: 'localhost' })

// const createStoreWithMiddleware = compose(
//   composeEnhancers(applyMiddleware(
//     // loggerMiddleware,
//     sagaMiddleware,
//     thunkMiddleware,
//   ))
// )


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
sagaMiddleware.run(forecastDeamon)
sagaMiddleware.run(sessionDeamon)
sagaMiddleware.run(workWithCache)
sagaMiddleware.run(saveUserIfNeeded)
sagaMiddleware.run(refreshForecastDeamon)


createPersist()

// firebase.auth().signOut()

firebase.auth().onAuthStateChanged(authData => {
  if (authData) {

    store.dispatch({ type: STATUS, status: 'User Authenticated...' })

    authData.getIdToken().then(token => {
      store.dispatch({ type: TOKEN, uid: authData.uid, token })
      store.dispatch({ type: VERIFY_EXISTING_USER, uid: authData.uid })
      store.dispatch({ type: CHECK_AUTH, isAuth: true, authData })
    })
      .catch(err => {
        console.log(err, authData)
        store.dispatch({ type: TOKEN, uid: authData.uid, token: authData.refreshToken })
        store.dispatch({ type: VERIFY_EXISTING_USER, uid: authData.uid })
        store.dispatch({ type: CHECK_AUTH, isAuth: true, authData })
      })
  }
  else {
    store.dispatch({ type: CHECK_AUTH, isAuth: false })
  }
})
