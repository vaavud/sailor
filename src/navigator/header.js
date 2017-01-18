'use strict'

import React, { Component } from 'react'

import { NavigationExperimental } from 'react-native'
// import { NavigationHeaderBackButton } from 'NavigationHeaderBackButton'

const {
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental

import { routes } from '../routes'

class VaavudHeader extends Component {

  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps
  }

  constructor(props, context) {
    super(props, context)
    this._back = this._back.bind(this)
    this._renderTitleComponent = this._renderTitleComponent.bind(this)
  }

  render() {
    return (
      <NavigationHeader
        style={{ backgroundColor: '#1D242B' }}
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        // renderLeftComponent={this._renderBackButton}
        onNavigateBack={this._back}
        onNavigate={this._back}
        />
    )
  }

  _renderTitleComponent() {
    return (
      <NavigationHeader.Title textStyle={{ color: '#c3c3c3' }}>
        {routes.filter(route => route.id === this.props.scene.route.key)[0].title}
      </NavigationHeader.Title>
    )
  }

  _back() {
    this.props.back()
    // this.props.navigate({type: 'pop'});
  }
}

export default VaavudHeader
