// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import Icon from './UI/Icon';
import SalonTouchableOpacity from '../components/SalonTouchableOpacity';
import SalonActionSheet from '../components/SalonActionSheet';


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
  actionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    height: 55,
    width: '90%',
  },
  actionItemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 4,
  },
  actionItemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  actionItemTitle: { fontSize: 21, fontWeight: '500', color: '#115ECD' },
  cancelTitle: { fontSize: 20, color: '#0C4699' },
});


const CANCEL_INDEX = 3;
const DESTRUCTIVE_INDEX = 3;
const options = [
  <View style={styles.actionItemContainer}>
    <View style={styles.actionItemLeft}>
      <Text style={styles.actionItemTitle}>Turn Away</Text>
    </View>
    <View style={styles.actionItemRight}>
      <Icon
        name="ban"
        type="solid"
        color="#115ECD"
        size={16}
      />
    </View>
  </View>,


  <View style={styles.actionItemContainer}>
    <View style={styles.actionItemLeft}>
      <Text style={styles.actionItemTitle}>Combine</Text>
    </View>
    <View style={styles.actionItemRight}>
      <Icon
        name="userPlus"
        type="solid"
        color="#115ECD"
        size={16}
      />
    </View>
  </View>,


  <View style={styles.actionItemContainer}>
    <View style={styles.actionItemLeft}>
      <Text style={styles.actionItemTitle}>[DEV] Client Merge</Text>
    </View>
    <View style={styles.actionItemRight}>
      <Icon
        name="compressAlt"
        type="solid"
        color="#115ECD"
        size={16}
      />
    </View>
  </View>,
  <Text style={styles.cancelTitle}>Cancel
  </Text>,
];

const QueueNavButton = ({
  icon, onPress, style, type,
}) => (
  <SalonTouchableOpacity onPress={onPress} style={[{ justifyContent: 'flex-end' }, style]}>
    <View style={{ height: 20, width: 20 }}>
      <Icon name={icon} type={type} style={styles.navButton} />
    </View>
  </SalonTouchableOpacity>
);

export default class QueueHeader extends React.Component {
  state = {
    searchMode: false,
    searchText: '',
  }

  showActionSheet = () => {
    this.SalonActionSheet.show();
  };

  handlePress = (i) => {
    setTimeout(() => {
      this.handlePressAction(i);
    }, 500);
    return false;
  }

  handlePressAction(i) {
    const { navigation } = this.props;

    switch (i) {
      case 0:
        navigation.navigate(
          'TurnAway',
          { date: moment(), employee: null, fromTime: moment().format('HH:mm:ss') },
        );
        break;
      case 1:
        navigation.navigate('QueueCombine');
        break;
      case 2:
        navigation.navigate('ClientMerge');
        break;
      default:
        break;
    }

    return false;
  }

  onSearchPress = () => this.props.onChangeSearchMode(true);
  onSearchCancel = () => this.props.onChangeSearchMode(false);
  onChangeSearchText = (searchText: String) => this.props.onChangeSearchText(searchText);
  render() {
    return this.props.searchMode ? (
      <SafeAreaView style={[styles.headerContainer, { height: 52, paddingBottom: 10 }]}>

        <View style={styles.searchContainer}>
          {/* <FontAwesome style={styles.searchIcon}>{Icons.search}</FontAwesome> */}
          <Icon name="search" type="light" style={styles.searchIcon} />
          <TextInput autoFocus style={styles.search} placeholderTextColor="rgba(76,134,217,1)" onChangeText={this.onChangeSearchText} value={this.props.searchText} placeholder="Search" returnKeyType="search" />
        </View>
        <SalonTouchableOpacity onPress={this.onSearchCancel}>
          <Text style={[styles.navButtonText, { color: 'white', marginRight: 6, marginLeft: 6 }]}>Cancel</Text>
        </SalonTouchableOpacity>

      </SafeAreaView>
    ) : (
      <SafeAreaView style={[styles.headerContainer, { height: 52, paddingBottom: 10 }]}>

        <SalonActionSheet
          ref={o => this.SalonActionSheet = o}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={(i) => { this.handlePress(i); }}
          wrapperStyle={{ paddingBottom: 11 }}
        />

        <QueueNavButton
          type="solid"
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
          <QueueNavButton type="solid" icon="ellipsisH" onPress={this.showActionSheet} style={{ marginRight: 20, paddingTop: 5 }} />
          <QueueNavButton type="solid" icon="search" onPress={this.onSearchPress} style={{ marginRight: 2, paddingTop: 5 }} />
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
