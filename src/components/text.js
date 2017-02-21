// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  Text,
  Platform,
  StyleSheet
} from 'react-native'

const isIOS = Platform.OS === 'ios'

import Colors from '../../assets/colorTheme'


class SmallText extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.small, style]} >
        {textContent}
      </Text>
    )
  }
}

class SmallBold extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    style: PropTypes.number
  }

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.smallBold, style]} >
        {textContent}
      </Text>
    )
  }
}


class NormalText extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.normal, style]} >
        {textContent}
      </Text>
    )
  }
}

class NormalLight extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.normalLight, style]} >
        {textContent}
      </Text>
    )
  }
}

class NormalBold extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.normalBold, style]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingText extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.large, style]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingLight extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.largeLight, style]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingBold extends Component {

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[textStyle.largeBold, style]} >
        {textContent}
      </Text>
    )
  }
}

const textStyle = {
  small: {
    fontSize: 12,
    fontFamily: isIOS ? 'OpenSans' : 'Roboto-Regular',
    color: Colors.textColor
  },
  smallBold: {
    fontSize: 12,
    fontFamily: isIOS ? 'OpenSans-Bold' : 'Roboto-Bold',
  },
  normal: {
    fontSize: 16,
    fontFamily: isIOS ? 'OpenSans' : 'Roboto-Regular',
    color: Colors.textColor
  },
  normalLight: {
    fontSize: 16,
    fontFamily: isIOS ? 'OpenSans-Light' : 'Roboto-Light',
    color: Colors.textColor
  },
  normalBold :{
    fontSize: 16,
    fontFamily: isIOS ? 'OpenSans-Bold' : 'Roboto-Bold',
    color: Colors.textColor
  },
  large: {
    fontSize: 24,
    fontFamily: isIOS ? 'OpenSans' : 'Roboto-Regular',
    color: Colors.textColor
  },
  largeLight: {
    fontSize: 24,
    fontFamily: isIOS ? 'OpenSans-Light' : 'Roboto-Light',
    color: Colors.textColor
  },
  largeBold: {
    fontSize: 24,
    fontFamily: isIOS ? 'OpenSans-Bold' : 'Roboto-Bold',
    color: Colors.textColor
  },
}

export {
  SmallText,
  SmallBold,
  NormalText,
  NormalLight,
  NormalBold,
  HeadingText,
  HeadingLight,
  HeadingBold,
  textStyle
}
