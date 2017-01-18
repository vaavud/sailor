'use strict'

import {
  BackAndroid,
  View,
  NavigationExperimental,
} from 'react-native'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Welcome from './welcome'
import Bluetooth from './bluetooth'
import Summary from './summary'


const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental

const NavReducer = createReducer({
  index: 0,
  key: 'App',
  routes: [{ key: 'root', showBackButton: false }],
})

function createReducer(initialState) {
  return (currentState = initialState, action) => {
    switch (action.type) {
      case 'push':
        return NavigationStateUtils.push(currentState, { key: action.key, title: action.title, showBackButton: action.showBackButton })
      case 'pop':
        return currentState.index > 0 ? NavigationStateUtils.pop(currentState) : currentState
      default:
        return currentState
    }
  }
}


class Intro extends Component {

  constructor(props) {
    super(props)
    this.state = {
      navState: {
        permissions: null,
        index: 0,
        key: 'App',
        routes: [{ key: 'welcome', showBackButton: false, title: '' }]
      }
    }
    this._handleAction = this._handleAction.bind(this)
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
    BackAndroid.addEventListener('hardwareBackPress',
      () => this.handleBackAction())
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress',
      () => this.handleBackAction())
  }

  render() {
    return (
      <NavigationCardStack
        navigationState={this.state.navState}
        onNavigate={this._handleAction.bind(this)}
        renderScene={this._renderScene.bind(this)}
        />
    )
  }

  _push(key) {

  }

  _renderScene(props) {
    const key = props.scene.route.key

    switch (key) {
      case 'welcome':
        return (
          <Welcome nav={this._handleAction} />
        )
      case 'bluetooth':
        return (
          <Bluetooth nav={this._handleAction} />
        )
      case 'summary':
        return (
          <Summary nav={this._handleAction} />
        )
    }
  }
}


const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(Intro)