import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import Icon from '../../UI/Icon';
import Colors from '../../../constants/Colors';
import styles from '../styles';

const ConflictBox = props => (
  <SalonTouchableOpacity
    onPress={() => props.onPress()}
    style={[styles.conflictBox, props.style]}
  >
    <View style={styles.conflictBoxInner}>
      <Icon type="solid" name="warning" color={Colors.defaultRed} size={12} />
      <Text style={styles.conflictBoxTitleText}>Conflicts found</Text>
    </View>
    <Text style={styles.conflictBoxShowText}>Show Conflicts</Text>
  </SalonTouchableOpacity>
);
export default ConflictBox;
