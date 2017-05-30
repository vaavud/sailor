/* TODO: clean unused component
import React, {
  Component
} from 'react'

import {
  View
} from 'react-native'

import {
  NormalText
} from '../../components/text'

import Button from '../../reactcommon/components/button'

import style from './style'

class CalibrateView extends Component {


  render = () => {
    return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <NormalText textContent={'Infro from phone'} />
          <NormalText textContent={this.props.heading} />
        </View>
        <View style={style.buttonContainer}>
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            title={'NEXT'}
            onPress={this.props.onNext} />
        </View>
      </View>
    )
  }

}

export default CalibrateView*/
