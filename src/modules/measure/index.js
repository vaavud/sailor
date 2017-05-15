import { StackNavigator } from 'react-navigation'

import Measurement from '../main/measure'
import Summary from '../main/summary'

const MeasurementFlow = StackNavigator({
  Measurement: { screen: Measurement },
  Summary: { screen: Summary }
}, {
    headerMode: 'screen',
    navigationOptions: {
      header: null,
    }
  })

export default MeasurementFlow
