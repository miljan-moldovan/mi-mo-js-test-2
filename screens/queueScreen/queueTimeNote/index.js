import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Text } from 'react-native';
import moment from 'moment';
import styles from './styles';
import Icon from '../../../components/UI/Icon';

const smallDevice = false; // Dimensions.get('window').width === 320;

const calcEstimatedTime = (estimatedTime) => {
  const seconds = moment(estimatedTime, 'hh:mm:ss').seconds() > 0 ? 1 : 0;
  return moment(estimatedTime, 'hh:mm:ss').hours() * 60 +
  moment(estimatedTime, 'hh:mm:ss').minutes() + seconds;
};

const QueueTimeNote = (props) => {
  const { item, type } = props;


  let showAgo = false;

  const estimatedTime = moment(item.estimatedTime, 'hh:mm:ss').isValid()
    ? calcEstimatedTime(item.estimatedTime)
    : 0;

  if (item.estimatedTime && item.estimatedTime[0] === '-') {
    // estimatedTime = estimatedTime * (-1);
    showAgo = true;
  }

  const { status } = item;
  const isAppointment = item.queueType === 1;

  let serviceTime = {};


  if (status === 0 || status === 1 || status === 5) {
    const timeCheckedIn = item.status === 5 ? 0 : estimatedTime;
    serviceTime = (
      <Text style={styles.serviceTime}>  exp. start in <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>
        {timeCheckedIn}m
      </Text>
        {showAgo && <Text style={styles.serviceTime}> ago</Text>}
      </Text>);
  } else if (status === 6) {
    if (estimatedTime >= 0 && moment(item.progressTime, 'hh:mm:ss').isBefore(moment(item.progressMaxTime, 'hh:mm:ss'))) {
      serviceTime = (
        <Text style={styles.serviceTime}> remaining
          <Text style={[styles.serviceRemainingWaitTime]}>
            {estimatedTime}m
          </Text>
        </Text>
      );
    } else {
      serviceTime = (
        <Text style={styles.serviceTime}> over {+estimatedTime}m
        </Text>
      );
    }
  } else if (status === 7) {
    if (estimatedTime >= 0 && moment(item.progressTime, 'hh:mm:ss').isBefore(moment(item.progressMaxTime, 'hh:mm:ss'))) {
      serviceTime = (
        <Text style={styles.serviceTime}> on time!
        </Text>
      );
    } else {
      serviceTime = (
        <Text style={styles.serviceTime}> over {-estimatedTime}m
        </Text>
      );
    }
  } else {
    serviceTime = (
      <Text style={styles.serviceTime}>  exp. start in
        <Text style={[styles.serviceRemainingWaitTime, styles.underline]}>0m</Text>
      </Text>);
  }

  const serviceContainerStyle = type === 'short' ? {
    flexDirection: smallDevice ? 'column' : 'row',
    width: smallDevice ? 120 : '100%',
  } : { flexDirection: 'row', width: '100%' };

  // const serviceTimeRightStyle = type === 'short' ?
  //   { marginLeft: smallDevice ? 20 : 0 } : { marginLeft: 0 };

  const serviceTimeRightStyle = { marginLeft: 0 };


  // todo: (Malakhov) Temp fix for demo need check with Back
  // const enteredTime = moment(getTypeTime(item), 'hh:mm:ss').format('LT');
  const startTime = moment(item.startTime, 'hh:mm:ss').format('LT');


  return (
    <View style={[styles.serviceTimeContainer, props.containerStyles, serviceContainerStyle]}>
      <View style={styles.serviceTimeLeft}>
        <Icon name="clockO" type="regularFree" style={styles.serviceClockIcon} />
        <Text style={styles.serviceTime}> {startTime} </Text>
        <Icon name="chevronRight" type="light" style={styles.chevronRightIcon} />
      </View>
      <View style={[styles.serviceTimeRight, serviceTimeRightStyle]}>
        <Text style={styles.serviceTime}>{serviceTime}</Text>
        {isAppointment && <Text style={styles.apptLabel}> Appt.</Text>}
      </View>
    </View>
  );
};


QueueTimeNote.defaultProps = {

};

QueueTimeNote.propTypes = {
  containerStyles: PropTypes.any.isRequired,
  item: PropTypes.any.isRequired,
  type: PropTypes.any.isRequired,
};


export default QueueTimeNote;
