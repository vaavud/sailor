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

class IntroView extends Component {

  render = () => {
    return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <NormalText textContent={'Welcome....'} />
        </View>
        <View style={style.buttonContainer}>
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            title={'NEXT'}
            onPress={() => this.props.navigate('Mounting')} />
        </View>
      </View>
    )
  }

}

export default IntroView
