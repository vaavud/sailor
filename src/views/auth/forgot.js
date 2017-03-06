// @flow

'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  Alert,
  View,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native'

import I18n from '../../components/i18n'

import Button from '../../reactcommon/components/button'
import Colors from '../../../assets/colorTheme'

import { forgotPassword } from '../../actions/auth'


const {width, height} = Dimensions.get('window')

var backgroundImage
var loginLogo
var emailIcon
var backButtonIcon

export default class ForgotView extends Component {

  static propTypes = {
    onPressSendResetLink: PropTypes.func.isRequired,
    onPressBack: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      keyboardShown: false,
      isLoading: false
    }
    this._handleEmailInput = this._handleEmailInput.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._handlePressSend = this._handlePressSend.bind(this)
    this._handleStartShouldSetResponderCapture = this._handleStartShouldSetResponderCapture.bind(this)
  }

  componentWillMount() {
    backgroundImage = require('../../../assets/images/forgot-image.png')
    loginLogo = require('../../../assets/icons/logo.png')
    emailIcon = require('../../../assets//icons/envelope.png')
    backButtonIcon = require('../../../assets/icons/back-arrow.png')
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _handleEmailInput(event) {
    this.setState({ email: event })
  }

  _handlePressSend() {
    forgotPassword(this.state.email).then(() => {
      Alert.alert('Passord reset', 'Please check you email', [{text: 'OK', onPress: () => {
        this.props.onPressBack
      }
    }])
    }).catch(error => {
      this.props.showError({title: 'Password reset', msg: 'There was problem resseting your password. Make sure you are using the correct email'})
    })
  }

  _keyboardDidShow() {
    this.setState({ keyboardShown: true })
  }

  _keyboardDidHide() {
    this.setState({ keyboardShown: false })
  }

  _handleStartShouldSetResponderCapture(evt) {
    return this.state.keyboardShown
  }

  _handleResponderRelease(evt) {
    Keyboard.dismiss()
  }

  _renderBackButton() {
    return (
      <TouchableOpacity style={style.backButtonStyle}
        onPress={this.props.onPressBack} >
        <Image
          source={backButtonIcon} />
      </TouchableOpacity>
    )
  }

  _renderText() {
    return (
      <View style={style.textContainer} >
        <Text style={style.text}>
          {I18n.t('forgetText')}
        </Text>
        <Text style={style.text}>
          {I18n.t('resetText')}
        </Text>
      </View>
    )
  }

  _renderEmailField() {
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
          source={emailIcon}
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
          onSubmitEditing={this._handlePressSend} />
      </View>
    )
  }

  _renderButton() {
    return (
      <View style={style.buttonContainer}>
        <Button buttonStyle={style.button}
          textStyle={style.buttonText}
          title={I18n.t('sendResetlink')}
          onPress={this._handlePressSend} />
      </View>
    )
  }

  render() {
    return (
      <Image style={style.container}
        source={backgroundImage}
        onStartShouldSetResponderCapture={this._handleStartShouldSetResponderCapture}
        onResponderRelease={this._handleResponderRelease}>
        {this._renderBackButton()}
        <Image style={style.logo}
          source={loginLogo}
          onStartShouldSetResponderCapture={this._handleStartShouldSetResponderCapture}
          onResponderRelease={this._handleResponderRelease} />
        {this._renderText()}
        {this._renderEmailField()}
        {this._renderButton()}
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
  backButtonStyle: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 5
  },
  inputLogo: {
    marginTop: 15,
    marginLeft: 5
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
    marginLeft: 10,
    paddingTop: 15,
    height: 40,
    color: Colors.inputTextColor,
  },
  button: {
    width: width * 0.8 - 2,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 15,
  },
  buttonContainer: {
    marginTop: 30,
  },
  textContainer: {
    paddingHorizontal: 20,
    marginVertical: 20
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
