import React, {
  Component
} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Image,
  View
} from 'react-native'
import { skipCalibration } from '../../actions/calibrate'
import {
  NormalText,
  HeadingText,
  textStyle
} from '../../components/text'

const logo = require('../../../assets/icons/logo.png')

import Button from '../../reactcommon/components/button'

import style from './style'

class IntroView extends Component {

  render = () => {
    return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <Image source={logo} style={{ marginBottom: 20, width: 110, height: 80 }} />
          <HeadingText style={style.heading} textContent={'Let\'s calibrate the Vaavud Ultrasonic'} />
          <NormalText style={style.description} textContent={'Please stay close to the device and follow instructions before mounting'} />
        </View>
        <View style={style.buttonContainer}>
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            title={'NEXT'}
            onPress={() => this.props.navigate('Mounting')} />
        </View>
        <View style={style.buttonContainer}>
          <Button
            buttonStyle={{
              height: 40,
              marginTop: 10,
              alignSelf: 'center',
              backgroundColor: 'transparent',
              justifyContent: 'center',
            }}
            textStyle={{
              ...textStyle.normal,
              fontSize: 16,
              textAlign: 'center',
              backgroundColor: 'transparent',
              color: 'white'
            }}
            title={'SKIP'}
            onPress={this.props.skipCalibration}
          />
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
    skipCalibration: bindActionCreators(skipCalibration, dispatch)
  }
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(IntroView)
