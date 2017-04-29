// @flow

'use strict'

import React, { Component } from 'react'
import { View } from 'react-native'


import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoonConfig from '../../../reactcommon/components/selection.json'
import Colors from '../../../../assets/colorTheme'

import { goToMeasurement } from '../../../actions/measure'

const VaavudIcon = createIconSetFromIcoMoon(icoMoonConfig)

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Dommy extends Component {

  static navigationOptions = {
    showLabel: false,
    tabBarIcon: (props) => {
      return (<View
        style={{position: 'absolute', bottom: -35, height: 80, width: 80, alignItems: 'center', borderRadius: 40, paddingTop: 20 }} />
        )
    }
  }

  componentDidMount = () => {
    this.props.goToMeasurement()
  }

  render = () => {
    return null
  }

}


const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMeasurement: bindActionCreators(goToMeasurement, dispatch)
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Dommy)
