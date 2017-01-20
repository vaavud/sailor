// @flow

'use strict'

import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  StyleSheet
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  chart: {
    width: 100,
    height: 50,
  }
});

const data = [
  [0, 1],
  [1, 3],
  [3, 7],
  [4, 9],
];

class Newsfeed extends Component {

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {

    if (this.props.harbor.loading) {
      return (
        <View style={{ flex: 1, backgroundColor: 'black' }} >
          <Text style={{ color: 'white', marginTop: 50 }}> Loading... </Text>
        </View>)
    }
    else if (this.props.harbor.location) {
      return (
        <View style={{ flexGrow: 1, backgroundColor: 'black', flexDirection: 'row' }} >
              <Text style={{ color: 'white', marginTop: 50 }}> all data </Text>

        </View>)
    }
    else {
      return (<View style={{ flex: 1, backgroundColor: 'black' }} >
        <Button title="AddSpot" onPress={() => {
          this.props.push({ key: 'mapHarbor' })
        } } />
      </View>)
    }
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
