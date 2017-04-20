import React, {
  Component
} from 'react'

import {
  MountingView
} from '../../views/mounting'

class Mounting extends Component {


  render = () => {
    const { navigate } = this.props.navigation
    return <MountingView navigate={navigate} />
  }

}

export default Mounting
