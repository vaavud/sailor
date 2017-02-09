// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ListView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import {
  SmallText,
  NormalText,
  NormalBold
} from '../../../components/text'

import moment from 'moment'

export default class HistoryView extends Component {

  static propType = {
    onNextPress: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (a, b) => a !== b,
      sectionHeaderHasChanged: (a, b) => a !== b,
    })
    var sections = this._sessionsToSections(props.sessions)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(sections),
      refreshing: false
    }
  }

  _sessionsToSections(sessions) {
    sessions.sort((a, b) => b.timeStart - a.timeStart)
    var sections = [[sessions[0]]]
    for (var i = 1; i < sessions.length; i++) {
      var datePrev = new Date(sessions[i - 1].timeStart)
      var dateCurrent = new Date(sessions[i].timeStart)
      if (datePrev.toDateString() !== dateCurrent.toDateString()) {
        sections.push([])
      }
      sections[sections.length - 1].push(sessions[i])
    }
    return sections
  }

  _renderSectionHeader(sectionData) {
    var rowData = sectionData[0]
    return (
      <View style={style.sectionHeader} >
        <NormalText textContent={moment(rowData.timeStart).format('dddd, MMMM D, YYYY')} />
      </View>
    )
  }

  _renderRow(data) {
    // TODO what if there is no location
    return (
      <TouchableOpacity style={style.row}
        onPress={() => this.props.onNextPress({ key: 'summary', props: { sessionKey: data.key } })}>
        <View style={style.locationContainer}>
          <SmallText textContent={moment(data.timeStart).format('HH:mm')} />
          <NormalText textContent={'Islands brygge'} />
        </View>
        <View style={style.speedContainer} >
          <SmallText textContent={'Max'} />
          <NormalBold textContent={data.windMax}/>
          <SmallText textContent={'m/s'} />
        </View>
        <View style={style.speedContainer} >
          <SmallText textContent={'Average'} />
          <NormalBold textContent={data.windMax}/>
          <SmallText textContent={'m/s'} />
        </View>
      </TouchableOpacity>
    )
  }

  _renderSeparator(sectionId, rowId) {
    var key = `sep_${sectionId}_${rowId}`
    return (
      <View key={key} style={style.separator} />
    )
  }

  _onRefresh() {
    this.setState({ refreshing: false })
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)} />}
        renderRow={data => this._renderRow(data, this.props.navigator)}
        renderSeparator={this._renderSeparator}
        renderSectionHeader={this._renderSectionHeader}
        style={style.list}
      />
    )
  }
}

const style = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 20
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'grey',
  },
  locationContainer: {
    flex: 1,
    padding: 12,
  },
  speedContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  smalltext:{
    fontSize: 8
  },
  windText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  separator: {
    height: 2,
    backgroundColor: '#555',
  },
  sectionHeader: {
    padding: 5,
    backgroundColor: '#7a868c',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#555'
  },
})
