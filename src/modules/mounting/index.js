import React, {
  Component } from 'react'

import {
  BackAndroid,
  NavigationExperimental,
} from 'react-native'

// import { connect } from 'react-redux'

import Intro from './intro'
import Mounting from './mounting'
import Calibrate from './calibrate'
import Result from './result'

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
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
        return NavigationStateUtils.push(currentState, { key: action.key, title: action.title, showBackButton: action.showBackButton, props: { ...action.props } })
      case 'pop':
        return currentState.index > 0 ? NavigationStateUtils.pop(currentState) : currentState
      default:
        return currentState
    }
  }
}

class Header extends Component {
  _back = () => {
    this.props.navigate({type: 'pop'})
  }
  _renderTitleComponent = (props) => {
    return (
      <NavigationHeader.Title>
        {props.scene.route.key}
      </NavigationHeader.Title>
    )
  }
  render() {
    return (
      <NavigationHeader
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        onNavigateBack={this._back}
      />
    )
  }
}


class MountingGuide extends Component {

  constructor(props) {
    super(props)
    this.state = {
      navState: {
        index: 0,
        key: 'App',
        routes: [{ key: 'intro', showBackButton: false, title: '' }]
      }
    }
    this._handleAction = this._handleAction.bind(this)
  }

  _handleAction = (action) => {
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
    BackAndroid.addEventListener('hardwareBackPress',this.handleBackAction)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress',this.handleBackAction)
  }

  _renderHeader = (sceneProps) => {
  return (
    <Header
      navigate={this._handleAction}
      {...sceneProps}
    />
  )
}

  render() {
    return (
      <NavigationCardStack
        renderHeader={this._renderHeader}
        navigationState={this.state.navState}
        onNavigate={this._handleAction.bind(this)}
        renderScene={this._renderScene.bind(this)}
      />
    )
  }

  _renderScene(props) {
    const key = props.scene.route.key
    const propsComponent = props.scene.route.props
    switch (key) {
      case 'intro':
        return <Intro { ...propsComponent } nav={this._handleAction} />
      case 'mounting':
        return <Mounting { ...propsComponent } nav={this._handleAction} />
      case 'calibrate':
        return <Calibrate { ...propsComponent } nav={this._handleAction} />
      case 'result':
        return <Result { ...propsComponent } nav={this._handleAction} />
      default: return null
    }
  }


}

export default MountingGuide
