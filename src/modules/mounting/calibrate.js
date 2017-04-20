import React, {
  Component
} from 'react'

import {
  CalibrateView,
} from '../../views/mounting/'

class Calibrate extends Component {

  render = () => {
    return <CalibrateView nav={this.props.nav} />
  }

}

export default Calibrate
