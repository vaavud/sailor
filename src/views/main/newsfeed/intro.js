// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import Colors from '../../../../assets/colorTheme'
import Button from '../../../reactcommon/components/button'
import I18n from '../../../components/i18n'

export default class IntroView extends Component {

  static propTypes = {
    onNextPress: PropTypes.func.isRequired
  }

  render(){
    return (
      <View style={style.container} >
        <Text style={style.heading} >{I18n.t('chooseHabour')}</Text>
        <View style={{flexDirection: 'row'}} >
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            onPress={() => this.props.onNextPress }
            title={I18n.t('letsgoButton')} />
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  heading: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white'
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
    textAlign:'center',
    color: Colors.vaavudBlue
  }
})
