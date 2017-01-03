'use strict'

import {
  BackAndroid,
  View,
  Image,
  Text,
  NavigationExperimental,
  TextInput,
  Dimensions,
  TouchableHighlight,
  Alert
} from 'react-native'

import React, { Component } from 'react'
import {bindActionCreators} from 'redux'

// import Button from '../reactcommon/button'
// import Colors from '../reactcommon/colors'
// import Login from './login'
// import SignUp from './signup'
// import { NormalText } from '../reactcommon/components/normalText'
// import { SmallText} from '../reactcommon/components/smallText'
// import {fonts, scalingFactors} from '../styles/fonts'
// import { resetPassword } from '../actions/auth'
import {connect} from 'react-redux'
import Button from '../../reactcommon/components/button'

const {height, width} = Dimensions.get('window')

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental

const NavReducer = createReducer({
  index: 0,
  key: 'App',
  routes: [{key: 'root',showBackButton:false}],
})

function createReducer(initialState) {
  return (currentState = initialState, action) => {
    switch (action.type) {
      case 'push':
      return NavigationStateUtils.push(currentState, {key: action.key, title: action.title, showBackButton: action.showBackButton })
      case 'pop':
      return currentState.index > 0 ? NavigationStateUtils.pop(currentState) : currentState
      default:
      return currentState
    }
  }
}


class Welcome extends Component {

  constructor(props){
    super(props)

    this.state = {
      ...this.props.profile,
      email: '',
      navState: {
        permissions: null,
        index: 0,
        key: 'App',
        routes: [{key: 'root',showBackButton:false, title:''}]
      }
    }
  }

  _handleAction (action) {
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

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress',
    () => this.handleBackAction())
  }

  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress',
    () => this.handleBackAction())
  }

  render () {
    return (
      <NavigationCardStack
      navigationState={this.state.navState}
      onNavigate={this._handleAction.bind(this)}
      renderScene={this._renderScene.bind(this)}
      />
    )
  }

  _renderScene(props) {
    const key = props.scene.route.key

    switch (key) {
      case 'root':
      return (
        <View style={{flex:1,backgroundColor:'red'}}>
          <Button title="push" buttonStyle={{marginTop:100,width:100,height:100}}
            onPress={() => {
              this._handleAction({ type: 'push', key: 'login', title:'Login', showBackButton:true })
            }} />
        </View>
      )
      case 'login':
        return(<View/>)
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


export default connect(mapReduxStoreToProps, mapDispatchToProps)(Welcome)
