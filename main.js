import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './src/store/configureStore'
import Sailor from './src/Sailor'
import { Crashlytics } from 'react-native-fabric'

class App extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <Sailor />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('sailing', () => App)
