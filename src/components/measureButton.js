'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'


const { width } = Dimensions.get('window')

const alignItemsMap = {
  'center' : 'center',
  'left'  : 'flex-start',
  'right' : 'flex-end'
}

export default class MeasureButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      active: props.active,
      buttonColor: props.buttonColor,
      buttonTextColor: props.buttonTextColor,
      spacing: props.spacing,
      btnOutRange: props.btnOutRange
        || props.buttonColor
        || 'rgba(0,0,0,1)',
      btnOutRangeTxt: props.btnOutRangeTxt
        || props.buttonTextColor
        || 'rgba(255,255,255,1)',
      outRangeScale: props.outRangeScale,
      anim: new Animated.Value(this.props.active ? 1 : 0),
      fadeAnim: new Animated.Value(0),
      backdrop: props.backdrop
    }
    this.timeout = null
    this.setPositionAndSizeByType()
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  setPositionAndSizeByType() {
    let position, offsetX, offsetY, size
    position = 'center',
    offsetX  = 10,
    offsetY  = -10,
    size     = 60

    this.state.position = this.props.position || position
    this.state.offsetX  = this.props.offsetX  || offsetX
    this.state.offsetY  = this.props.offsetY  || offsetY
    this.state.size     = this.props.size     || size
  }

  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  getContainerStyles() {
    return [styles.overlay, this.getOrientation(), this.getOffsetXY()]
  }

  getActionButtonStyles() {
    return [styles.actionBarItem, this.getButtonSize()]
  }

  getOrientation() {
    return { alignItems: alignItemsMap[this.state.position] }
  }

  getButtonSize() {
    return {
      width: this.state.size,
      height: this.state.size
    }
  }

  getOffsetXY() {
    return {
      paddingHorizontal: this.state.offsetX,
      marginBottom: this.state.offsetY
    }
  }

  getActionsStyle() {
    return [styles.actionsHorizontal, this.getOrientation() ]
  }


  //////////////////////
  // RENDER METHODS
  //////////////////////

  render() {
    return (
      <View pointerEvents="box-none" style={styles.overlay}>
        <Animated.View pointerEvents="none" style={[styles.overlay, {
          opacity: this.state.anim
        }]}>
        </Animated.View>
        <View pointerEvents="box-none" style={this.getContainerStyles()}>
          {this._renderButton()}
        </View>
      </View>
    )
  }

  _renderButton() {
    return (
      <View style={this.getActionButtonStyles()}>
        <TouchableWithoutFeedback
          activeOpacity={0.85}
          onPress={() => {
            this.props.onPress()
            this.animateButton()
          }}>
          <Animated.View
            style={[styles.btn, {
              width: this.state.size,
              height: this.state.size,
              borderRadius: this.state.size / 2,
              backgroundColor: this.state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.buttonColor, this.state.btnOutRange]
              }),
              transform: [{
                scale: this.state.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, this.state.outRangeScale]
                })
              }]
            }]}>
            {this._renderButtonIcon()}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _renderButtonIcon() {
    if (this.props.icon && !this.state.active){
      return this.props.icon
    } else {
      return this.props.activeIcon
    }
  }


  //////////////////////
  // Animation Methods
  //////////////////////

  animateButton() {
    if (this.state.active) return this.reset()

    Animated.spring(this.state.anim, {
       toValue: 1,
       duration: 250
    }).start()

    this.setState({ active: true })
  }

  reset() {
    Animated.spring(this.state.anim, {
      toValue: 0,
      duration: 250
    }).start()

    setTimeout(() => {
      this.setState({ active: false })
    }, 250)
  }
}


MeasureButton.defaultProps = {
  active: false,
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextColor: 'rgba(255,255,255,1)',
  spacing: width * 0.1,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  backdrop: false
}

MeasureButton.propTypes = {
  active: PropTypes.bool,
  position: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,

  offsetX : PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  actionBarItem: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1
    },
    shadowColor: '#444',
    shadowRadius: 1
  },
  btnText: {
    fontSize: 40,
    marginBottom: 8 ,
    backgroundColor: 'transparent',
    position: 'relative'
  },
  actionsHorizontal: {
    width: width,
    justifyContent: 'center',
    flexDirection: 'row'
  }
})
