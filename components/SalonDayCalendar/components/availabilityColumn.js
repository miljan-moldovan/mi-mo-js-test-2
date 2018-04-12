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
    width: 102,
    borderColor: '#C0C1C6',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const renderItems = (key, apptGridSettings, timeSchedules, providers) => {
  let total = 0;
  const timeElapsed = key * apptGridSettings.step;
  const currentTimeBlock = moment(apptGridSettings.startTime, 'HH:mm').add(timeElapsed, 'minutes');
  for (let i = 0; i < providers.length; i += 1) {
    const provider = timeSchedules[providers[i].id];
    if (provider.scheduledIntervals && provider.scheduledIntervals.length > 0) {
      const providerStartMoment = moment(provider.scheduledIntervals[0].start, 'HH:mm');
      const providerEndMoment = moment(provider.scheduledIntervals[0].end, 'HH:mm');
      if (currentTimeBlock.isSameOrAfter(providerStartMoment)
      && currentTimeBlock.isSameOrBefore(providerEndMoment)) {
        if (provider.appointments) {
          let isAvailable = true;
          for (let j = 0; j < provider.appointments.length && isAvailable; j += 1) {
            const appointment = provider.appointments[j];
            const appoitnmetStart = moment(appointment.fromTime, 'HH:mm');
            const appointmentEnd = appoitnmetStart.add(appointment.length);
            if (currentTimeBlock.isSameOrBefore(appointmentEnd)
            && currentTimeBlock.isSameOrAfter(appoitnmetStart)) {
              isAvailable = false;
            }
          }
          total = isAvailable ? total + 1 : total;
        } else {
          total += 1;
        }
      }
    }
  }
  return (
    <View key={key} style={styles.cellStyle}>
      <Text style={styles.textStyle}>{`${total} available`}</Text>
    </View>
  );
};

const availabilityColumn = ({ timeSchedules, providers, apptGridSettings }) => (
  <View>
    { times(
      apptGridSettings.numOfRow,
      index => renderItems(index, apptGridSettings, timeSchedules, providers),
      )
    }
  </View>
);

export default availabilityColumn;
