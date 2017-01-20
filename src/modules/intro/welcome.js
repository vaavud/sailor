// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Button, Text, NativeModules, NativeEventEmitter
} from 'react-native'



import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Welcome extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {
    const myModuleEvt = new NativeEventEmitter(NativeModules.VaavudBle)
    
    myModuleEvt.addListener('onBleConnected', this.onBleConnected)
    myModuleEvt.addListener('onStateHasChanged', this.onStateHasChanged)
    myModuleEvt.addListener('onNewRead', this.onNewRead)
    myModuleEvt.addListener('onReadyToWork', this.onReadyToWork)

    NativeModules.VaavudBle.initBle()

  }

  componentWillUnmount() {

  }

  onStateHasChanged(status){
    console.log('status',status)
  }

  onNewRead(read){
    console.log('read',read)
  }

  onReadyToWork(){
    console.log('onReadyToWork')
  }

  onBleConnected(data) {
    console.log('callback', data)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'pink', paddingTop: 100 }} >
        <Text> Welcome </Text>
        <Button title="Connect" onPress={() => {
          NativeModules.VaavudBle.onConnect()
        } } />

        <Button title="DisConnect" onPress={() => {
          NativeModules.VaavudBle.onDisconnect()
        } } />

      </View>
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

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Welcome)
