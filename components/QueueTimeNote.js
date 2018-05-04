import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../components/UI/Icon';

const styles = StyleSheet.create({

  serviceTimeContainer: {
    marginTop: 11,
    //  marginBottom: 8,
    flexDirection: Dimensions.get('window').width === 320 ? 'column' : 'row',
    width: Dimensions.get('window').width === 320 ? 120 : '100%',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
  },
  serviceTime: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  chevronRightIcon: {
    fontSize: 10,
    color: '#000000',
    marginTop: 2,
    paddingHorizontal: 3,
  },
  serviceClockIcon: {
    fontSize: 12,
    color: '#7E8D98',
    paddingRight: 3,
    marginTop: 2,
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
  serviceTimeRight: {
    flexDirection: 'row',
    minWidth: 50,
    minHeight: 15,
    marginLeft: Dimensions.get('window').width === 320 ? 20 : 0,
  },
  serviceTimeLeft: {
    flexDirection: 'row',
    minWidth: 50,
    minHeight: 15,
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
    <View style={[styles.serviceTimeContainer, props.containerStyles]}>
      <View style={styles.serviceTimeLeft}>
        <Icon name="clockO" style={styles.serviceClockIcon} />
        <Text style={styles.serviceTime}> {moment(item.enteredTime, 'hh:mm:ss').format('LT')} </Text>
        <Icon name="chevronRight" style={styles.chevronRightIcon} />
      </View>
      <View style={styles.serviceTimeRight}>
        <Text style={styles.serviceTime}>{serviceTime}</Text>
        {isAppointment && <Text style={styles.apptLabel}> Appt.</Text>}
      </View>
    </View>
  );
};

export default QueueTimeNote;
