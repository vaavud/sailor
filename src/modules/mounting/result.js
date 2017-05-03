import React, {
  Component
} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  View, Text, Button
}
  from 'react-native'

import {
  ResultView
} from '../../views/mounting/'

import { skipCalibration } from '../../actions/calibrate'


class Result extends Component {

  render = () => {
    const { params } = this.props.navigation.state

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text> Congratulations.... </Text>
        <Button title={'Finish'} onPress={this.props.skipCalibration} />
      </View >
    )


    // return <ResultView finish={this.props.skipCalibration} headingBle={params.headingFromBle} headingPhone={params.headingFromPhone} />
  }
}



const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    skipCalibration: bindActionCreators(skipCalibration, dispatch)
  }
}


export default connect(mapReduxStoreToProps, mapDispatchToProps)(Result)

