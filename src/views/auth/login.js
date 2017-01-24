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
      password: ''
    }
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._handlePasswordInput = this._handlePasswordInput.bind(this)
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

  _handleFBLoginPress(){

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
            resizeMode={'contain'} />
          <TextInput style={style.input}
          ref="SecondInput"
          autoFocus={false}
          autoCorrect={false}
          keyboardType="default"
          placeholder={I18n.t('passwordInput')}
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
    return (
      <View style={style.buttonContainer}>
        <Button buttonStyle={style.loginButton}
        textStyle={style.buttonText}
        title={I18n.t('loginButton')}
        onPress={() => this._handleLoginPress()} />
        <Button buttonStyle={style.fbButton}
        textStyle={style.buttonText}
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
        textStyle={style.signupButtonText}
        title={I18n.t('signupButton')}
        onPress={onPressSignup} />
        <Button buttonStyle={style.signupForgotButton}
        textStyle={style.forgotButtonText}
        title={I18n.t('forgotPwButton')}
        onPress={onPressForgotPassword} />
      </View>
    )
  }

  render() {
    return (
      <View style={style.container}>
        <Image style={style.logo}
          source={loginLogo} />
        {this._renderInputFields()}
        {this._renderButtons()}
        {this._renderSignup()}
      </View>
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
    backgroundColor: 'grey'
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 50
  },
  inputLogo: {
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
    height: 40,
    backgroundColor: 'transparent'
  },
  buttonContainer: {
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
  signupButtonText: {
    fontSize: 12,
    color: 'black'
  },
  forgotButtonText: {
    fontSize: 12,
    textAlign: 'right',
    color: 'black'
  }
})
