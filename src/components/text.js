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
    style: PropTypes.number
  }

  render(){
    const {
      textContent,
      style
    } = this.props
    return (
      <Text style={[s.small, style]} >
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
      <Text style={[s.smallSemibold, style]} >
        {textContent}
      </Text>
    )
  }
}


class NormalText extends Component {

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
      <Text style={[s.normal, style]} >
        {textContent}
      </Text>
    )
  }
}

class NormalLight extends Component {

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
      <Text style={[s.normalLight, style]} >
        {textContent}
      </Text>
    )
  }
}

class NormalBold extends Component {

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
      <Text style={[s.normalBold, style]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingText extends Component {

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
      <Text style={[s.large, style]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingLight extends Component {

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
      <Text style={[s.largeLight, style]} >
        {textContent}
      </Text>
    )
  }
}

class HeadingBold extends Component {

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
      <Text style={[s.largeBold, style]} >
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
