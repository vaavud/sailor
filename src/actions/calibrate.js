
import { SKIP_CALIBRATION } from '../constants/auth'

const skipCalibration = () => {
  return (dispatch, getState) => {
    dispatch({ type: SKIP_CALIBRATION })
  }
}

export { skipCalibration }
