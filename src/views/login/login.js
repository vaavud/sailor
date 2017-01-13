// @flow
'use strict'

import React, {
  Component
} from 'react'

import {
  View,
  Image,
  TextInput,
  Button,
  StyleSheet,
  Dimensions
} from 'react-native'

const { height } = Dimensions.get('window')

export default class LoginView extends Component {

  constructor(props){
    super(props)
  }

  render(){
    return (
      <View style={s.container}>
        <TextInput
          style={s.input}
          placeholder={'Email'} />
        <TextInput
          style={s.input}
          placeholder={'Password'} />
        <Button
          style={s.button}
          title={'Login'}
          onPress={() => {console.log('test function')}} />
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 30,
    paddingTop: height * 0.35,
    backgroundColor: 'blue'
  },
  input: {
    marginVertical: 10
  },
  button: {
    margin: 20
  }
})
