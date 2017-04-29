'use strict'
import React, { Component } from 'react'
import {
  View
} from 'react-native'
import { Newsfeed, MapHarbor, WindHarbor } from './newsfeed'
import Map from './map'
import History from './history'
import Settings from './settings'
import Summary from './summary'
import Dommy from './dommy'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoonConfig from '../../reactcommon/components/selection.json'
import Colors from '../../../assets/colorTheme'

const VaavudIcon = createIconSetFromIcoMoon(icoMoonConfig)

import { TabNavigator, StackNavigator } from 'react-navigation'

const MainFlow = TabNavigator({
  Newsfeed: { screen: Newsfeed },
  Map: { screen: Map },
  ' ': { screen: Dommy },
  History: { screen: History },
  Settings: { screen: Settings },
}, {
    lazyLoad: true,
    tabBarOptions: {
      activeTintColor: '#D12A2f',
      test: () => { console.log('asdasdas') }
    }
  })


const SailorMain = (props) => {
  console.log(props)
  return (
    <View style={{ flex: 1 }} >
      <MainFlow screenProps={props} />
      <View
        style={{ backgroundColor: Colors.vaavudBlue, position: 'absolute', bottom: -20, height: 80, width: 80, alignItems: 'center', alignSelf: 'center', borderRadius: 40, paddingTop: 20 }}
        pointerEvents={'box-none'}>
        <VaavudIcon name="logo" size={30} color="white" />
      </View >
    </View>
  )
}


const SecondFlow = StackNavigator({
  Home: {
    screen: SailorMain
  },
  MapHarbor: { screen: MapHarbor },
  WindHarbor: { screen: WindHarbor },
  Summary: { screen: Summary },
}, {
    headerMode: 'screen',
    navigationOptions: {
      headerVisible: false,
    }
  })



export default SecondFlow







/*

import {
          BackAndroid,
        View,
  NavigationExperimental
} from 'react-native'

import React, {Component} from 'react'
import {bindActionCreators} from 'redux'

import {connect} from 'react-redux'
import VaavudNavigator from '../../navigator/vaavudNavigator'


const {
          StateUtils: NavigationStateUtils,
} = NavigationExperimental

let previousKey = 'newsfeed'


function createAppNavigationState() {
  return {
          // Three tabs.
          tabs: {
          index: 0,
      routes: [
        {key: 'newsfeed' },
        {key: 'map' },
        {key: 'measure' },
        {key: 'history' },
        {key: 'settings' },
      ],
    },
    newsfeed: {
          index: 0,
      routes: [{key: 'newsfeed' }],
    },
    map: {
          index: 0,
      routes: [{key: 'map' }],
    },
    measure: {
          index: 0,
      routes: [{key: 'measure' }],
    },
    history: {
          index: 0,
      routes: [{key: 'history' }],
    },
    settings: {
          index: 0,
      routes: [{key: 'settings' }],
    },
  }
}


// Next step.
// Define what app navigation state shall be updated.
function updateAppNavigationState(state, action) {
          let { type } = action
  if (type === 'BackAction' || type === 'back') {
          type = 'pop'
        }

        switch (type) {
    case 'push': {
      // Push a route into the scenes stack.
      try {
        const route = action.route
        const {tabs} = state
        const tabKey = tabs.routes[tabs.index].key
        const scenes = state[tabKey]
        const nextScenes = NavigationStateUtils.push(scenes, route)

        if (scenes !== nextScenes) {
          return {
          ...state,
        [tabKey]: nextScenes,
          }
        }
      }
      catch (err) {
        return state
      }

      break
    }

    case 'popToRoot': {

      // Pops a route from the scenes stack.
      const {tabs} = state
      const tabKey = tabs.routes[tabs.index].key
      if (tabKey !== 'measure') {
        const scenes = state[tabKey]
        const nextScenes = NavigationStateUtils.reset(scenes, [scenes.routes[0]], 0)

        if (scenes !== nextScenes) {
          return {
          ...state,
        [tabKey]: nextScenes,
          }
        }
      }
      else {
          action.tabKey = previousKey
        }
        break
    }
    case 'pop': {

      // Pops a route from the scenes stack.
      const {tabs} = state
      const tabKey = tabs.routes[tabs.index].key
      if (tabKey !== 'measure') {
        const scenes = state[tabKey]
        const nextScenes = NavigationStateUtils.pop(scenes)

        if (scenes !== nextScenes) {
          return {
          ...state,
        [tabKey]: nextScenes,
          }
        }
      }
      else {
          action.tabKey = previousKey
        }
        break
    }
    case 'selectTab': {
      // Switches the tab.
      const tabKey = action.tabKey
      previousKey = state.tabs.routes[state.tabs.index].key
      const scenes = state[previousKey]
      var nextScenes = scenes

      let _state = {...state}

        if (previousKey === 'measure') {
          _state.measure.index = 0
        _state.measure.routes = [{key: 'measure' }]
      }

      const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey)
      if (tabs !== state.tabs) {
        return {
          ..._state,
        tabs,
          [previousKey]: nextScenes,
        }
      }
    }
  }
  return state
}

class Main extends Component {

          constructor(props) {
        super(props)

    // this.state = {
          //   ...this.props.profile,
          //   email: '',
          //   navState: {
          //     permissions: null,
          //     index: 0,
          //     key: 'App',
          //     routes: [{ key: 'login', showBackButton: false, title: '' }]
          //   }
          this.state = createAppNavigationState()
    this._navigate = this._navigate.bind(this)

  }

  _navigate(action) {
    if (action.type === 'exit') {
          // Exits the example. `this.props.onExampleExit` is provided
          // by the UI Explorer.
          this.props.onExampleExit && this.props.onExampleExit()
      return
        }

    const state = updateAppNavigationState(
      this.state,
      action,
    )

    // `updateAppNavigationState` (which uses NavigationStateUtils) gives you
    // back the same `state` if nothing has changed. You could use
    // that to avoid redundant re-rendering.
    if (this.state !== state) {
          this.setState(state)
        }
        }

  render() {
    return (
      <VaavudNavigator
          appNavigationState={this.state}
          navigate={this._navigate}
        />
        )
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


export default connect(mapReduxStoreToProps, mapDispatchToProps)(Main)*/
