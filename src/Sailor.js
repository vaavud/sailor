'use strict'

import React, { Component } from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {connect} from 'react-redux'

import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager'

import Welcome from './modules/welcome/welcome'


class SailorMain extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<Welcome />)
  }

  // render() {
  //   return (
  //     <View style={{flex:1}}>
  //       <IndicatorViewPager
  //         style={{flex:1}}
  //         indicator={this._renderDotIndicator()} >
  //         <View style={{backgroundColor:'cadetblue'}}>
  //           <Text>page one</Text>
  //         </View>
  //         <View style={{backgroundColor:'cornflowerblue'}}>
  //           <Text>page two</Text>
  //         </View>
  //         <View style={{backgroundColor:'#1AA094'}}>
  //           <Text>page three</Text>
  //         </View>
  //       </IndicatorViewPager>
  //     </View>
  //   )
  // }

  // _renderDotIndicator() {
  //   return <PagerDotIndicator pageCount={3} />
  // }

}

const mapReduxStoreToProps = (reduxStore) => {
  return {
  }
}


export default connect(mapReduxStoreToProps)(SailorMain)
