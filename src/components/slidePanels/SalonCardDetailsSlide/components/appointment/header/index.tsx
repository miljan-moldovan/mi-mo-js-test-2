import * as React from 'react';
import { View, Text } from 'react-native';

import ClientInfoButton from '../../../../../ClientInfoButton';
import { getBadges, getHiddenAddons } from '../../../../../../utilities/helpers';
import { AppointmentTime } from '../../../../SalonNewAppointmentSlide';
import styles from './styles';

const renderBadges = (appointment, appointments) => {
  const badges = getBadges(appointment, getHiddenAddons(appointments, appointment).length);
  for (let i = 0; i < badges.length; i += 1) {
    if (badges[i]) {
      return (
        <View style={{ padding: 5, flexDirection: 'row', backgroundColor: '#F1F1F1' }}>
          { badges }
        </View>
      );
    }
  }
  return null;
};

const appointmentHeader = ({
  appointment, navigation, hidePanel, appointments,
}) => (
  <React.Fragment>
    <View style={styles.panelTopLine}>
      <View style={styles.panelTopLineLeft}>
        <Text style={styles.panelTopName}>{`${appointment.client.name} ${appointment.client.lastName}`}</Text>
        <ClientInfoButton
          client={appointment.client}
          navigation={navigation}
          onDonePress={hidePanel}
          iconStyle={styles.infoIcon}
          apptBook
        />
      </View>
    </View>
    { renderBadges(appointment, appointments) }
    <View style={styles.panelTopLine}>
      <View style={styles.panelTopLineLeft}>
        <Text style={styles.panelTopService}>{appointment.service.description}</Text>
      </View>
    </View>

    <View style={styles.panelTopLine}>
      <View style={styles.panelTopLineLeft}>
        <AppointmentTime startTime={appointment.fromTime} endTime={appointment.toTime} />
      </View>
    </View>

    {appointment.remarks ?
      <React.Fragment>
        <View style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
          <View style={styles.panelTopLineLeft}>
            <Text style={styles.panelTopRemarksTitle}>Remarks</Text>
          </View>
        </View>
        <View style={[styles.panelTopLine, { alignItems: 'center', padding: 2, backgroundColor: '#F1F1F1' }]}>
          <View style={[styles.panelTopLineLeft, { paddingHorizontal: 5 }]}>
            <Text style={styles.panelTopRemarks}>{appointment.remarks}</Text>
          </View>
        </View>
      </React.Fragment> : null
    }
  </React.Fragment>
);

export default appointmentHeader;
