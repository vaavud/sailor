'use strict'

// import {
//   BackAndroid
// } from 'react-native'

// import React, { Component } from 'react'
// import { bindActionCreators } from 'redux'

import Login from '../login'
import SignUp from '../signup'
import Forgot from '../forgot'
import Tour from '../tour'

// import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation'


// const {
//   CardStack: NavigationCardStack,
//   StateUtils: NavigationStateUtils,
// } = NavigationExperimental

// const NavReducer = createReducer({
//   index: 0,
//   key: 'App',
//   routes: [{ key: 'root', showBackButton: false }],
// })

// function createReducer(initialState) {
//   return (currentState = initialState, action) => {
//     switch (action.type) {
//       case 'push':
//         return NavigationStateUtils.push(currentState, { key: action.key, title: action.title, showBackButton: action.showBackButton })
//       case 'pop':
//         return currentState.index > 0 ? NavigationStateUtils.pop(currentState) : currentState
//       default:
//         return currentState
//     }
//   }
// }


const Welcome = StackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Forgot: { screen: Forgot },
  Tour: { screen: Tour }
}, {
    headerMode: 'screen',
    navigationOptions: {
      header: null,
    }
  })

export default Welcome

/*export default class extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ...this.props.profile,
      email: '',
      navState: {
        permissions: null,
        index: 0,
        key: 'App',
        routes: [{ key: 'login', showBackButton: false, title: '' }]
      }
    }
  }

  _handleAction(action) {
    const newState = NavReducer(this.state.navState, action)
    if (newState === this.state.navState) {
      return false
    }
    this.setState({
      navState: newState
    })

    return true
  }

  handleBackAction() {
    return this._handleAction({ type: 'pop' })
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => this.handleBackAction())
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', () => this.handleBackAction())
  }

  render() {
    return (
      <NavigationCardStack
        navigationState={this.state.navState}
        onNavigate={this._handleAction.bind(this)}
        renderScene={this._renderScene.bind(this)} />
    )
  }


  _renderScene(props) {
    const key = props.scene.route.key
    switch (key) {
      case 'login':
        return (
          <Login
            SignUp={() => this._handleAction({
              type: 'push',
              key: 'signUp',
              title: 'Sign Up'
            })}
            forgotPassword={() => this._handleAction({
              type: 'push',
              key: 'forgot',
              title: 'Forgot password'
            })} />
        )
      case 'signUp':
        return (<SignUp pop={() => this.handleBackAction({ type: 'pop' })} />)
      case 'forgot':
        return (<Forgot pop={() => this.handleBackAction({ type: 'pop' })} />)
      case 'tour':
        return (<Tour />)
    }
  }
}*/

// const mapReduxStoreToProps = (reduxStore) => {
//   return {
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {

//   }
// }


// export default connect(mapReduxStoreToProps, mapDispatchToProps)(Welcome)
