import React, {
  Component
} from 'react'

import {
  IntroView
} from '../../views/mounting/'

class Intro extends Component {
  componentDidMount = () => {
    console.log('see props', this.props)
  }
  render = () => {
    return <IntroView nav={this.props.nav} />
  }

}

export default Intro
