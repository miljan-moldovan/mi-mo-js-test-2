import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';

import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';

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


const onLongPress = (startTime, startDate, onPress, createAlert, hideAlert) => {
  const alert = {
    title: 'Question',
    description: 'The selected time is in the past. Do you want to book the appointment anyway?',
    btnLeftText: 'No',
    btnRightText: 'Yes',
    onPressRight: () => {
      onPress(startTime);
      hideAlert();
    },
  };
  const time = moment(
    `${startDate.format('YYYY-MM-DD')} ${startTime}`,
    'YYYY-MM-DD HH:mm',
  );

  const showBookingPastAlert = moment().isAfter(time, 'minute');
  if (showBookingPastAlert) {
    return createAlert(alert);
  }
  return onPress(startTime);
};

const renderItems = (item, index, apptGridSettings, onPress = null, startDate, createAlert, hideAlert) => {
  let startTime;
  let timeSplit;
  let minutesSplit;
  let style;
  const isCellDisabled = moment().isAfter(startDate, 'day');
  if (item && item.totalSlots > 0) {
    startTime = moment(item.startTime, 'HH:mm').add(15, 'm').format('HH:mm');
    timeSplit = startTime.split(':');
    [, minutesSplit] = timeSplit;
    style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
    const availableText = item.availableSlots / item.totalSlots === 1 ?
      'All available' : `${item.availableSlots} available`;
    return (
      <SalonTouchableOpacity
        wait={3000}
        onLongPress={() => onLongPress(item.startTime, startDate, onPress, createAlert, hideAlert)}
        key={item.startTime}
        style={style}
        disabled={isCellDisabled}
      >
        <Text style={[styles.textStyle, item.availableSlots === 0 && { fontWeight: '300' }]}>{availableText}</Text>
      </SalonTouchableOpacity>
    );
  }
  startTime = moment(apptGridSettings.minStartTime, 'HH:mm').add(15 * (index + 1), 'm').format('HH:mm');
  timeSplit = startTime.split(':');
  [, minutesSplit] = timeSplit;
  style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
  return (
    <SalonTouchableOpacity
      enabled={false}
      wait={3000}
      key={startTime}
      style={style}
      disabled={isCellDisabled}
    >
      <Text style={styles.disabledTextStyle}>No Availability</Text>
    </SalonTouchableOpacity>
  );
};

const availabilityColumn = ({ availability, apptGridSettings, onPress, startDate, createAlert, hideAlert }) => (
  <View>
    {
      availability.length > 0 ? availability.map((item, index) =>
        renderItems(item, index, apptGridSettings, onPress, startDate, createAlert, hideAlert)) : null
    }
  </View>
);

export default availabilityColumn;
