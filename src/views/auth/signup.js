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
  TouchableOpacity,
  Dimensions
} from 'react-native'

import Button from '../../reactcommon/components/button'
import Colors from '../../../assets/colorTheme'
import I18n from '../../components/i18n'

const {width, height} = Dimensions.get('window')

const loginLogo = require('../../../assets/logo-login.png')
const loginInputLogo = require('../../../assets/profile.png')
const passwordInputLogo = require('../../../assets/unlock.png')
const emailIcon = require('../../../assets/envelope.png')
const backButtonIcon = require('../../../assets/back.png')

export default class SignupView extends Component {

  static propTypes = {
    onPressSignup: PropTypes.func.isRequired,
    onPressBack: PropTypes.func.isRequired,
    onPressTerms: PropTypes.func.isRequired,
    onPressPrivacy: PropTypes.func.isRequired
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
    const {
      firstName, 
      lastName,
      email,
      password,
      confirmPW
    } = this.state
    this.props.onPressSignup(firstName, lastName, email, password, confirmPW)
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
          placeholder={I18n.t('firstNameInput')}
          clearButtonMode="while-editing"
          placeholderTextColor={Colors.inputTextColor}
          underlineColorAndroid="transparent"
          returnKeyType="next"
          onChangeText={this._handleFirstNameInput}
          onSubmitEditing={() => this.secondInput.focus()}/>
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
          ref={r => { this.secondInput = r } }
          autoFocus={false}
          autoCorrect={false}
          placeholder={I18n.t('lastNameInput')}
          clearButtonMode="while-editing"
          placeholderTextColor={Colors.inputTextColor}
          underlineColorAndroid="transparent"
          returnKeyType="next"
          onChangeText={this._handleLastNameInput}
          onSubmitEditing={() => this.thirdInput.focus()} />
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
          ref={ r => {this.thirdInput = r} }
          autoFocus={false}
          autoCorrect={false}
          keyboardType="email-address"
          placeholder={I18n.t('emailInput')}
          clearButtonMode="while-editing"
          placeholderTextColor={Colors.inputTextColor}
          underlineColorAndroid="transparent"
          returnKeyType="next"
          autoCapitalize="none"
          onChangeText={this._handleEmailInput}
          onSubmitEditing={() => this.fourthInput.focus()} />
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
          ref={ r => {this.fourthInput = r} }
          autoFocus={false}
          autoCorrect={false}
          keyboardType="default"
          placeholder={I18n.t('passwordInput')}
          clearButtonMode="while-editing"
          placeholderTextColor={Colors.inputTextColor}
          underlineColorAndroid="transparent"
          returnKeyType="next"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={this._handlePasswordInput}
          onSubmitEditing={() => this.fifthInput.focus()} />
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
          ref={ r  => {this.fifthInput = r} }
          autoFocus={false}
          autoCorrect={false}
          keyboardType="default"
          placeholder={I18n.t('confirmPwInput')}
          clearButtonMode="while-editing"
          placeholderTextColor={Colors.inputTextColor}
          underlineColorAndroid="transparent"
          returnKeyType="next"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={this._handleConfirmPWInput}
          onSubmitEditing={() => this._handleSignupPress()} />
      </View>
    )
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

  _renderSignupButton(){
    return (
      <View style={style.buttonContainer}>
        <Button buttonStyle={style.loginButton}
          textStyle={style.buttonText}
          title={I18n.t('signupButton')}
          onPress={() => this._handleSignupPress()} />
      </View>
    )
  }

  _renderTermsAndPrivacy(){
    const {
      onPressTerms,
      onPressPrivacy
    } = this.props
    return (
      <View style={style.termsContainer}>
        <Button buttonStyle={style.termsButton}
          textStyle={style.termsButtonText}
          title={I18n.t('termsButton')}
          onPress={onPressTerms} />
        <Button buttonStyle={style.termsButton}
          textStyle={style.termsButtonText}
          title={I18n.t('privacyButton')}
          onPress={onPressPrivacy} />
      </View>
    )
  }

  render(){
    return (
      <View style={style.container}>
        {this._renderBackButton()}
        <Image style={style.logo}
          source={loginLogo}/>
        {this._renderInputFields()}
        {this._renderSignupButton()}
        {this._renderTermsAndPrivacy()}
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
    backgroundColor: Colors.background
  },
  backButtonStyle:{
    position: 'absolute',
    top: 20,
    left: 20,
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
    backgroundColor: 'transparent',
    color: Colors.inputTextColor
  },
  buttonContainer:{
    marginTop: 30,
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
  buttonText: {
    fontSize: 16,
    textAlign:'center',
    color: Colors.vaavudBlue
   },
   termsContainer: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   termsButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  termsText:{
    fontSize: 12,
    color: Colors.textColor
  },
  termsButtonText: {
    fontSize: 12,
    textAlign: 'right',
    color: Colors.textColor
  }
})
