import React, {
  Component
} from 'react'

import {
  MountingView
} from '../../views/mounting'

class Mounting extends Component {


  render = () => {
    return <MountingView nav={this.props.nav} />
  }

}

export default Mounting
