import React, {
  Component
} from 'react'

import {
  IntroView
} from '../../views/mounting/'

class Intro extends Component {

  render = () => {
    const { navigate } = this.props.navigation

    return <IntroView navigate={navigate} />
  }

}

export default Intro
