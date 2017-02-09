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
const imgHarbor = require('../../../../assets/pinMap.png')

const { width, height } = Dimensions.get('window')

export default class SelectHabourView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }

  static propTypes = {
    onPressSave: PropTypes.func.isRequired,
    onPop: PropTypes.func.isRequired,
    region: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number.isRequired,
      longitudeDelta: PropTypes.number.isRequired
    }).isRequired,
    locationName: PropTypes.string.isRequired
  }

  onRegionChange(region) {
    this.setState({ region })
  }

  _renderMap() {
    return (
      <MapView
        style={style.mapContainer}
        onRegionChangeComplete={this.onRegionChange.bind(this)}
        initialRegion={this.state.region} >
        {this.state.location ?
          <MapView.Marker
            onDragEnd={e => this.setState({ location: { latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude } })}
            coordinate={this.state.location}
            draggable>
            <Image source={imgHarbor} style={{ height: 45, width: 45 }} />
          </MapView.Marker> : null
        }
      </MapView>
    )
  }

  _renderInputField() {
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
          source={saveIcon}
          resizeMode={'contain'} />
        <TextInput style={style.inputField}
          defaultValue={this.state.locationName}
          autoFocus={false}
          onChangeText={(locationName) => {
            this.setState({ locationName })
          }}
          autoCorrect={false}
          placeholder={'City name'}
          clearButtonMode="while-editing"
          placeholderTextColor="#fff"
          underlineColorAndroid="transparent"
          returnKeyType="next" />
      </View>
    )
  }

  _renderButton() {
    return (
      <Button buttonStyle={style.saveButton}
        textStyle={style.buttonText}
        onPress={() => {
          console.log("------------")
          console.log(this.state.location)
          console.log(this.state.locationName)
          this.props.onPressSave({ key: 'windHarbor', props: { ...this.state } })
        }}
        title={'Save habour'} />
    )
  }

  render() {
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
    textAlign: 'center',
    color: 'white'
  },
  inputLogo: {
    width: 25,
    height: 25,
    marginLeft: 10
  },
})
