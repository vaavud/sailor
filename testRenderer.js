import React, { Component } from 'react'
import { AppRegistry } from 'react-native'

import LoginView from './src/views/auth/'

class App extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <LoginView />
    )
  }
}

AppRegistry.registerComponent('sailing', () => App)
