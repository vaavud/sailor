import React, { Component } from 'react'
import { AppRegistry,View } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './src/store/configureStore'
import Sailor from './src/Sailor'


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
