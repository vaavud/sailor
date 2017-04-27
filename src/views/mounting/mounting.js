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

class MountingView extends Component {

  render = () => {
    return (
      <View style={style.container} >
        <View style={style.innerContainer} >
          <NormalText textContent={'mounting on a boat'} />
          <NormalText textContent={'Direction from the vaavud ble ' + this.props.heading} />
        </View>
        <View style={style.buttonContainer}>
          <Button buttonStyle={style.button}
            textStyle={style.buttonText}
            title={'NEXT'}
            onPress={() => this.props.navigate('Calibrate', { headingFromBle: this.props.heading })} />
        </View>
      </View>
    )
  }

}

export default MountingView
