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
  TouchableHighlight,
  RefreshControl,
  RecyclerViewBackedScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

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
    this.state = {
      dataSource: ds.cloneWithRowsAndSections([]),
      refreshing: false
    }
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(props) {
    //var sections = this._sessionsToSections(this.props.sessions)
    //this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(sections)})
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

  renderSectionHeader(sectionData) {
    var rowData = sectionData[0]
    return (
      <View>
        <Text >
          {moment(rowData.timeStart).format('dddd, MMMM D, YYYY')}
        </Text>
      </View>
    )
  }

  _renderRow() {
    return (
      <TouchableOpacity style={style.row}
        onPress={() => this.props.onNextPress({ key: 'summary', props: { sessionKey: this.props.sessions[0].key } })}>
        <View>
          <Text>{'IMA ROW!!'}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'blue' }}>
        {this._renderRow()}
      </View>
    )
  }
}

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: 'red',
    marginTop: 20,
  }
})
