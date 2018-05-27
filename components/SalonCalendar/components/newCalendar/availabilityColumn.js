import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { times } from 'lodash';
import moment from 'moment';

import SalonTouchableOpacity from '../../../SalonTouchableOpacity';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 10,
    fontWeight: '500',
  },
  cellStyle: {
    height: 30,
    width: 102,
    borderColor: '#C0C1C6',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  oClockBorder: {
    borderBottomColor: '#2c2f34',
  },
});

const renderItems = (item, index, apptGridSettings, onPress = () => {}) => {
  const startTime = moment(item.startTime, 'HH:mm').add(15, 'm').format('HH:mm');
  const timeSplit = startTime.split(':');
  const minutesSplit = timeSplit[1];
  const style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;

  return (
    <SalonTouchableOpacity
      wait={3000}
      onPress={() => onPress(item.startTime)}
      key={item.startTime}
      style={style}
    >
      <Text style={styles.textStyle}>{`${item.availableSlots} available`}</Text>
    </SalonTouchableOpacity>
  );
};

const availabilityColumn = ({ availability, apptGridSettings, onPress }) => (
  <View>
    {
      availability.length > 0 ? availability.map((item, index) => renderItems(item, index, apptGridSettings, onPress))
      : null
    }
  </View>
);

export default availabilityColumn;
