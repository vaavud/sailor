'use strict'

import React, { Component, PropTypes } from 'react'

import {
  BackAndroid,
  NavigationExperimental,
  StyleSheet,
  View,
  NativeModules,
  Platform,
  StatusBar
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental

// import LinearGradient from 'react-native-linear-gradient'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import {routes} from '../routes'

import VaavudScene from './vaavudScene'
import VaavudHeader from './header'
import Tab from './tab'
// import VaavudActionButton from '../reactcommon/components/vaavudActionButton'
// import {saveSubscription} from '../actions/newsfeed'
// import {log} from '../actions/amplitude'



class VaavudNavigator extends Component {

  static propTypes = {
    appNavigationState: PropTypes.shape({
      newsfeed: NavigationPropTypes.navigationState.isRequired,
      history: NavigationPropTypes.navigationState.isRequired,
      measure: NavigationPropTypes.navigationState.isRequired,
      map: NavigationPropTypes.navigationState.isRequired,
      settings: NavigationPropTypes.navigationState.isRequired,
      tabs: NavigationPropTypes.navigationState.isRequired,
    }),
    navigate: PropTypes.func.isRequired
  }

  // This sets up the methods (e.g. Pop, Push) for navigation.
  constructor(props, context) {
    super(props, context)
    this._back = this._back.bind(this)
    this._renderHeader = this._renderHeader.bind(this)
    this._renderScene = this._renderScene.bind(this)
    this.state = { currentScene: 'scene_newsfeed' }

  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => { return this._handleAndroidBack() })
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', () => { return this._handleAndroidBack() })
  }

  _handleAndroidBack() {
    const {appNavigationState} = this.props
    const {tabs} = appNavigationState
    const tabKey = tabs.routes[tabs.index].key
    const scenes = appNavigationState[tabKey]
    if (scenes.index > 0) {
      this._back()
      return true
    }
    else {
      return false
    }
  }


  // Now use the `NavigationCardStack` to render the scenes.
  render() {
    const {appNavigationState} = this.props
    const {tabs} = appNavigationState
    const tabKey = tabs.routes[tabs.index].key
    const scenes = appNavigationState[tabKey]
    var _tabs = (key) => {
      if (key !== 'measure') {
        if (scenes.routes.length > 1) {
          return null
        }
        else {
          return (
            <View style={{ backgroundColor: 'red', flexDirection: 'row' }}>
              {tabs.routes.map(this._renderTab, this)}
            </View>
          )
        }
      }
      else {
        return null
      }
    }

    // var _tabsM = (key) => {
    //   if (key !== 'measure') {
    //     if (scenes.routes.length > 1) {
    //       return null
    //     }
    //     else {
    //       return (
    //         null
    //       )
    //     }
    //   }
    //   else {
    //     return null
    //   }
    // }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          />
        <NavigationCardStack
          key={'stack_' + tabKey}
          onNavigateBack={this._back}
          onNavigate={this._back}
          navigationState={scenes}
          renderHeader={this._renderHeader}
          renderScene={this._renderScene}
          cardStyle={{ backgroundColor: '#282F36' }}

          />
        {_tabs(tabKey)}
      </View>
    )
  }

  // Render the header.
  // The detailed spec of `sceneProps` is defined at `NavigationTypeDefinition`
  // as type `NavigationSceneRendererProps`.
  _renderHeader(sceneProps) {
    if (sceneProps.scene.key === 'scene_summary' || sceneProps.scene.key === 'scene_web' || sceneProps.scene.key === 'scene_shop') {
      return (<VaavudHeader
        {...sceneProps}
        back={this._back}
        />)
    }
    else { return null }
  }


  _renderTab(route, index) {
    const {appNavigationState} = this.props
    const {tabs} = appNavigationState

    return (
      <Tab
        navigate={this.props.navigate}
        key={route.key}
        route={route}
        selected={tabs.index === index}
        />
    )
  }

  // Render a scene for route.
  // The detailed spec of `sceneProps` is defined at `NavigationTypeDefinition`
  // as type `NavigationSceneRendererProps`.
  _renderScene(sceneProps) {

    return (
      <VaavudScene
        {...sceneProps}
        onPop={this._back}
        navigate={this.props.navigate}
        />
    )
  }

  _back(toRoot) {
    const {appNavigationState} = this.props
    const {tabs} = appNavigationState
    const tabKey = tabs.routes[tabs.index].key
    // const scenes = appNavigationState[tabKey]
    // console.log(tabKey)
    if (tabKey === 'measure') {
      // this.props.navigate({type: 'pop'});
      this.props.navigate({ type: 'selectTab', tabKey: 'history' })
    }
    else {
      if (toRoot) {
        this.props.navigate({ type: 'popToRoot' })
      }
      else {
        this.props.navigate({ type: 'pop' })
      }

    }
    // this.props.navigate({type: 'pop'});
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

export default connect(mapReduxStoreToProps, mapDispatchToProps)(VaavudNavigator)
