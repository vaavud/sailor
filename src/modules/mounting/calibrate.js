import React, {
  Component
} from 'react'

import {
  CalibrateView,
} from '../../views/mounting/'

class Calibrate extends Component {

  render = () => {
    const { navigate } = this.props.navigation
    return <CalibrateView navigate={navigate} />
  }

}



export default Calibrate
