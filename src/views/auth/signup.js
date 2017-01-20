// @flow

'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions
} from 'react-native'

import Button from '../../reactcommon/components/button'

const {width, height} = Dimensions.get('window')

const loginLogo = require('../../../assets/logo-login.png')
const loginInputLogo = require('../../../assets/profile.png')
const emailIcon = require('../../../assets/envelope.png')
const passwordInputLogo = require('../../../assets/unlock.png')

export default class SignupView extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPW: ''
    }
    this._handleUsernameInput = this._handleUsernameInput.bind(this)
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._handlePasswordInput = this._handlePasswordInput.bind(this)
    this._handleConfirmPWInput = this._handleConfirmPWInput.bind(this)
  }

  _handleUsernameInput(event){
    this.setState({username: event})
  }

  _handleEmailInput(event){
    this.setState({email: event})
  }

  _handlePasswordInput(event){
    this.setState({password: event})
  }

  _handleConfirmPWInput(event){
    this.setState({confirmPW: event})
  }
  
  _handleSignupPress(){
    console.log('signup pressed =)', this.state)
  }

  _renderUsernameField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
        source={loginInputLogo}
        resizeMode={'contain'}/>
        <TextInput style={style.input}
        autoFocus={false}
        autoCorrect={false}
        keyboardType="default"
        placeholder="Your name"
        clearButtonMode="while-editing"
        placeholderTextColor="#fff"
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCapitalize="none"
        onChangeText={this._handleUsernameInput}
        onSubmitEditing={(event) => {
          this.refs.SecondInput.focus()
        }} />
      </View>
    )
  }

  _renderEmailField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
        source={emailIcon}
        resizeMode={'contain'}/>
        <TextInput style={style.input}
        ref="SecondInput"
        autoFocus={false}
        autoCorrect={false}
        keyboardType="default"
        placeholder="Enter e-mail"
        clearButtonMode="while-editing"
        placeholderTextColor="#fff"
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCapitalize="none"
        onChangeText={this._handleEmailInput}
        onSubmitEditing={(event) => {
          this.refs.ThirdInput.focus()
        }} />
      </View>
    )
  }

  _renderPasswordField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
        source={passwordInputLogo}
        resizeMode={'contain'}/>
        <TextInput style={style.input}
        ref="ThirdInput"
        autoFocus={false}
        autoCorrect={false}
        keyboardType="default"
        placeholder="Password"
        clearButtonMode="while-editing"
        placeholderTextColor="#fff"
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCapitalize="none"
        onChangeText={this._handlePasswordInput}
        onSubmitEditing={(event) => {
          this.refs.FourthInput.focus()
        }} />
      </View>
    )
  }

  _renderConfirmPwField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
        source={passwordInputLogo}
        resizeMode={'contain'}/>
        <TextInput style={style.input}
        ref="FourthInput"
        autoFocus={false}
        autoCorrect={false}
        keyboardType="default"
        placeholder="Confirm password"
        clearButtonMode="while-editing"
        placeholderTextColor="#fff"
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCapitalize="none"
        onChangeText={this._handleConfirmPWInput}
        onSubmitEditing={(event) => this._handleSignupPress()} />
      </View>
    )
  }

  _renderInputFields(){
    return (
      <View>
        {this._renderUsernameField()}
        {this._renderEmailField()}
        {this._renderPasswordField()}
        {this._renderConfirmPwField()}
      </View>
    )
  }

  _renderSignupButtton(){
    return (
      <View>
        <Button buttonStyle={style.button}
        textStyle={style.buttonText}
        title={'Signup'} />
      </View>
    )
  }

  render(){
    return (
      <View style={style.container}>
        <Image style={style.logo}
        source={loginLogo}/>
        {this._renderInputFields()}
        {this._renderSignupButtton()}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    flexDirection: 'column',
    padding: width * 0.1,
    paddingTop: height * 0.1,
    backgroundColor: 'grey'
  },
  logo: {
    alignSelf:'center',
    marginBottom: 50
  },
  inputLogo:{
    width: 30
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(255, 255, 255, .3)',
    borderBottomWidth: 1
  },
  input:{
    flex: 1,
    height: 50,
    backgroundColor: 'transparent'
  },
  button: {
    width: width * 0.8 - 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    textAlign:'center',
    color: 'black'
   }
})
