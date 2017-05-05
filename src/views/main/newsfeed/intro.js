// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native'

import Colors from '../../../../assets/colorTheme'
import Button from '../../../reactcommon/components/button'
import I18n from '../../../components/i18n'

const { width, height } = Dimensions.get('window')


const imgHarbor = require('../../../../assets/icons/big-harbour-marker.png')
const bgIntroFlow = require('../../../../assets/images/harbour-background.png')

export default class IntroView extends Component {

  static propTypes = {
    onNextPress: PropTypes.func.isRequired
  }

  render() {
    return (
      <Image source={bgIntroFlow} style={style.container} >
        <Image source={imgHarbor} />
        <Text style={style.heading} >{I18n.t('chooseHabour')}</Text>
        <View style={{ flexDirection: 'row' }} >
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            onPress={() => this.props.onNextPress('MapHarbor', { isNew: true })}
            title={I18n.t('letsgoButton')} />
        </View>
      </Image>
    )
  }
}

const style = StyleSheet.create({
  container: {
    width, height,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  heading: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
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
