import React from 'react';
import { View, Text } from 'react-native';

import ClientInfoButton from '../../../../../ClientInfoButton';
import { AppointmentTime } from '../../../../SalonNewAppointmentSlide';
import styles from './styles';

const appointmentHeader = ({ appointment, navigation, hidePanel }) => (
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

    {appointment.remarks !== '' &&
    <React.Fragment>
      <View style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
        <View style={styles.panelTopLineLeft}>
          <Text style={styles.panelTopRemarksTitle}>Remarks</Text>
        </View>
      </View>
      <View style={[styles.panelTopLine, { alignItems: 'center', minHeight: 25, backgroundColor: '#F1F1F1' }]}>
        <View style={[styles.panelTopLineLeft, { paddingLeft: 10 }]}>
          <Text style={styles.panelTopRemarks}>{appointment.remarks}</Text>
        </View>
      </View>
    </React.Fragment>
    }
  </React.Fragment>
);

export default appointmentHeader;
