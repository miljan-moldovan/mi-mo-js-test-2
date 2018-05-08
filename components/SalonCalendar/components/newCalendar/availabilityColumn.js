import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { times } from 'lodash';
import moment from 'moment';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 10,
    fontWeight: '500',
  },
  cellStyle: {
    height: 30,
    width: 64,
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

const renderItems = (item, index, apptGridSettings) => {
  const startTime = moment(apptGridSettings.minStartTime, 'HH:mm').add((index * apptGridSettings.step) + 15, 'm').format('HH:mm');
  const timeSplit = startTime.split(':');
  const minutesSplit = timeSplit[1];
  const style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
  return (
    <View key={item.startTime} style={style}>
      <Text style={styles.textStyle}>{`${item.availableSlots} avl.`}</Text>
    </View>
  );
};

const availabilityColumn = ({ availability, apptGridSettings }) => (
  <View>
    {
      availability.map((item, index) => renderItems(item, index, apptGridSettings))
    }
  </View>
);

export default availabilityColumn;
