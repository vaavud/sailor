// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native'
import {
  NormalText,
  HeadingText,
  textStyle
} from '../../components/text'
import Button from '../../reactcommon/components/button'

import Colors from '../../../assets/colorTheme'
const wrong = require('../../../assets/icons/cancel-1.png')


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const { width } = Dimensions.get('window')
import { skipIntro } from '../../actions/bluetooth'


export class NoBluetooth extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={style.container} >
        <Image source={wrong} style={{ height: 90, width: 90 }} />
        <NormalText style={style.heading} textContent={'Something went wrong'}/>
        <NormalText style={style.description} textContent={'Vaavud ultrasonic not found.'} />
        <View style={{ height: 120 }} >
          <Button buttonStyle={style.buttonSkip}
            textStyle={style.buttonTextSkip}
            onPress={this.props.skipIntro}
            title="Try later" />
        </View>

      </View>
    )
  }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    skipIntro: bindActionCreators(skipIntro, dispatch)
  }
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(NoBluetooth)


const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.vaavudBlue
  },
  heading: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 20
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: width - 80,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  buttonSkip: {
    height: 40,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  buttonTextSkip: {
    ...textStyle.normal,
    textAlign: 'center',
    color: Colors.inputTextColor
  },
  buttonText: {
    ...textStyle.normal,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
