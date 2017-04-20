import React, {
  Component
} from 'react'

import {
  ResultView
} from '../../views/mounting/'

class Result extends Component {

  render = () => {
    return <ResultView nav={this.props.nav} />
  }

}

export default Result
