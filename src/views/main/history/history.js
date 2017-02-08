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

  constructor (props) {
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (a, b) => a !== b ,
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

  componentWillReceiveProps (props) {
    var sections = this._sessionsToSections(this.props.sessions)
    this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(sections)})
  }

  _sessionsToSections (sessions) {
    sessions.sort((a, b) => b.timeStart - a.timeStart)
    var sections = [[sessions[0]]]
    for (var i = 1; i < sessions.length; i++) {
      var datePrev = new Date(sessions[i - 1].timeStart)
      var dateCurrent = new Date(sessions[i].timeStart)
      if (datePrev.toDateString() !== dateCurrent.toDateString()){
        sections.push([])
      }
      sections[sections.length - 1].push(sessions[i])
    }
    return sections
  }

  renderSectionHeader (sectionData) {
    var rowData = sectionData[0]
    return (
      <View>
        <Text >
          {moment(rowData.timeStart).format('dddd, MMMM D, YYYY')}
        </Text>
      </View>
    )
  }

  _renderRow(data){
    return (
      <TouchableOpacity style={style.row}
        onPress={() => this.props.onNextPress}>
        <View style={{flex: 1, padding: 12}}>
          <Text >{moment(data.timeStart).format('HH:mm')}</Text>
          <Text style={{color:'white'}}>{data.location}</Text>
        </View>
        <View style={{width: 60, backgroundColor: 'green'}} >
          <Text>{'max'}</Text>
        </View>
        <View style={{width: 60, backgroundColor:'cyan'}} >
          <Text>{'mean'}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSeparator (sectionId, rowId) {
    var key = `sep_${sectionId}_${rowId}`
    return (
      <View key={key} style={style.separator} />
    )
  }

  _onRefresh() {
    this.setState({refreshing: false})
  }

  render(){
    return (
      <ListView
        dataSource={this.state.dataSource}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}/>}
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
    flex: 1
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'red',
    marginTop: 20,
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
