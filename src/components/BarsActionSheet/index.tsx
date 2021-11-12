import * as React from 'react';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import SalonActionSheet from '../SalonActionSheet';
import styles from './styles';

const CANCEL_INDEX = 2;
const DESTRUCTIVE_INDEX = 2;

const options = [
  // hide change store
 /* (
    /*<View style={styles.actionItemContainer}>
      <View style={styles.actionItemLeft}>
        <Text style={styles.actionItemTitle}>Select Store</Text>
      </View>
      <View style={styles.actionItemRight}>
        <FontAwesome
          style={[styles.loginIconStyle, styles.selectStoreIconStyle]}
        >{Icons.chevronRight}
        </FontAwesome>
      </View>
    </View>
  ), */
  (
    <View style={styles.actionItemContainer}>
      <View style={styles.actionItemLeft}>
        <Text style={styles.actionItemTitle}>Logout</Text>
      </View>
      <View style={styles.actionItemRight}>
        <FontAwesome style={styles.loginIconStyle}>{Icons.signOut}</FontAwesome>
      </View>
    </View>),
  (
    <Text style={styles.cancelTitle}>Cancel
    </Text>
  ),
];

class BarsActionSheet extends React.Component {
  handlePressAction(i) {
    switch (i) {
     /* case 0:
        this.props.onChangeStore();
        break; */
      case 0:
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
  };

  show = () => {
    this.SalonActionSheet.show();
  };

  assignSalonActionsSheet = (item) => {
    this.SalonActionSheet = item;
  };

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
  onChangeStore: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default BarsActionSheet;
