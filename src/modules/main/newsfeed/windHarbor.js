// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native'

import { SegmentedControls } from 'react-native-radio-buttons'

import Button from '../../../reactcommon/components/button'

import Colors from '../../../../assets/colorTheme'
import { textStyle } from '../../../components/text'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { saveHarbor } from '../../../actions/harbor'

// let SelectorView = requireNativeComponent('SelectorViewSwift', WindHarbor)

const {width} = Dimensions.get('window')

const logo = require('../../../../assets/icons/logo.png')

class WindHarbor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      windMin: 1,
      windMax: 16,
      windSpeedUnit: 'mps',
      loading: false,
      currentMinSpeed: props.harbor.windMin,
      currentMaxSpeed: props.harbor.windMax,
      latlon: { lat: props.componentProps.location.latitude, lon: props.componentProps.location.longitude },
      name: props.componentProps.locationName,
      id: props.componentProps.id
    }

    this._onFinish = this._onFinish.bind(this)
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _onFinish() {
    let profile = {
      minSpeed: this.state.currentMinSpeed,
      maxSpeed: this.state.currentMaxSpeed
    }

    let harbor = {
      location: this.state.latlon,
      name: this.state.name,
      directions: { N: true, E: true, W: true, S: true, NE: true, NW: true, SW: true, SE: true }
    }

    this.props.saveHarbor(harbor, profile, this.state.id).then(() => this.props.pop(true))
  }

  _renderSlider(){
    return (
    <View style={{ alignItems: 'center' }}>
          <Text style={textStyle.normal}>Your suggested wind range is </Text>
          <Text style={textStyle.normal}>
            from
              <Text style={textStyle.normal} > {this.state.currentMinSpeed} </Text>
            to
              <Text style={textStyle.normal} > {this.state.currentMaxSpeed} </Text>
          </Text>

          <MultiSlider
            containerStyle={{marginTop: 30}}
            values={[this.state.currentMinSpeed, this.state.currentMaxSpeed]}
            min={this.state.windMin}
            max={this.state.windMax}
            onValuesChange={() => { }}
            onValuesChangeFinish={(values) => {
              this.setState({ currentMinSpeed: values[0], currentMaxSpeed: values[1] })
            }}
          />

          <Text style={textStyle.normal} >Move the sliders to fine tune the range</Text>
        </View>
    )
  }

  _renderSegmented(){
    return (
      <View style={style.segmentedContainer} >
        <Text>{'Unit'}</Text>
          <SegmentedControls style={style.segmentedControl}
            tint={Colors.segmSelectedTint}
            selectedTint={Colors.segmentedTint}
            backTint={Colors.segmentedTint}
            options={['mps', 'kph', 'knot', 'mph']}
            allowFontScaling={false} // default: true
            onSelection={(e, i) => console.log('TODO ')}
            selectedOption={'mps'}
            optionStyle={{...textStyle.normal}}
            optionContainerStyle={style.segmentedControl}
            containerBorderWidth={2} />
        </View>
    )
  }

  _renderButtons(){
    return (
      <View style={{ width: width - 80, height: 90, position: 'absolute', bottom: 40, left: 40 }} >
          <Button
            textStyle={{ textAlign: 'center', color: 'white', marginTop: 8, fontSize: 16 }}
            buttonStyle={{ flex: 1, backgroundColor: Colors.vaavudBlue, margin: 5 }} title="Finish"
            onPress={this._onFinish} />
          <Button
            buttonStyle={{ flex: 1, margin: 5 }}
            textStyle={{ textAlign: 'center', backgroundColor: 'transparent', marginTop: 8, fontSize: 16, }}
            title="Back" onPress={() => { this.props.pop() }} />
        </View>
    )
  }

  render(){
    return (
      <View style={style.container} >
        <Image style={style.logo}
          source={logo}/>
        {this._renderSlider()}
        {this._renderSegmented()}
        {this._renderButtons()}
      </View>
    )
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    harbor: reduxStore.harbor,
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveHarbor: bindActionCreators(saveHarbor, dispatch)
  }
}

const style = StyleSheet.create({
  container:{
    flex: 1,
    paddingTop: 40,
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
  },
  logo:{
    alignSelf: 'center',
    marginBottom: 30
  },
  segmentedContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
    paddingTop: 15
  },
  segmentedControl: {
    justifyContent: 'center',
    height: 40,
  },
  loginButton: {
    width : width * 0.8 - 2,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
})

export default connect(mapReduxStoreToProps, mapDispatchToProps)(WindHarbor)
