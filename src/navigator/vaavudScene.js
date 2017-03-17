'use strict'

import React, { Component, PropTypes } from 'react'

import {
  NavigationExperimental,
} from 'react-native'

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental

import { renderRoute } from '../routes'


class VaavudScene extends Component {

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    // this._exit = this._exit.bind(this)
    this.popRoute = this._popRoute.bind(this)
    this.pushRoute = this._pushRoute.bind(this)
    this.jumpRout = this._jumpRout.bind(this)
  }

  render() {
    return (
      renderRoute(this.props.scene, this.pushRoute, this.popRoute, this.jumpRout)
    )
  }

  _jumpRout(tabKey,resetRouter) {
    this.props.navigate({ type: 'selectTab', tabKey })
  }

  _pushRoute(route) {
    // Just push a route with a new unique key.
    this.props.navigate({ type: 'push', route })
  }

  _popRoute(toRoot) {
    this.props.onPop(toRoot)
  }

  _exit() {
    this.props.navigate({ type: 'exit' })
  }

}

export default VaavudScene
