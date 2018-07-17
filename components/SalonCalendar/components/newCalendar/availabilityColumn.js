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
  disabledTextStyle: {
    fontFamily: 'Roboto',
    color: '#404040',
    fontSize: 10,
    fontWeight: '300',
  },
  cellStyle: {
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F8',
  },
  oClockBorder: {
    borderBottomColor: '#2c2f34',
  },
});

const renderItems = (item, index, apptGridSettings, onPress = () => {}, providers) => {
  let startTime;
  let timeSplit;
  let minutesSplit;
  let style;
  if (item && item.availableSlots > 0) {
    startTime = moment(item.startTime, 'HH:mm').add(15, 'm').format('HH:mm');
    timeSplit = startTime.split(':');
    minutesSplit = timeSplit[1];
    style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
    const availableText = item.availableSlots / item.totalSlots === 1 ? 'All available' : `${item.availableSlots} available`;
    return (
      <SalonTouchableOpacity
        wait={3000}
        onPress={() => onPress(item.startTime)}
        key={item.startTime}
        style={style}
      >
        <Text style={styles.textStyle}>{availableText}</Text>
      </SalonTouchableOpacity>
    );
  }
  startTime = moment(apptGridSettings.minStartTime, 'HH:mm').add(15 * (index + 1), 'm').format('HH:mm');
  timeSplit = startTime.split(':');
  minutesSplit = timeSplit[1];
  style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
  return (
    <SalonTouchableOpacity
      enabled={false}
      wait={3000}
      key={startTime}
      style={style}
    >
      <Text style={styles.disabledTextStyle}>No Availability</Text>
    </SalonTouchableOpacity>
  );
};

const availabilityColumn = ({ availability, apptGridSettings, onPress, providers }) => (
  <View>
    {
      availability.length > 0 ? availability.map((item, index) =>
        renderItems(item, index, apptGridSettings, onPress, providers)) : null
    }
  </View>
);

export default availabilityColumn;
