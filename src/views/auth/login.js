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
const passwordInputLogo = require('../../../assets/unlock.png')

export default class LoginView extends Component {

  static propTypes = {
    onPressSignup: PropTypes.func.isRequired,
    onPressLogin: PropTypes.func.isRequired,
    onPressFBLogin: PropTypes.func.isRequired,
    onPressForgotPassword: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._handlePasswordInput = this._handlePasswordInput.bind(this)
  }

  _handleEmailInput(event){
    this.setState({email: event})
  }

  _handlePasswordInput(event){
    this.setState({password: event})
  }

  _handleLoginPress(){
    this.props.onPressLogin(this.state.email, this.state.password)
  }

  _renderInputFields(){
    return (
      <View>
        <View style={style.inputContainer}>
          <Image style={style.inputLogo}
          source={loginInputLogo}
          resizeMode={'contain'}/>
          <TextInput style={style.input}
          autoFocus={false}
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Your email"
          clearButtonMode="while-editing"
          placeholderTextColor="#fff"
          underlineColorAndroid="transparent"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={this._handleEmailInput}
          onSubmitEditing={(event) => {
            this.refs.SecondInput.focus()
          }} />
        </View>
        <View style={style.inputContainer}>
          <Image style={style.inputLogo}
          source={passwordInputLogo}
          resizeMode={'contain'}/>
          <TextInput style={style.input}
          ref="SecondInput"
          autoFocus={false}
          autoCorrect={false}
          keyboardType="default"
          placeholder="Your password"
          secureTextEntry={true}
          placeholderTextColor="#fff"
          underlineColorAndroid="transparent"
          returnKeyType="go"
          onChangeText={this._handlePasswordInput}
          onSubmitEditing={() => this._handleLoginPress()} />
        </View>
      </View>
    )
  }

  _renderButtons(){
    const {
      onPressFBLogin
    } = this.props
    return (
      <View style={style.buttonContainer}>
        <Button buttonStyle={style.button}
        textStyle={style.buttonText}
        title={'Login'}
        onPress={() => this._handleLoginPress()} />
        <Button buttonStyle={style.button}
        textStyle={style.buttonText}
        title={'Facebook'}
        onPress={onPressFBLogin} />
      </View>
    )
  }

  _renderSignup(){
    const {
      onPressSignup,
      onPressForgotPassword
    } = this.props
    return (
      <View style={style.signupContainer}>
        <Button buttonStyle={style.signupForgotButton}
        textStyle={style.signupButtonText}
        title={'Signup'}
        onPress={onPressSignup} />
        <Button buttonStyle={style.signupForgotButton}
        textStyle={style.forgotButtonText}
        title={'Forgot password?'}
        onPress={onPressForgotPassword} />
      </View>
    )
  }

  render(){
    return (
      <View style={style.container}>
        <Image style={style.logo}
        source={loginLogo}/>
        {this._renderInputFields()}
        {this._renderButtons()}
        {this._renderSignup()}
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
    padding: 30,
    paddingTop: height * 0.2,
    backgroundColor: 'cyan'
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
    backgroundColor: 'transparent'
  },
  buttonContainer:{
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width : width * 0.4,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    textAlign:'center',
    color: 'black'
   },
   signupContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     height: height * 0.5
   },
   signupForgotButton: {
    alignSelf: 'center',
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
