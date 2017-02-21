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
  Keyboard,
  StyleSheet,
  Dimensions
} from 'react-native'

import Button from '../../reactcommon/components/button'
import Colors from '../../../assets/colorTheme'

import { textStyle } from '../../components/text'
import I18n from '../../components/i18n'

const {width, height} = Dimensions.get('window')

const loginImage = require('../../../assets/images/login-image.png')

const loginLogo = require('../../../assets/logo-login.png')
const loginInputLogo = require('../../../assets/profile.png')
const passwordInputLogo = require('../../../assets/unlock.png')

export default class LoginView extends Component {

  static propTypes = {
    onPressSignup: PropTypes.func.isRequired,
    onPressLogin: PropTypes.func.isRequired,
    onPressFBLogin: PropTypes.func.isRequired,
    onPressForgotPassword: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      keyboardShown: false
    }
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._handlePasswordInput = this._handlePasswordInput.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._handleStartShouldSetResponderCapture = this._handleStartShouldSetResponderCapture.bind(this)
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    this.setState({keyboardShown: true})
  }

  _keyboardDidHide () {
    this.setState({keyboardShown: false})
  }

  _handleEmailInput(event) {
    this.setState({ email: event })
  }

  _handlePasswordInput(event) {
    this.setState({ password: event })
  }

  _handleLoginPress() {
    this.props.onPressLogin(this.state.email, this.state.password)
  }

  _handleStartShouldSetResponderCapture(evt){
    return this.state.keyboardShown;
  }

  _handleResponderRelease(evt){
    Keyboard.dismiss()
  }

  _renderLogoAndText(){
    return
  }

  _renderInputFields(){
    return (
      <View>
        <View style={style.inputContainer}>
          <Image style={style.inputLogo}
            source={loginInputLogo}
            resizeMode={'contain'} />
          <TextInput style={style.input}
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
            onSubmitEditing={(event) => {
              this.SecondInput.focus()
            }} />
        </View>
        <View style={style.inputContainer}>
          <Image style={style.inputLogo}
            source={passwordInputLogo}
            resizeMode={'contain'} />
          <TextInput style={style.input}
            ref={r => { this.SecondInput = r } }
            autoFocus={false}
            autoCorrect={false}
            keyboardType="default"
            placeholder={I18n.t('passwordInput')}
            secureTextEntry={true}
            placeholderTextColor={Colors.inputTextColor}
            underlineColorAndroid="transparent"
            returnKeyType="go"
            onChangeText={this._handlePasswordInput}
            onSubmitEditing={() => this._handleLoginPress()} />
        </View>
      </View>
    )
  }

  _renderButtons(){
    return (
      <View style={style.buttonContainer}>
        <Button buttonStyle={style.loginButton}
          textStyle={style.buttonText}
          title={I18n.t('loginButton')}
          onPress={() => this._handleLoginPress()} />
        <Button buttonStyle={style.fbButton}
          textStyle={style.fbButtonText}
          title={I18n.t('facebookButton')}
          onPress={() => this.props.onPressFBLogin()} />
      </View>
    )
  }

  _renderSignup() {
    const {
      onPressSignup,
      onPressForgotPassword
    } = this.props
    return (
      <View style={style.signupContainer}>
        <Button buttonStyle={style.signupForgotButton}
          textStyle={style.forgotButtonText}
          title={I18n.t('forgotPwButton')}
          onPress={onPressForgotPassword} />
        <Button buttonStyle={style.signupForgotButton}
          textStyle={style.signupButtonText}
          title={I18n.t('signupButton')}
          onPress={onPressSignup} />
      </View>
    )
  }

  render() {
    return (
      <Image style={style.container}
        source={loginImage}
         onStartShouldSetResponderCapture={this._handleStartShouldSetResponderCapture}
         onResponderRelease={this._handleResponderRelease} >
        <Image style={{alignSelf: 'center', marginBottom: 50}}
          source={loginLogo} />
        {this._renderInputFields()}
        {this._renderButtons()}
        {this._renderSignup()}
      </Image>
    )
  }
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    flexDirection: 'column',
    padding: width * 0.1,
    paddingTop: height * 0.1,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 50
  },
  inputLogo: {
    marginTop:15,
    width: 30
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(255, 255, 255, .3)',
    borderBottomWidth: 1
  },
  input: {
    flex: 1,
    margin: 5,
    paddingTop: 15,
    height: 40,
    color: Colors.inputTextColor,
  },
  buttonContainer: {
    marginTop: 15,
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
    fontSize: 14,
    textAlign:'center',
    color: Colors.vaavudBlue
   },
   fbButtonText: {
    fontSize: 14,
    textAlign:'center',
    color: 'white'
   },
   signupContainer: {
     flex: 1,
     justifyContent: 'space-between',
   },
   signupForgotButton: {
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  signupButtonText: {
    ...textStyle.small,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white'
  },
  forgotButtonText: {
    ...textStyle.small,
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white'
  }
})
