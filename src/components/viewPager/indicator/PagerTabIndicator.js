/**
 * Created by tangzhibin on 16/5/11.
 */

'use strict';
import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import IndicatorViewPager from '../IndicatorViewPager';

export default class PagerTabIndicator extends Component {
    static propTypes = {
        ...View.propTypes,
            initialPage: PropTypes.number,
            pager: PropTypes.instanceOf(IndicatorViewPager),
    tabs: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string,
            iconSource: Image.propTypes.source,
            selectedIconSource: Image.propTypes.source
    })).isRequired,
            itemStyle: View.propTypes.style,
            selectedItemStyle: View.propTypes.style,
            iconStyle: Image.propTypes.style,
            selectedIconStyle: Image.propTypes.style,
            textStyle: Text.propTypes.style,
            selectedTextStyle: Text.propTypes.style
    };



    static defaultProps = {
        tabs: []
    };

    state = {
        selectedIndex: this.props.initialPage
    };

    constructor(props) {
        super(props);

        this.onItemPress = this.onItemPress.bind(this);
    }

    onItemPress(pager, index, isSelected) {
        if (this.props.onItemPress) {
            this.props.onItemPress(index, isSelected);
        }

        if (!isSelected) {
            pager.setPage(index);
        }
    }

    render() {
        let {
                tabs, pager, style, itemStyle, selectedItemStyle, iconStyle,
                selectedIconStyle, textStyle, selectedTextStyle
                } = this.props;
        if (!tabs || tabs.length === 0) return null;

        let tabsView = tabs.map((tab, index) => {
            let isSelected = this.state.selectedIndex === index;
            return (
                    <TouchableOpacity
							disabled={this.props.disabled}
                            style={[styles.itemContainer, isSelected ? selectedItemStyle : itemStyle]}
                            activeOpacity={0.6}
                            key={index}
                            onPress={() => {this.onItemPress(pager, index, isSelected)}}
                            >
                        <Image
                                style={[styles.image, isSelected ? selectedIconStyle : iconStyle]}
                                source={isSelected ? tab.selectedIconSource : tab.iconSource}
                                />
                        <Text
                                style={[ isSelected ? styles.textSelected : styles.text, isSelected ? selectedTextStyle : textStyle]}
                                >
                            {tab.text}
                        </Text>
                    </TouchableOpacity>
            );
        });
        return (
                <View style={[styles.container, style]}>
                    {tabsView}
                </View>
        );
    }

    onPageSelected(e) {
        if (this.state.selectedIndex != e.position) {
            this.setState({selectedIndex: e.position});

            if (this.props.onPageChange) {
                this.props.onPageChange(e.position);
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 4,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#F7F7F7'
    },
    itemContainer: {
        alignItems: 'center',
        flex: 1
    },
    image: {},
    text: {
        marginTop: 4,
        fontSize: 11,
        color: '#999999'
    },
    textSelected: {
        marginTop: 4,
        fontSize: 11,
        color: '#3584F6'
    }
});
