// @flow
'use strict'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ListView,
  View,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text
} from 'react-native'

import { connect } from 'react-redux'

import {
  SmallText,
  NormalText,
  SmallBold,
  NormalLight,
  NormalBold,
  HeadingBold
} from '../../../components/text'

import Colors from '../../../../assets/colorTheme'
import { SpeedUnits, convertWindSpeed } from '../../../reactcommon/utils'

import { SwipeListView } from 'react-native-swipe-list-view'

const { width } = Dimensions.get('window')

import moment from 'moment'

const ds = new ListView.DataSource({
  rowHasChanged: (a, b) => a !== b,
  sectionHeaderHasChanged: (a, b) => a !== b,
})


class HistoryView extends Component {

  static propType = {
    onNextPress: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    var sections = this._sessionsToSections(props.sessions)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(sections),
      refreshing: false
    }

    this._renderSectionHeader = this._renderSectionHeader.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._renderSubRow = this._renderSubRow.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    let sections = this._sessionsToSections(nextProps.sessions)
    this.setState({ dataSource: ds.cloneWithRowsAndSections(sections) })
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
        <NormalLight style={{ flex: 1, fontSize: 12, color: 'white', fontWeight: 'bold' }}
          textContent={moment(rowData.timeStart).format('dddd, MMMM D, YYYY')} />
        <NormalLight style={{ width: 40, textAlign: 'center', fontSize: 12, color: 'white' }} textContent={SpeedUnits[this.props.settings.windSpeed]} />
      </View>
    )
  }

  _renderRow(data) {
    // TODO what if there is no location
    const {
      location
    } = data
    var locationString = '-'
    if (location !== undefined) {
      var lat = location.lat.toFixed(2) + '°'
      var lon = location.lon.toFixed(2) + '°'
      var locationString = 'Lat: ' + lat + ' Lon: ' + lon
    }
    return (
      <TouchableOpacity style={style.row}
        activeOpacity={1}
        onPress={() => this.props.onNextPress.navigate('Summary', {
          sessionKey: data.key,
          timeStart: data.timeStart,
          timeEnd: data.timeEnd,
          locationName: locationString,
          windMean: data.windMean,
          fromHistory: true
        })}>
        <View style={style.locationContainer}>
          <SmallText textContent={moment(data.timeStart).format('HH:mm')} />
          <NormalText textContent={locationString} />
        </View>
        <View style={style.speedContainer} >
          <SmallText textContent={'Max'} />
          <HeadingBold style={{ color: Colors.vaavudRed }}
            textContent={convertWindSpeed(data.windMax, this.props.settings.windSpeed).toFixed(1)} />
        </View>
        <View style={style.speedContainer} >
          <SmallText textContent={'Average'} />
          <HeadingBold style={{ color: Colors.vaavudBlue }}
            textContent={convertWindSpeed(data.windMean, this.props.settings.windSpeed).toFixed(1)} />
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

  _renderSubRow(data, secId, rowId, rowMap) {
    return (
      <View style={{ backgroundColor: Colors.vaavudRed, flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => {
          rowMap[`${secId}${rowId}`].closeRow()
          this.props.deleteSession(data.key)
        }}>
          <View>
            <Text style={{ color: 'white', marginRight: 15 }}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (<SwipeListView
      dataSource={this.state.dataSource}
      renderRow={this._renderRow}
      renderHiddenRow={this._renderSubRow}
      renderSeparator={this._renderSeparator}
      renderSectionHeader={this._renderSectionHeader}
      disableRightSwipe={true}
      rightOpenValue={width * - 0.2}
      style={style.list}
    />)
    /*return (
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
    )*/
  }
}


const mapReduxStoreToProps = (reduxStore) => {
  return {
    settings: reduxStore.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapReduxStoreToProps, mapDispatchToProps)(HistoryView)



const style = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
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
  smalltext: {
    fontSize: 8
  },
  windText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
  },
  sectionHeader: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#303e48',
  },
})
