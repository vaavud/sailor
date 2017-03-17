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
  Linking,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'

import Button from '../../reactcommon/components/button'
import Colors from '../../../assets/colorTheme'
import I18n from '../../components/i18n'
import LoadingModal from '../../components/loadingModal'
import { textStyle } from '../../components/text'

const {width, height} = Dimensions.get('window')

var backgroundImage
var loginLogo
var loginInputLogo
var passwordInputLogo
var emailIcon
var backButtonIcon

export default class SignupView extends Component {

  static propTypes = {
    onPressSignup: PropTypes.func.isRequired,
    onPressBack: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPW: '',
      keyboardShown: false,
      isLoading: false
    }
    this._handleFirstNameInput = this._handleFirstNameInput.bind(this)
    this._handleLastNameInput = this._handleLastNameInput.bind(this)
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._handlePasswordInput = this._handlePasswordInput.bind(this)
    this._handleConfirmPWInput = this._handleConfirmPWInput.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._handleStartShouldSetResponderCapture = this._handleStartShouldSetResponderCapture.bind(this)
  }

  componentWillMount(){
    backgroundImage = require('../../../assets/images/signup-image.png')
    loginLogo = require('../../../assets/icons/logo.png')
    loginInputLogo = require('../../../assets/icons/profile.png')
    passwordInputLogo = require('../../../assets/icons/unlock.png')
    emailIcon = require('../../../assets/icons/envelope.png')
    backButtonIcon = require('../../../assets/icons/back-arrow.png')
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow () {
    this.setState({keyboardShown: true})
  }

  _keyboardDidHide () {
    this.setState({keyboardShown: false})
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
    this.setState({isLoading: true})
    this.props.onPressSignup(firstName, lastName, email, password, confirmPW)
  }

  _handleStartShouldSetResponderCapture(evt){
    return this.state.keyboardShown
  }

  _handleResponderRelease(evt){
    Keyboard.dismiss()
  }

  _handleClickLink(link){
    Linking.canOpenURL(link).then(
      Linking.openURL(link),
      //TODO handle reject
    ).catch((error) => {
      //TODO error handling
    })
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
          source={loginInputLogo}/>
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
          source={loginInputLogo}/>
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
          source={emailIcon}/>
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
          source={passwordInputLogo}/>
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
          source={passwordInputLogo}/>
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
        <Button buttonStyle={style.signupButton}
          textStyle={style.buttonText}
          title={I18n.t('createAccount')}
          onPress={() => this._handleSignupPress()} />
      </View>
    )
  }

  _renderTermsAndPrivacy(){
    return (
      <View style={style.termsContainer}>
        <Button buttonStyle={style.termsButton}
          textStyle={style.termsButtonText}
          title={I18n.t('termsButton')}
          onPress={() => this._handleClickLink('https://vaavud.com/terms/')} />
        <Button buttonStyle={style.termsButton}
          textStyle={style.termsButtonText}
          title={I18n.t('privacyButton')}
          onPress={() => this._handleClickLink('https://vaavud.com/privacy-policy/')} />
      </View>
    )
  }

  render(){
    return (
      <Image style={style.container}
        source={backgroundImage}
        onStartShouldSetResponderCapture={this._handleStartShouldSetResponderCapture}
        onResponderRelease={this._handleResponderRelease}>
        {this._renderBackButton()}
        <Image style={style.logo}
          source={loginLogo}
          onStartShouldSetResponderCapture={this._handleStartShouldSetResponderCapture}
          onResponderRelease={this._handleResponderRelease}/>
        {this._renderInputFields()}
        {this._renderSignupButton()}
        {this._renderTermsAndPrivacy()}
        <LoadingModal isActive={this.state.isLoading}
          message={'Processing request...'} />
      </Image>
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
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
    paddingTop: height * 0.1,
    paddingBottom: Platform.OS === 'ios' ? 0 : 30
  },
  backButtonStyle:{
    position: 'absolute',
    top: 30,
    left: 20,
  },
  logo: {
    alignSelf:'center',
    marginBottom: 25
  },
  inputLogo:{
    marginTop: 15,
    marginLeft: 5
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(255, 255, 255, .3)',
    borderBottomWidth: 1
  },
  input:{
    flex: 1,
    margin: 5,
    marginLeft: 10,
    paddingTop: 15,
    height: 40,
    color: Colors.inputTextColor,
  },
  buttonContainer:{
    marginTop: 10,
  },
  signupButton: {
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
    fontSize: 14,
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
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  termsButtonText: {
    ...textStyle.normal,
    fontSize: 14,
    textAlign: 'right',
    color: 'white',
    backgroundColor: 'transparent'
  }
})
