
import Intro from './intro'
import Mounting from './mounting'
import Calibrate from './calibrate'
import Result from './result'

import { StackNavigator } from 'react-navigation'


const MountingFlow = StackNavigator({
  Intro: { screen: Intro },
  Mounting: { screen: Mounting },
  Calibrate: { screen: Calibrate },
  Result: { screen: Result }
}, {
    headerMode: 'screen',
    navigationOptions: {
      headerVisible: false,
    }
  })

export default MountingFlow
