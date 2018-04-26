import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../components/UI/Icon';

const styles = StyleSheet.create({

  serviceTimeContainer: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#000',
    marginTop: 11,
    marginBottom: 8,
    flexDirection: 'row',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
  },
  serviceTime: {

  },
  chevronRightIcon: {
    fontSize: 12,
    color: '#000000',
  },
  waitingTime: {
    marginRight: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(17,10,36,1)',
    borderRadius: 4,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 2,
    height: 16,
    minWidth: 56,
    marginBottom: 14,
  },
  serviceClockIcon: {
    fontSize: 12,
    color: '#7E8D98',
    paddingRight: 7,
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
});

const QueueTimeNote = (props) => {
  const { item } = props;

  let estimatedTime = moment(item.estimatedTime, 'hh:mm:ss').isValid()
    ? moment(item.estimatedTime, 'hh:mm:ss').hours() * 60 + moment(item.estimatedTime, 'hh:mm:ss').minutes()
    : 0;

  if (item.estimatedTime && item.estimatedTime[0] === '-') {
    estimatedTime *= (-1);
  }

  const status = item.status;
  const isAppointment = item.queueType === 1;

  let serviceTime = {};

  if (status === 0 || status === 1 || status === 5) {
    const timeCheckedIn = item.status === 5 ? 0 : estimatedTime;
    serviceTime = <Text style={styles.serviceTime}>  exp, start in <Text style={styles.serviceRemainingWaitTime}> {timeCheckedIn}m</Text></Text>;
  } else if (status === 6) {
    if (estimatedTime >= 0) {
      serviceTime = <Text style={styles.serviceTime}> remaining  rem. <Text style={styles.serviceRemainingWaitTime}> {estimatedTime}m</Text></Text>;
    } else {
      serviceTime = <Text style={styles.serviceTime}><Text style={styles.serviceRemainingWaitTime}> over {+estimatedTime}m</Text></Text>;
    }
  } else if (status === 7) {
    if (estimatedTime >= 0) {
      serviceTime = <Text style={styles.serviceTime}> on time!</Text>;
    } else {
      serviceTime = <Text style={styles.serviceTime}><Text style={styles.serviceRemainingWaitTime}> over {-estimatedTime}m</Text></Text>;
    }
  } else {
    serviceTime = <Text style={styles.serviceTime}>  exp, start in <Text style={styles.serviceRemainingWaitTime}> 0m</Text></Text>;
  }

  return (
    <Text style={[styles.serviceTimeContainer, props.containerStyles]}><Icon name="clockO" style={styles.serviceClockIcon} /><Text style={styles.serviceTime}> {moment(item.enteredTime, 'hh:mm:ss').format('LT')} </Text><Icon name="chevronRight" style={styles.chevronRightIcon} />{serviceTime}{isAppointment && <Text style={styles.apptLabel}> Appt.</Text>}</Text>
  );
};

export default QueueTimeNote;
