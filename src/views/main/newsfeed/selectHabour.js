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
  Image,
  StyleSheet
} from 'react-native'

import MapView from 'react-native-maps'

import Button from '../../../reactcommon/components/button'
import Colors from '../../../../assets/colorTheme'

const saveIcon = require('../../../../assets/icons/envelope.png')
const imgHarbor = require('../../../../assets/icons/harbour-marker.png')

import { nameByLatLon } from '../../../actions/harbor'


const { width, height } = Dimensions.get('window')
import Snackbar from 'react-native-snackbar'

export default class SelectHabourView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
    this._onFinish = this._onFinish.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this)
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
    isNew: PropTypes.bool.isRequired,
    locationName: PropTypes.string.isRequired
  }

  _stripName(name) {
    let index = name.indexOf(',')
    return index !== -1 ? name.substring(0, index) : name
  }


  onRegionChangeComplete(region) {
    nameByLatLon(region).then(name => {
      if (name.results.length > 0) {
        this.setState({ locationName: name.results[0].formatted_address, location: region })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ region: nextProps.region })
    this.onRegionChangeComplete(nextProps.region)
  }

  onRegionChange(region) {
    this.setState({ region })
  }

  // onMapPress(e) {
  //   if (this.state.location) { return }
  //   this.setState({
  //     location: e.nativeEvent.coordinate
  //   })
  // }

  _renderMap() {
    return (
      <View style={style.mapContainer}>
        <MapView
          style={{ flex: 1 }}
          onRegionChangeComplete={this.onRegionChangeComplete}
          onRegionChange={this.onRegionChange}

          mapType="satellite"
          region={this.state.region}
          initialRegion={this.state.region} />
        <Image source={imgHarbor} style={{ position: 'absolute', top: (height / 2) - 15, left: (width / 2) - 15 }} />

      </View>
    )
  }

  _renderInputField() {
    return (
      <View style={style.inputContainer}>
        <Image style={style.inputLogo}
          source={saveIcon}
          resizeMode={'contain'} />
        <TextInput style={style.inputField}
          defaultValue={this._stripName(this.state.locationName)}
          autoFocus={false}
          onChangeText={locationName => {
            locationName = this._stripName(locationName)
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
      <View style={style.buttonsArea}>
        <Button buttonStyle={[style.bottonButtonNext]}
          textStyle={style.buttonText}
          onPress={this._onFinish}
          title={'Save habour'} />
        <Button buttonStyle={style.bottonButtonBack}
          textStyle={style.buttonText}
          onPress={this.props.onPop}
          title={'Back'} />
      </View>
    )
  }


  _onFinish() {
    let mje
    if (!this.state.location) {
      mje = 'You want forecast without location, really?'
    }
    else if (this.state.locationName === '') {
      mje = 'What about the name? Somehow you have to identify it, rigth?'
    }

    if (mje) {
      Snackbar.show({ title: mje, duration: Snackbar.LENGTH_LONG })
      return
    }

    this.props.onPressSave({ key: 'windHarbor', props: { ...this.state } })
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
    backgroundColor: 'white',
    borderRadius: 5
  },
  buttonsArea: {
    position: 'absolute',
    bottom: 50,
    left: 40,
    width: width - 80,
    height: 100
  },
  inputField: {
    flex: 1,
    padding: 10,
  },
  bottonButtonBack: {
    height: 50,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'transparent',
    borderRadius: 5
  },
  bottonButtonNext: {
    width: width - 80,
    height: 50,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.vaavudBlue,
    borderColor: 'white',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white'
  },
  inputLogo: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: 'gray'
  },
})
