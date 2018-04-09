import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

const defaultStyles = StyleSheet.create({
  wrapperStyle: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    height: 49,
    width: '100%',
    borderTopColor: '#9D9D9D',
    borderTopWidth: 1,
  },
  tabStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 49,
  },
  titleStyle: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 2,
  },
});

export default class BottomTabBar extends Component {
  state = {
    tabs: [],
    selected: -1,
  }

  constructor(props) {
    super(props);
    this.state.tabs = this.props.tabs ? this.props.tabs : [];
  }

  componentWillReceiveProps(nextProps) {
    this.state.tabs = nextProps.tabs ? nextProps.tabs : [];
  }

  onPressTab = (index, callback) => {
    this.setState({ selected: index });
    if (callback) {
      callback();
    }
  }


  renderTabs = () => {
    const tabs = [];
    for (let i = 0; i < this.state.tabs.length; i += 1) {
      const tab = this.state.tabs[i];
      const color = this.state.selected === i ? '#115ECD' : '#727A8F';
      tabs.push(<TouchableOpacity style={[defaultStyles.tabStyle, this.props.tabStyle]} onPress={() => { this.onPressTab(i, tab.callback); }}>
        <Icon name={tab.icon} size={23} color={color} type="solid" />
        <Text style={[defaultStyles.titleStyle, this.props.titleStyle, { color }]}>{tab.title}</Text>
      </TouchableOpacity>);
    }

    return tabs;
  }

  render() {
    return (
      <View style={[defaultStyles.wrapperStyle, this.props.wrapperStyle]}>
        {this.renderTabs()}
      </View>
    );
  }
}
