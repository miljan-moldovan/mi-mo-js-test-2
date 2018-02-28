import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import PropTypes from 'prop-types';

import AppointmentModel from '../../../../utilities/models/appointments';

import { QUEUE_ITEM_FINISHED, QUEUE_ITEM_RETURNING, QUEUE_ITEM_NOT_ARRIVED } from '../../../../constants/QueueStatus';
import CircularCountdown from '../../../../components/CircularCountdown';
import ServiceIcons from '../../../../components/ServiceIcons';
import SalonCard from '../../../../components/SalonCard';
import { InputButton } from '../../../../components/formHelpers';
import SalonAvatar from '../../../../components/SalonAvatar';

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
  serviceClockIcon: {
    fontSize: 12,
    // padding: 0,
    color: '#7E8D98',
    paddingRight: 7,
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
    backgroundColor: '#e2e9f1',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d9e0',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  infoTitleText: {
    color: '#4D5067',
    fontSize: 9,
    lineHeight: 14,
    fontFamily: 'Roboto-Regular',
  },
  content: {
    paddingHorizontal: 16,
  },
  titleText: {
    marginTop: 24,
    color: '#4D5067',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto-Medium',
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },
  employeeText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: '#2F3142',
  },
  providerRound: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  caretIcon: {
    color: '#115ECD',
    fontSize: 20,
    lineHeight: 22,
    marginLeft: 10,
  },
  price: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
    letterSpacing: 0,
  },
  addButtonText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto-Regular',
  },
});

const SalonAppointmentTime = props => (
  <Text style={styles.serviceTimeContainer}>
    <FontAwesome style={styles.serviceClockIcon}>{Icons.clockO}</FontAwesome>
    <Text style={styles.serviceTime}> {props.appointment.start_time}</Text> {'> REM Wait'} <Text style={styles.serviceRemainingWaitTime}>7m</Text>
  </Text>
);
SalonAppointmentTime.propTypes = {
  appointment: PropTypes.shape(AppointmentModel).isRequired,
};

const ServiceCard = props => (
  <SalonCard
    backgroundColor="white"
    containerStyles={{ marginHorizontal: 0 }}
    bodyStyles={{ paddingVertical: 10 }}
    bodyChildren={[
      <View style={{ flex: 1, alignSelf: 'flex-start' }}>
        <Text style={styles.serviceTitle}>Corrective C0l0R</Text>
        <View style={{ flexDirection: 'row' }}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={25}
            borderWidth={1}
            borderColor="transparent"
            image={{ uri: 'https://qph.fs.quoracdn.net/main-qimg-60b27864c5d69bdce69e6413b9819214' }}
          />
          <Text style={styles.employeeText}>Sarah Parker</Text>
        </View>
      </View>,
      <View
        style={{
        flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-end', flexDirection: 'row',
        }}
      >
        <View>
          <Text style={styles.price}>$40</Text>
        </View>
        <View>
          <FontAwesome style={styles.caretIcon}>{Icons.angleRight}</FontAwesome>
        </View>
      </View>,
    ]}
  />
);

const ProductCard = props => (
  <SalonCard
    backgroundColor="white"
    containerStyles={{ marginHorizontal: 0 }}
    bodyStyles={{ paddingVertical: 10 }}
    bodyChildren={[
      <View style={{ flex: 1, alignSelf: 'flex-start' }}>
        <Text style={styles.serviceTitle}>Dry Shampoo</Text>
        <Text style={styles.employeeText}>Dynamo Humm</Text>
      </View>,
      <View
        style={{
        flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-end', flexDirection: 'row',
        }}
      >
        <View>
          <Text style={styles.price}>$15</Text>
        </View>
        <View>
          <FontAwesome style={styles.caretIcon}>{Icons.angleRight}</FontAwesome>
        </View>
      </View>,
    ]}
  />
);

const CircularIcon = props => (
  <View style={{
    height: props.size,
    width: props.size,
    borderRadius: props.size / 2,
    backgroundColor: props.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  }}
  >
    <FontAwesome style={{
      color: props.color,
      fontSize: props.iconSize,
    }}
    >
      {Icons[props.icon]}
    </FontAwesome>
  </View>
);
CircularIcon.propTypes = {
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  iconSize: PropTypes.number,
  icon: PropTypes.string,
};
CircularIcon.defaultProps = {
  size: 22,
  backgroundColor: '#115ECD',
  color: 'white',
  iconSize: 16,
  icon: 'plus',
};

const AddButton = props => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
  }}
  >
    <CircularIcon />
    <Text style={styles.addButtonText}> {props.title}</Text>
  </View>
);
AddButton.propTypes = {
  title: PropTypes.string.isRequired,
};

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

    const { appointment } = this.state;
    const { client } = appointment;
    const label = this.getLabelForItem(appointment);

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitleText}>Queue Appointment</Text>
            <SalonAppointmentTime appointment={appointment} />
            <View style={{ alignSelf: 'flex-start' }}>
              <ServiceIcons direction="column" item={appointment} />
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {label}
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.titleText}>Client</Text>
          <SalonCard
            backgroundColor="white"
            containerStyles={{ marginHorizontal: 0 }}
            bodyStyles={{ paddingVertical: 0 }}
            bodyChildren={<InputButton placeholder="Client" value="What" onPress={() => alert('pressed')} />}
          />
          <Text style={styles.titleText}>Services</Text>
          <ServiceCard />
          <AddButton title="Add Service" />
          <Text style={styles.titleText}>Products</Text>
          <ProductCard />
          <AddButton title="Add Product" />
        </View>
      </View>
    );
  }
}
AppointmentDetails.propTypes = {
  appointment: PropTypes.shape(AppointmentModel).isRequired,
};

