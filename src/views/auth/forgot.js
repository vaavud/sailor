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
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native'

import Button from '../../reactcommon/components/button'
import Colors from '../../reactcommon/colors'

const {width, height} = Dimensions.get('window')

const loginLogo = require('../../../assets/logo-login.png')
const emailIcon = require('../../../assets/envelope.png')
const backButtonIcon = require('../../../assets/back.png')

export default class ForgotView extends Component{

  static propTypes = {
    onPressSendResetLink: PropTypes.func.isRequired,
    onPressBack: PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      email: ''
    }
    this._handleEmailInput = this._handleEmailInput.bind(this)
  }

  _handleEmailInput(event){
    this.setState({email: event})
  }

  _handlePressSend(){
    // TODO
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

  _renderText(){
    return (
      <View style={style.textContainer} >
        <Text style={style.text} >{'Did you forget your password?'}</Text>
        <Text style={style.text}>{'Enter you email and we will send you a link to reset your password'}</Text>
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
          this._handlePressSend()
        }} />
      </View>
    )
  }

  _renderButton(){
    return (
      <View style={style.buttonContainer} >
        <Button buttonStyle={style.button} />
      </View>
    )
  }

  render(){
    return (
      <View style={style.container}>
        {this._renderBackButton()}
        <Image style={style.logo}
        source={loginLogo}/>
        {this._renderText()}
        {this._renderEmailField()}
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
  buttonContainer:{
    marginTop: 30,
  },
  textContainer:{
    paddingHorizontal: 20,
    marginVertical: 20
  },
  text:{
    fontSize: 14,
    textAlign: 'center',
    color: 'white'
  },
  buttonText: {
    fontSize: 16,
    textAlign:'center',
    color: 'black'
   }
})
