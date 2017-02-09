// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  Text,
  StyleSheet
} from 'react-native'

import Colors from '../../assets/colorTheme'


class SmallText extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.small, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

class SmallBold extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.smallSemibold, customStyle]} >
        {textContent}
      </Text>
    )
  }
}


class NormalText extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.normal, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

class NormalLight extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.normalLight, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

class NormalBold extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.normalBold, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingText extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.large, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingLight extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.largeLight, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingBold extends Component {

  static propTypes = {
    textContent: PropTypes.string.isRequired,
    customStyle: PropTypes.number
  }

  render(){
    const {
      textContent,
      customStyle
    } = this.props
    return (
      <Text style={[s.largeBold, customStyle]} >
        {textContent}
      </Text>
    )
  }
}

const s = StyleSheet.create({
  small: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: Colors.textColor
  },
  SmallBold: {
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
  normal: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.textColor
  },
  normalLight: {
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    color: Colors.textColor
  },
  normalBold :{
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: Colors.textColor
  },
  large: {
    fontSize: 24,
    fontFamily: 'Roboto-Regular',
    color: Colors.textColor
  },
  largeLight: {
    fontSize: 24,
    fontFamily: 'Roboto-Light',
    color: Colors.textColor
  },
  largeBold: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: Colors.textColor
  },
})

export {
  SmallText,
  SmallBold,
  NormalText,
  NormalLight,
  NormalBold,
  HeadingText,
  HeadingLight,
  HeadingBold
}
