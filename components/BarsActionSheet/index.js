import React from 'react';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import SalonActionSheet from '../../components/SalonActionSheet';
import styles from './styles';
import Icon from '../UI/Icon';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;

const options = [
  <View style={styles.actionItemContainer}>
    <View style={styles.actionItemLeft}>
      <Text style={styles.actionItemTitle}>Options</Text>
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
      <Text style={styles.actionItemTitle}>Logout</Text>
    </View>
    <View style={styles.actionItemRight}>
      <FontAwesome style={styles.loginIconStyle}>{Icons.signOut}</FontAwesome>
    </View>
  </View>,
  <Text style={styles.cancelTitle}>Cancel
  </Text>,
];

class BarsActionSheet extends React.Component {
  handlePressAction(i) {
    const { navigation } = this.props;
    switch (i) {
      case 0:
        navigation.navigate('Settings');
        break;
      case 1:
        this.props.onLogout();
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

  show = () => {
    this.SalonActionSheet.show();
  };

  assignSalonActionsSheet = (item) => {
    this.SalonActionSheet = item;
  }

  render() {
    return (
      <SalonActionSheet
        ref={this.assignSalonActionsSheet}
        options={options}
        cancelButtonIndex={CANCEL_INDEX}
        destructiveButtonIndex={DESTRUCTIVE_INDEX}
        onPress={this.handlePress}
        wrapperStyle={{ paddingBottom: 11 }}
      />
    );
  }
}

BarsActionSheet.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default BarsActionSheet;
