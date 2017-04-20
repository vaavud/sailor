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

class ResultView extends Component {

  render = () => {
    return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <NormalText textContent={'mounting/calibrating guide intro'} />
        </View>
        <View style={style.buttonContainer}>
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            title={'NEXT'}
            onPress={() => {/* TODO save offset*/}} />
        </View>
      </View>
    )
  }

}

export default ResultView
