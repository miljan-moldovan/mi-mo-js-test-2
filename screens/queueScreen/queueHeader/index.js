import React from 'react';
import {
  Text,
  View,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from '../../../components/UI/Icon';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonActionSheet from '../../../components/SalonActionSheet';
import styles from './styles';
import QueueNavButton from './queueNavButton';
import BarsActionSheet from '../../../components/BarsActionSheet';
import * as loginActions from '../../../actions/login';
import storeActions from '../../../actions/store';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;
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

  /*  <View style={styles.actionItemContainer}>
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
  </View>, */
  <Text style={styles.cancelTitle}>Cancel
  </Text>,
];

class QueueHeader extends React.Component {
  onSearchPress = () => this.props.onChangeSearchMode(true);
  onSearchCancel = () => this.props.onChangeSearchMode(false);
  onChangeSearchText = (searchText: String) => this.props.onChangeSearchText(searchText);

  handlePressAction(i) {
    const { navigation } = this.props;
    switch (i) {
      case 0:
        navigation.navigate(
          'TurnAway',
          {
            date: moment(), employee: null, fromTime: moment().format('HH:mm:ss'), apptBook: false,
          },
        );
        break;
      case 1:
        navigation.navigate('QueueCombine');
        break;
      default:
        break;
    }

    return false;
  }

  handlePress = (i) => {
    setTimeout(() => {
      this.handlePressAction(i);
    }, 500);
    return false;
  }


  showActionSheet = () => {
    this.SalonActionSheet.show();
  };

  showBarsActionSheet = () => {
    this.BarsActionSheet.show();
  }

  onLogoutPressed = () => this.props.auth.logout();

  onChangeStore = () => {
    this.props.storeActions.reselectMainStore();
  }
  assignBarsActionSheet = (item) => {
    this.BarsActionSheet = item;
  }
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

        <BarsActionSheet
          ref={this.assignBarsActionSheet}
          onLogout={this.onLogoutPressed}
          navigation={this.props.navigation}
          onChangeStore={this.onChangeStore}
        />

        <QueueNavButton
          type="solid"
          icon="bars"
          style={{
           alignItems: 'flex-start', flex: 1, paddingLeft: 8, paddingTop: 5,
          }}
          onPress={this.showBarsActionSheet}
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


QueueHeader.defaultProps = {};

QueueHeader.propTypes = {
  searchText: PropTypes.any.isRequired,
  searchMode: PropTypes.any.isRequired,
  onChangeSearchMode: PropTypes.any.isRequired,
  onChangeSearchText: PropTypes.any.isRequired,
  auth: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }).isRequired,
  storeActions: PropTypes.shape({
    reselectMainStore: PropTypes.func.isRequired,
  }).isRequired,
};

const mapActionToProps = dispatch => ({
  auth: bindActionCreators({ ...loginActions }, dispatch),
  storeActions: bindActionCreators({ ...storeActions }, dispatch),
});

export default connect(null, mapActionToProps)(QueueHeader);
