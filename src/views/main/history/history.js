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
    var sections = this._sessionsToSections(props.sessions)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(sections),
      refreshing: false
    }

    // dataSource: this.state.dataSource.cloneWithRowsAndSections(sections)
    // console.log('this.props.sessions',)
  }

  componentWillMount() {
    // this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(props) {
    // var sections = this._sessionsToSections(this.props.sessions)
    // this.setState({  })
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

  _renderRow(data) {
    console.log('because nobody knows:::::', data)
    return (
      <TouchableOpacity style={style.row}
        onPress={() => this.props.onNextPress({ key: 'summary', props: { sessionKey: data.key } })}>
        <View style={style.locationContainer}>
          <Text >{moment(data.timeStart).format('HH:mm')}</Text>
          <Text>{'location' in data && 'name' in data.location ? data.location.name : '-'}</Text>
        </View>
        <View style={style.speedContainer} >
          <Text style={style.smalltext} >{'max'}</Text>
          <Text style={style.windText} >{data.windMax}</Text>
          <Text style={style.smalltext}>{'ms'}</Text>
        </View>
        <View style={style.speedContainer} >
          <Text style={style.smalltext}>{'average'}</Text>
          <Text style={style.windText} >{data.windMean}</Text>
          <Text style={style.smalltext}>{'ms'}</Text>
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
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
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
    borderLeftWidth: 1,
    borderColor: '#555',
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
    height: 1,
    backgroundColor: '#555',
  },
  sectionHeader: {
    padding: 6,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
  },
})
