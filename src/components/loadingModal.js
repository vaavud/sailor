'use strict'

import React, { Component } from 'react'
import {
  View,
  ActivityIndicator,
  Modal,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native'

import Colors from '../../assets/colorTheme'
const logo = require('../../assets/icons/logo.png')
const {width, height} = Dimensions.get('window')

export default class LoadingModal extends Component {

  constructor(props){
    super(props);
    this.state={
        visible:this.props.visible
    };
    this._show=this._show.bind(this);
    this._hide=this._hide.bind(this);
}

_show() {
  this.setState({visible:true});
}

_hide(){
  this.setState({visible:false});
}

  render(){
    return(
        <Modal
            animationType={'none'}
            transparent={true}
            visible={this.state.visible}
            onRequestClose={this.props.onDismissLoadingCallback}>
            <View style={{flex:1}}/>
            <View style={{
                height:height,
                width:width,
                alignItems:'center',
                justifyContent:'center',
                backgroundColor:'#3434347f',
                borderRadius:10,alignSelf:'center'}}>
                <ActivityIndicator
                    animating={true}
                    size={"large"}
                    color={'white'}
                />
            </View>
            <View style={{flex:1}}/>
        </Modal>
    );
}
}

const style = StyleSheet.create({
  container:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: Colors.vaavudBlue,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
