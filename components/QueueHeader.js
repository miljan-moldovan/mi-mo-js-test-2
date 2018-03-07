// @flow
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
  ActionSheetIOS,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import * as actions from '../actions/queue.js';
import * as settingsActions from '../actions/settings.js';
import walkInActions from '../actions/walkIn';
import SideMenuItem from '../components/SideMenuItem';
import Queue from '../components/Queue';

import FloatingButton from '../components/FloatingButton';
import SalonModal from '../components/SalonModal';
import SalonTextInput from '../components/SalonTextInput';

import apiWrapper from '../utilities/apiWrapper';

const QueueNavButton = ({ icon, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[{height: '100%'},style]}>
    <FontAwesome style={styles.navButton}>{icon}</FontAwesome>
  </TouchableOpacity>
);

export default class QueueHeader extends React.Component {
  state = {
    searchMode: false,
    searchText: ''
  }
  onActionPress = () => {
    const { navigation } = this.props;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Turn Away', 'Combine', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            navigation.navigate('TurnAway');
            break;
          case 1:
            navigation.navigate('QueueCombine');
            break;
          default:
            break;
        }
      },
    );
  };
  onSearchPress = () => this.props.onChangeSearchMode(true);
  onSearchCancel = () => this.props.onChangeSearchMode(false);
  onChangeSearchText = (searchText: String) => this.props.onChangeSearchText(searchText);
  render() {
    return this.props.searchMode ? (
        <SafeAreaView style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <FontAwesome style={styles.searchIcon}>{Icons.search}</FontAwesome>
            <TextInput style={styles.search} placeholderTextColor="rgba(76,134,217,1)" onChangeText={this.onChangeSearchText} value={this.props.searchText} placeholder="Search" returnKeyType="search" />
          </View>
          <TouchableOpacity onPress={this.onSearchCancel}>
            <Text style={[styles.navButtonText, { color: 'white', marginRight: 6, marginBottom: 10, marginLeft: 6 }]}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={[styles.headerContainer]}>
          <QueueNavButton icon={Icons.bars} style={{marginLeft: 6, marginRight: 'auto'}} />
          <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', position: 'absolute', height: '100%', bottom: 0}}>
            <Text style={styles.headerTitle}>Queue</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 12, marginLeft: 'auto', height: '100%' }}>
            <QueueNavButton icon={Icons.ellipsisH} onPress={this.onActionPress} style={{marginRight: 19}} />
            <QueueNavButton icon={Icons.search} onPress={this.onSearchPress} />
          </View>
        </SafeAreaView>
      )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#115ECD',
    borderBottomWidth: 0,
    borderWidth: 0,
    elevation: 0,
    flexDirection: 'row',
    height: 35,
    justifyContent: 'center',
    // paddingHorizontal: 19,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: 'transparent',
  },
  // headerStyle: {
  //   backgroundColor: '#115ECD',
  //   paddingLeft: 10,
  //   paddingRight: 10,
  //   height: 35,
  //   borderWidth: 0,
  //   shadowColor: 'transparent',
  //   elevation: 0,
  //   borderBottomWidth: 0,
  //   justifyContent: 'center',
  //   // alignItems: 'center'
  // },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
    // backgroundColor: 'red',
    height: '100%'
  },
  searchContainer: {
    borderRadius: 10,
    backgroundColor: 'rgba(12,70,153,1)',
    height: 36,
    marginHorizontal: 6,
    marginBottom: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  searchIcon: {
    marginLeft: 7,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14
  },
  search: {
    margin: 7,
    height: 36,
    borderWidth: 0,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  navButton: {
    color: 'white',
    fontSize: 20,
    // marginLeft: 10,
  },
});
