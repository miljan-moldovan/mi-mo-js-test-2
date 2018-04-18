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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from './UI/Icon';


import apiWrapper from '../utilities/apiWrapper';

const QueueNavButton = ({
  icon, onPress, style, type,
}) => (
  <TouchableOpacity onPress={onPress} style={[{ justifyContent: 'flex-end' }, style]}>
    <View style={{ height: 20, width: 20 }}>
      <Icon name={icon} type={type} style={styles.navButton} />
    </View>
  </TouchableOpacity>
);

export default class QueueHeader extends React.Component {
  state = {
    searchMode: false,
    searchText: '',
  }
  onActionPress = () => {
    const { navigation } = this.props;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Turn Away', 'Combine', 'Cancel', '[DEV] Client Merge'],
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
          case 3:
            navigation.navigate('ClientMerge');
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
          {/* <FontAwesome style={styles.searchIcon}>{Icons.search}</FontAwesome> */}
          <Icon name="search" type="light" style={styles.searchIcon} />
          <TextInput style={styles.search} placeholderTextColor="rgba(76,134,217,1)" onChangeText={this.onChangeSearchText} value={this.props.searchText} placeholder="Search" returnKeyType="search" />
        </View>
        <TouchableOpacity onPress={this.onSearchCancel}>
          <Text style={[styles.navButtonText, { color: 'white', marginRight: 6, marginLeft: 6 }]}>Cancel</Text>
        </TouchableOpacity>

      </SafeAreaView>
    ) : (
      <SafeAreaView style={[styles.headerContainer, { height: 52, paddingBottom: 10 }]}>
        <QueueNavButton
          type="regular"
          icon="bars"
          style={{
 alignItems: 'flex-start', flex: 1, paddingLeft: 8, paddingTop: 5,
}}
          onPress={() => {
            const { navigation } = this.props;
            navigation.navigate('Settings');
          }}
        />
        <View style={{
 justifyContent: 'flex-end', alignItems: 'center', flex: 1, paddingRight: 6,
}}
        >
          <Text style={styles.headerTitle}>Queue</Text>
        </View>
        <View style={{
 flexDirection: 'row',
justifyContent: 'flex-end',
flex: 1,
}}
        >
          <QueueNavButton type="solid" icon="ellipsisH" onPress={this.onActionPress} style={{ marginRight: 20, paddingTop: 5 }} />
          <QueueNavButton type="regular" icon="search" onPress={this.onSearchPress} style={{ marginRight: 2, paddingTop: 5 }} />
        </View>
      </SafeAreaView>
    );
  }
}
/*
{
  alignItems: 'center',
  backgroundColor: '#115ECD',
  borderBottomWidth: 0,
  borderWidth: 0,
  elevation: 0,
  flexDirection: 'row',
  height: 44,
  justifyContent: 'center',
  // paddingHorizontal: 19,
  paddingLeft: 10,
  paddingRight: 10,
  shadowColor: 'transparent',
  backgroundColor: 'red'
},
*/
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#115ECD',
    borderBottomWidth: 0,
    borderWidth: 0,
    elevation: 0,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    // paddingHorizontal: 19,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: 'transparent',
    // backgroundColor: 'red'
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
    alignSelf: 'center',
  },
  searchContainer: {
    borderRadius: 10,
    backgroundColor: 'rgba(12,70,153,1)',
    height: 36,
    marginHorizontal: 6,
    // marginBottom: 6,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  searchIcon: {
    marginLeft: 7,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
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
    fontSize: 16,
    // marginLeft: 10,
  },
});
