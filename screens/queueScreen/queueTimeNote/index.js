import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import styles from './styles';
import Icon from '../../../components/UI/Icon';

const smallDevice = Dimensions.get('window').width === 320;

const QueueTimeNote = (props) => {
  const { item, type } = props;

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
    serviceTime = <Text style={styles.serviceTime}>  exp, start in <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>{timeCheckedIn}m</Text></Text>;
  } else if (status === 6) {
    if (estimatedTime >= 0) {
      serviceTime = <Text style={styles.serviceTime}> remaining  rem. <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>{estimatedTime}m</Text></Text>;
    } else {
      serviceTime = <Text style={styles.serviceTime}><Text style={styles.serviceRemainingWaitTime}> over</Text> <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>{+estimatedTime}m</Text></Text>;
    }
  } else if (status === 7) {
    if (estimatedTime >= 0) {
      serviceTime = <Text style={styles.serviceTime}> on time!</Text>;
    } else {
      serviceTime = <Text style={styles.serviceTime}><Text style={styles.serviceRemainingWaitTime}> over</Text> <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>{-estimatedTime}m</Text></Text>;
    }
  } else {
    serviceTime = <Text style={styles.serviceTime}>  exp, start in <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>0m</Text></Text>;
  }

  const serviceContainerStyle = type === 'short' ? {
    flexDirection: smallDevice ? 'column' : 'row',
    width: smallDevice ? 120 : '100%',
  } : { flexDirection: 'row', width: '100%' };

  const serviceTimeRightStyle = type === 'short' ?
    { marginLeft: smallDevice ? 20 : 0 } : { marginLeft: 0 };

  return (
    <View style={[styles.serviceTimeContainer, props.containerStyles, serviceContainerStyle]}>
      <View style={styles.serviceTimeLeft}>
        <Icon name="clockO" type="regularFree" style={styles.serviceClockIcon} />
        <Text style={styles.serviceTime}> {moment(item.enteredTime, 'hh:mm:ss').format('LT')} </Text>
        <Icon name="chevronRight" type="light" style={styles.chevronRightIcon} />
      </View>
      <View style={[styles.serviceTimeRight, serviceTimeRightStyle]}>
        <Text style={styles.serviceTime}>{serviceTime}</Text>
        {isAppointment && <Text style={styles.apptLabel}> Appt.</Text>}
      </View>
    </View>
  );
};

export default QueueTimeNote;
