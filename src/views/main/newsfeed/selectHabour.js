// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native'

import MapView from 'react-native-maps'

import Button from '../../../reactcommon/components/button'
import Colors from '../../../../assets/colorTheme'

const saveIcon = require('../../../../assets/envelope.png')

const { width, height } = Dimensions.get('window')

export default class SelectHabourView extends Component {

  static propTypes = {
    onPressSave: PropTypes.func.isRequired,
    region: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number.isRequired,
      longitudeDelta: PropTypes.number.isRequired
    }).isRequired,
    locationName: PropTypes.string.isRequired
  }

  _renderMap(){
    return (
      <MapView
          style={style.mapContainer}
          initialRegion={this.props.region}  />
    )
  }

  _renderInputField(){
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
          source={saveIcon}
          resizeMode={'contain'}  />
        <TextInput style={style.inputField}
          autoFocus={false}
          autoCorrect={false}
          keyboardType="email-address"
          placeholder={'City name'}
          clearButtonMode="while-editing"
          placeholderTextColor="#fff"
          underlineColorAndroid="transparent"
          returnKeyType="next"/>
      </View>
    )
  }

  _renderButton(){
    return (
      <Button buttonStyle={style.saveButton}
        textStyle={style.buttonText}
        title={'Save habour'} />
    )
  }

  render(){
    return (
      <View style={style.container} >
        {this._renderMap()}
        {this._renderInputField()}
        {this._renderButton()}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  mapContainer: {
    width: width,
    height: height
  },
  inputContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: 40,
    left: 40,
    width: width - 80,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5
  },
  inputField: {
    flex: 1,
    padding: 10
  },
  saveButton: {
    position: 'absolute',
    bottom: 50,
    left: 40,
    width: width - 80,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: Colors.vaavudBlue,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
    color: 'white'
  },
  inputLogo: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
})
