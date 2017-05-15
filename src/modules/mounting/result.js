import React, {
  Component
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  Image,
  StyleSheet,
  View,
} from 'react-native'
import Button from '../../reactcommon/components/button'
import {
  NormalText,
  textStyle
} from '../../components/text'
import Colors from '../../../assets/colorTheme'
const correct = require('../../../assets/icons/correct.png')

import { skipCalibration } from '../../actions/calibrate'


class Result extends Component {

  render = () => {
    // const { params } = this.props.navigation.state
    return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <Image source={correct} style={{ height: 90, width: 90 }} />
          <NormalText style={style.heading}
            textContent={'SUCCESS'} />
          <NormalText style={style.description}
            textContent={'You have now successfully calibrated your Vaavud Ultrasonic.'} />
          <NormalText style={style.description}
            textContent={'You are now ready to mount your Ultrasonic.'} />
          <NormalText style={style.description}
            textContent={'When mounting is completed please launch \n"Align Ultrasonic"\nfrom settings.'} />
        </View>
        <View style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }} >
          <View style={{ flexDirection: 'row' }} >
            <Button buttonStyle={style.button}
              textStyle={style.buttonText}
              onPress={this.props.skipCalibration}
              title={'FINISH'} />
          </View>
        </View>
      </View>
    )
    /*return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text> Congratulations.... </Text>
        <Button title={'Finish'} onPress={this.props.skipCalibration} />
      </View >
    )*/


    // return <ResultView finish={this.props.skipCalibration} headingBle={params.headingFromBle} headingPhone={params.headingFromPhone} />
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: Colors.vaavudBlue
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    margin: 0,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  buttonText: {
    ...textStyle.normal,
    textAlign: 'center',
    color: Colors.vaavudBlue
  }
})

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    skipCalibration: bindActionCreators(skipCalibration, dispatch)
  }
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(Result)

