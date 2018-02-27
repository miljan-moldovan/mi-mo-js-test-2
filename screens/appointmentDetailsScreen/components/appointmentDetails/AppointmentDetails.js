import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED } from '../../../../constants/QueueStatus';
import CircularCountdown from '../../../../components/CircularCountdown';
import ServiceIcons from '../../../../components/ServiceIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  serviceTimeContainer: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#000',
    marginTop: 'auto',
    marginBottom: 8,
    flexDirection: 'row',
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  serviceTime: {
    // fontFamily: 'OpenSans-Bold',
  },
  waitingTime: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(17,10,36,1)',
    borderRadius: 4,
    borderColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  circularCountdown: {
    marginRight: 15,
    alignItems: 'center',
  },
  waitingTimeTextTop: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#999',
  },
  infoContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.3)',
  },
});

export default class AppointmentDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointment: this.props.appointment,
    };
  }

  getLabelForItem = (item) => {
    switch (item.status) {
      case QUEUE_ITEM_FINISHED:
        return (
          <View style={styles.finishedContainer}>
            <View style={[styles.waitingTime, { backgroundColor: 'black', marginRight: 0 }]}>
              <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>FINISHED</Text>
            </View>
            <View style={styles.finishedTime}>
              <View style={[styles.finishedTimeFlag, item.processTime > item.estimatedTime ? { backgroundColor: '#D1242A' } : null]} />
              <Text style={styles.finishedTimeText}>{item.processTime}min / <Text style={{ fontFamily: 'Roboto-Regular' }}>{item.estimatedTime}min est.</Text></Text>
            </View>
          </View>
        );
      case QUEUE_ITEM_RETURNING:
        return (
          <View style={[styles.waitingTime, { backgroundColor: 'black' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: 'white' }]}>RETURNING</Text>
          </View>
        );
      case QUEUE_ITEM_NOT_ARRIVED:
        return (
          <View style={[styles.waitingTime, { backgroundColor: 'rgba(192,193,198,1)' }]}>
            <Text style={[styles.waitingTimeTextTop, { color: '#555' }]}>NOT ARRIVED</Text>
          </View>
        );
      default:
        return (
          <CircularCountdown
            size={58}
            estimatedTime={item.estimatedTime}
            processTime={item.processTime}
            itemStatus={item.status}
            style={styles.circularCountdown}
          />
        );
    }
  }

  render() {
    if (this.state.appointment === null) {
      return null;
    }
    const label = this.getLabelForItem(this.state.appointment);
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <ServiceIcons item={this.state.appointment} />
          {label}
        </View>
        <View style={styles.container}>
          <Text style={styles.serviceTimeContainer}>
            <FontAwesome style={styles.serviceClockIcon}>{Icons.clockO}</FontAwesome>
            <Text style={styles.serviceTime}> {this.state.appointment.start_time}</Text> > REM Wait <Text style={styles.serviceRemainingWaitTime}>7m</Text>
          </Text>
          <Text>{this.state.appointment ? this.state.appointment.client.name : ''}</Text>
        </View>
      </View>
    );
  }
}
