import * as React from 'react';
import { View, Text } from 'react-native';

import ClientInfoButton from '../../../../../ClientInfoButton';
import { getBadges, getHiddenAddons } from '../../../../../../utilities/helpers';
import { AppointmentTime } from '../../../../SalonNewAppointmentSlide';
import styles from './styles';
import ShowMoreText from '@/components/ShowMoreText';

const renderBadges = (appointment, appointments) => {
  const badges = getBadges(appointment, getHiddenAddons(appointments, appointment).length);
  return badges.map((item, index) => {
    return (
      <View
        key={index}
        style={styles.containerForBadges}
      >
        {item}
      </View>
    );
  });
};

const appointmentHeader = (props) => {
  const {
    appointment, navigation, hidePanel, appointments,
  } = props;

  return (
    <React.Fragment>
      <View style={styles.panelTopLine}>
        <View style={styles.panelTopLineLeft}>
          {renderBadges(appointment, appointments)}
          <Text style={styles.panelTopName}>{`${appointment.client.name} ${appointment.client.lastName}`}</Text>
          <ClientInfoButton
            client={appointment.client}
            navigation={navigation}
            onDonePress={hidePanel}
            apptBook
          />
        </View>
      </View>
      <View style={[styles.panelTopLine, { marginTop: 5 }]}>
        <View style={styles.panelTopLineLeft}>
          <Text style={styles.panelTopService}>{appointment.service.description}</Text>
        </View>
      </View>
      <View style={[styles.panelTopLine, { marginTop: 10 }]}>
        <View style={styles.panelTopLineLeft}>
          <AppointmentTime startTime={appointment.fromTime} endTime={appointment.toTime} />
        </View>
      </View>
      {renderShowText(appointment.remarks)}
    </React.Fragment>
  );
};

const renderShowText = (remarks) => {
  if (!remarks) {
    return null;
  }

  return (
    <React.Fragment>
      <View style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
        <View style={styles.panelTopLineLeft}>
          <Text style={styles.panelTopRemarksTitle}>Remarks</Text>
        </View>
      </View>
      <ShowMoreText
        text={remarks}
      />
    </React.Fragment>
  );
};

export default appointmentHeader;
