
import { SKIP_CALIBRATION } from '../constants/auth'
import { AsyncStorage } from 'react-native'

const skipCalibration = () => {
  return (dispatch, getState) => {
    AsyncStorage.setItem('bleSetup', 'true')

    dispatch({ type: SKIP_CALIBRATION })
  }
}

export { skipCalibration }
