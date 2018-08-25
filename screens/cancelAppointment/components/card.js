import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../../../components/UI/Icon';
import styles from './cancelApptStyles';

const card = ({
  client, serviceName, employeeName, fromTime, toTime, day, month,
}) => (
  <View style={styles.header}>
    <View style={styles.apptInfo}>
      <Text style={styles.clientName}>{`${client.name} ${client.lastName}`}</Text>
      <Text style={styles.serviceInfo}>{`${serviceName} with ${employeeName}`}</Text>
      <View style={styles.timeContainer}>
        <Icon style={styles.clockIcon} name="clockO" type="regular" size={12} color="rgb(122, 139, 149)" />
        <Text style={styles.timeInfo}>{fromTime}</Text>
        <Icon name="chevronRight" size={8} type="light" color="#000" style={styles.chevronRightIcon} />
        <Text style={styles.timeInfo}>{toTime}</Text>
      </View>
    </View>
    <View style={styles.dateContainer}>
      <Text style={styles.dayText}>{day}</Text>
      <Text style={styles.monthText}>{month}</Text>
    </View>
  </View>
);

card.propTypes = {
  client: PropTypes.shape({
    name: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  serviceName: PropTypes.string.isRequired,
  employeeName: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  fromTime: PropTypes.string.isRequired,
  toTime: PropTypes.string.isRequired,
};

export default card;
