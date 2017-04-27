/*'use strict'

import React, { Component, PropTypes } from 'react'

import {
  NavigationExperimental,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental

import icons from '../reactcommon/icons'

class Tab extends Component {

  static propTypes = {
    navigate: PropTypes.func.isRequired,
    route: NavigationPropTypes.navigationRoute.isRequired,
    selected: PropTypes.bool.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this._onPress = this._onPress.bind(this)
  }

  render() {
    // if (this.props.route.key === 'measure') {
    //   return (
    //     <View style={styles.tab}/>
    //   )
    // }
    // else {
    const style = [styles.tabText];
    if (this.props.selected) {
      style.push(styles.tabSelected);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={this._onPress}>
        <Image style={{ tintColor: '#000' }} source={icons[this.props.route.key]} />
      </TouchableOpacity>
    )
    // }
  }

  _onPress() {
    if (this.props.route.key !== 'addSpot') {
      this.props.navigate({ type: 'selectTab', tabKey: this.props.route.key })
    }
  }
}


const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 40,
    flex: 1,
    justifyContent: 'center'
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  tabSelected: {
    color: 'blue',
  },
})

export default Tab*/
