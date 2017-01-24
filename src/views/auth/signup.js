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
import Colors from '../../reactcommon/colors'
import I18n from '../../components/i18n'

const {width, height} = Dimensions.get('window')

const loginLogo = require('../../../assets/logo-login.png')
const loginInputLogo = require('../../../assets/profile.png')
const passwordInputLogo = require('../../../assets/unlock.png')
const emailIcon = require('../../../assets/envelope.png')
const backButtonIcon = require('../../../assets/back.png')

export default class LoginView extends Component {
  static propTypes = {
    onPressSignup: PropTypes.func.isRequired,
    onPressLogin: PropTypes.func.isRequired,
    onPressFBLogin: PropTypes.func.isRequired,
    onPressForgotPassword: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPW: ''
    }
    this._handleFirstNameInput = this._handleFirstNameInput.bind(this)
    this._handleLastNameInput = this._handleLastNameInput.bind(this)
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._handlePasswordInput = this._handlePasswordInput.bind(this)
    this._handleConfirmPWInput = this._handleConfirmPWInput.bind(this)    
  }

  _handleFirstNameInput(event){
    this.setState({firstName: event})
  }
  _handleLastNameInput(event){
    this.setState({lastName: event})
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
    this.props.onPressSignup()
  }

  _renderBackButton(){
    return (
      <TouchableOpacity style={style.backButtonStyle}
      onPress={this.props.onPressBack} >
      <Image
      source={backButtonIcon} />
      </TouchableOpacity>
    )
  }

  _renderFirstNameField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
        source={loginInputLogo}
        resizeMode={'contain'}/>
        <TextInput style={style.input}
        autoFocus={false}
        autoCorrect={false}
        keyboardType="default"
        placeholder="Your first name"
        clearButtonMode="while-editing"
        placeholderTextColor="#fff"
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCapitalize="default"
        onChangeText={this._handleFirstNameInput}
        onSubmitEditing={(event) => {
          this.refs.SecondInput.focus()
        }} />
      </View>
    )
  }

  _renderLastNameField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
        source={loginInputLogo}
        resizeMode={'contain'}/>
        <TextInput style={style.input}
        autoFocus={false}
        autoCorrect={false}
        keyboardType="sentences"
        placeholder="Your last name"
        clearButtonMode="while-editing"
        placeholderTextColor="#fff"
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCapitalize="default"
        onChangeText={this._handleLastNameInput}
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
        keyboardType="email-address"
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
        secureTextEntry={true}
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
        secureTextEntry={true}
        onChangeText={this._handleConfirmPWInput}
        onSubmitEditing={() => this._handleSignupPress()} />
      </View>
    )
  }
  
  _handleLoginPress(){
    this.props.onPressLogin(this.state.email, this.state.password)
  }

  _renderInputFields(){
    return (
      <View>
        {this._renderFirstNameField()}
        {this._renderLastNameField()}
        {this._renderEmailField()}
        {this._renderPasswordField()}
        {this._renderConfirmPwField()}
      </View>
    )
  }

  render(){
    return (
      <View style={style.container}>
        <Image style={style.logo}
        source={loginLogo}/>
        {this._renderInputFields()}
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
    height: 40,
    backgroundColor: 'transparent'
  },
  buttonContainer:{
    marginTop: 30,
    justifyContent: 'space-between'
  },
  loginButton: {
    width : width * 0.8 - 2,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  fbButton: {
    width : width * 0.8 - 2,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: '#3B5998',
    backgroundColor: '#3B5998',
  },
  buttonText: {
    fontSize: 16,
    textAlign:'center',
    color: Colors.blue
   },
   signupContainer: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   signupForgotButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  signupButtonText:{
    fontSize: 12,
    color: 'black'
  },
  forgotButtonText: {
    fontSize: 12,
    textAlign: 'right',
    color: 'black'
  }
})
