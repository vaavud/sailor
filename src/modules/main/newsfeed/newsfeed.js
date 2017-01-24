// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Newsfeed extends Component {

  constructor(props) {
    super(props)
    this.state = {
      current: {
        coords: {
          speed: '',
          latitude: '',
          longitude: ''
        }
      }
    }
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position)
        console.log('getCurrentPosition', initialPosition)
        // this.setState({initialPosition});
        this.setState({ newlatlon: initialPosition })
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )

    this.watchID = navigator.geolocation.watchPosition(position => {
      var lastPosition = JSON.parse(JSON.stringify(position))
      console.log('watchPosition', lastPosition)
      this.setState({ current: lastPosition })
    }, error => console.log('error', error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 10 })

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', }} >
        <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> {this.state.current.coords.speed} </Text>
        <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> {this.state.current.coords.latitude} </Text>
        <Text style={{ color: 'white', marginTop: 50, fontSize: 22 }}> {this.state.current.coords.longitude} </Text>

        <Button title="Summary" onPress={() => {
          this.props.push({ key: 'summary' })
        } } />

      </View>
    )
    // )

    // if (this.props.harbor.loading) {
    //   return (
    //     <View style={{ flex: 1, backgroundColor: 'black' }} >
    //       <Text style={{ color: 'white', marginTop: 50 }}> Loading... </Text>
    //     </View>)
    // }
    // else if (this.props.harbor.location) {
    //   return (
    //     <View style={{ flexGrow: 1, backgroundColor: 'black', flexDirection: 'row' }} >
    //       <Text style={{ color: 'white', marginTop: 50 }}> all data </Text>

    //     </View>)
    // }
    // else {
    //   return (<View style={{ flex: 1, backgroundColor: 'black' }} >
    //     <Button title="AddSpot" onPress={() => {
    //       this.props.push({ key: 'mapHarbor' })
    //     } } />
    //   </View>)
    // }
  }
}

const mapReduxStoreToProps = (reduxStore) => {
  return {
    harbor: reduxStore.harbor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(Newsfeed)
