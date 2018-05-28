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
    width: 102,
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
  if (item) {
    startTime = moment(item.startTime, 'HH:mm').add(15, 'm').format('HH:mm');
    timeSplit = startTime.split(':');
    minutesSplit = timeSplit[1];
    style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
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
  }
  startTime = moment(apptGridSettings.minStartTime, 'HH:mm').add(15 * (index + 1), 'm').format('HH:mm');
  timeSplit = startTime.split(':');
  minutesSplit = timeSplit[1];
  style = minutesSplit === '00' ? [styles.cellStyle, styles.oClockBorder] : styles.cellStyle;
  // const time = moment(apptGridSettings.minStartTime, 'HH:mm').add(15 * index, 'm');
  // let areAllAvailable = false;
  // for (let i = 0; i < providers.length && !areAllAvailable; i += 1) {
  //   const schedule = providers[i].scheduledIntervals;
  //   if (schedule) {
  //     for (let j = 0; j < schedule.length && !areAllAvailable; j += 1) {
  //       if (time.isSameOrAfter(moment(schedule[j].start, 'HH:mm')) &&
  //       time.isBefore(moment(schedule[j].end, 'HH:mm'))) {
  //         areAllAvailable = true;
  //         break;
  //       }
  //     }
  //   }
  // }
  //const renderText = areAllAvailable ? 'All available' : 'No availability';
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
      availability.length > 0 ? availability.map((item, index) => renderItems(item, index, apptGridSettings, onPress, providers))
      : times(apptGridSettings.numOfRow, index => renderItems(null, index, apptGridSettings, onPress, providers))
    }
  </View>
);

export default availabilityColumn;
