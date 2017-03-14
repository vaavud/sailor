// @flow

'use strict'

import React, { Component } from 'react'
import {
  View, Text,
  Image, StyleSheet
} from 'react-native'

import Button from '../../reactcommon/components/button'
import { NormalText } from '../../components/text'
import I18n from '../../components/i18n'

import Colors from '../../../assets/colorTheme'
const correct = require('../../../assets/icons/correct.png')


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { saveLastBLEStatus, skipIntro } from '../../actions/bluetooth'


class Bluethooth extends Component {

  constructor(props) {
    super(props)

    this._finishSetup = this._finishSetup.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _finishSetup() {
    this.props.saveLastBLEStatus(this.props.point.battery).then(this.props.skipIntro)
  }

  render() {
    return (
      <View style={style.container} >
        <Image source={correct} style={{ height: 90, width: 90 }} />
        <NormalText style={style.heading}
          textContent={I18n.t('success')} />
        <NormalText style={style.description}
          textContent={I18n.t('deviceConnect')} />
        <NormalText style={style.description}
          textContent={I18n.t('batteryLevel') + this.props.point.battery + ' %'} />
        <View style={{ flexDirection: 'row' }} >
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            onPress={this._finishSetup}
            title={I18n.t('finish')} />
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
    saveLastBLEStatus: bindActionCreators(saveLastBLEStatus, dispatch),
    skipIntro: bindActionCreators(skipIntro, dispatch),

  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Bluethooth)


const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    flex: 2,
    borderWidth: 1,
    borderRadius: 5,
    margin: 50,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})
