/**
 * Created by tangzhibin on 16/2/28.
 */

'use strict';

import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import IndicatorViewPager from '../IndicatorViewPager';

export default class PagerTitleIndicator extends Component {
    static propTypes = {
        ...View.propTypes,
        initialPage: PropTypes.number,
        pager: PropTypes.instanceOf(IndicatorViewPager),
        titles: PropTypes.arrayOf(PropTypes.string).isRequired,
        itemStyle: View.propTypes.style,
        itemTextStyle: Text.propTypes.style,
        selectedItemTextStyle: Text.propTypes.style,
        selectedBorderStyle: View.propTypes.style,
        renderTitle: React.PropTypes.func,
        autoUpdateTitle: React.PropTypes.bool,
        topTitleEnabled: React.PropTypes.bool,
        topTitleValue: React.PropTypes.string,
        topTitleContainerStyle: Text.propTypes.style,
        topTitleTextStyle: Text.propTypes.style,
        itemsContainerStyle: Text.propTypes.style,
    };

    static defaultProps = {
        titles: [],
        autoUpdateTitle: true,
        initialPage: 0,
        topTitleEnabled: true,
        topTitleValue: null,
        topTitleStyle: {}
    };



    constructor(props) {
        super(props);

        let topTitleValue = null;

        if (this.props.topTitleEnabled && this.props.titles && this.props.titles.length > 0) {
            topTitleValue = this.props.titles[0];
        }

        if (this.props.topTitleValue != null) {
            topTitleValue = this.props.topTitleValue;
        }

        if (topTitleValue == null) {
            topTitleValue = 'Example';
        }

        this.state = {
            selectedIndex: this.props.initialPage,
            topTitleValue: topTitleValue,
            topTitleEnabled: this.props.topTitleEnabled
        };

        this.onItemPress = this.onItemPress.bind(this);
        this.setTopTitle = this.setTopTitle.bind(this);
    }

    setTopTitle(newTitle) {
        this.setState({
            topTitleValue: newTitle
        });

    }

    onItemPress(pager, index, isSelected) {
        if (this.props.onItemPress) {
            this.props.onItemPress(index, isSelected, this);
        }

        if (!isSelected) {
            pager.setPage(index);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.selectedIndex != nextState.selectedIndex ||
                this.props.titles + '' != nextProps.titles + '' ||
                this.props.style != nextProps.style ||
                this.props.itemStyle != nextProps.itemStyle ||
                this.props.itemTextStyle != nextProps.itemTextStyle ||
                this.props.selectedItemTextStyle != nextProps.selectedItemTextStyle ||
                this.props.selectedBorderStyle != nextProps.selectedBorderStyle;
    }

    render() {
        let {titles, pager, itemStyle, itemTextStyle, selectedItemTextStyle, selectedBorderStyle} = this.props;
        if (!titles || titles.length === 0)return null;

        let titleViews = titles.map((title, index)=> {
            let isSelected = this.state.selectedIndex === index;

            const titleView = this.props.renderTitle ? this.props.renderTitle(index, title, isSelected) : (
                    <Text style={isSelected ? [styles.titleTextSelected, selectedItemTextStyle]: [styles.titleText, itemTextStyle]}>
                        {title}
                    </Text>
            );

            return (
                <TouchableOpacity
						disabled={this.props.disabled}
                        style={[styles.titleContainer, itemStyle]}
                        activeOpacity={0.6}
                        key={index}
                        onPress={() => {this.onItemPress(pager, index, isSelected)}}
                    >
                    {titleView}
                    {isSelected ? <View style={[styles.selectedBorder, selectedBorderStyle]}/> : null}
                </TouchableOpacity>
            );
        });

        if (!this.state.topTitleEnabled) {
            return (
                <View style={[styles.barContainerWithoutTitle, this.props.style]}>
                    <View style={[styles.indicatorContainer, this.props.itemsContainerStyle]}>
                        {titleViews}
                    </View>
                </View>
            );
        }

        return (
            <View style={[styles.barContainerWithTitle, this.props.style]}>
                <View style={[styles.titleContainer, this.props.topTitleContainerStyle]}>
                    <Text style={[styles.topTitleTextStyle, this.props.topTitleTextStyle]}>
                        {this.state.topTitleValue}
                    </Text>
                </View>
                <View style={[styles.indicatorContainer, this.props.itemsContainerStyle]}>
                    {titleViews}
                </View>
            </View>
        );
    }

    onPageSelected(e) {
        if (this.state.selectedIndex != e.position) {

            if (this.props.autoUpdateTitle && this.props.topTitleEnabled && this.props.titles && this.props.titles.length > 0) {
                this.setState({selectedIndex: e.position, topTitleValue: this.props.titles[e.position] });
            } else {
                this.setState({selectedIndex: e.position});
            }

            if (this.props.onPageChange) {
                this.props.onPageChange(e.position, this);
            }
        }
    }
}

const styles = StyleSheet.create({

    barContainerWithoutTitle: {
        height:40,
        zIndex:10,
        backgroundColor:'white',
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        elevation: 4,
        shadowOffset: {width: 0,height: 0.2},
        shadowColor: '#222',
        shadowOpacity: 0.5,
    },

    barContainerWithTitle: {
        height:90,
        zIndex:10,
        backgroundColor:'white',
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        elevation: 4,
        shadowOffset: {width: 0,height: 0.2},
        shadowColor: '#222',
        shadowOpacity: 0.5,
    },

    topTitleContainerStyle: {
        backgroundColor:'white',
        alignSelf:'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems:'center'
    },


    topTitleTextStyle: {
        marginLeft:15,
        color: '#999',
        fontSize:18,
        fontFamily: 'normal',
        fontWeight:'bold'
    },

    indicatorContainer: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF'
    },
    titleText: {
        color: '#333333',
        fontSize: 15
    },
    titleTextSelected: {
        color: '#FF7200',
        fontSize: 15
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedBorder: {
        backgroundColor: '#FF7200',
        height: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
});
