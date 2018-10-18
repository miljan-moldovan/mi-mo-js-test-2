import React from 'react';
import { View, Text } from 'react-native';

import ClientInfoButton from '../../../../../ClientInfoButton';
import { AppointmentTime } from '../../../../SalonNewAppointmentSlide';
import styles from './styles';

const blockHeader = ({ appointment }) => (
  <React.Fragment>
    <View style={styles.panelTopLine}>
      <View style={styles.panelTopLineLeft}>
        <Text style={styles.panelTopName}>{appointment.reason.name}</Text>
      </View>
    </View>
    <View style={styles.panelTopLine}>
      <View style={styles.panelTopLineLeft}>
        <Text style={styles.panelTopService}>{`${appointment.employee.name} ${appointment.employee.lastName}`}</Text>
      </View>
    </View>

    <View style={styles.panelTopLine}>
      <View style={styles.panelTopLineLeft}>
        <AppointmentTime startTime={appointment.fromTime} endTime={appointment.toTime} />
      </View>
    </View>

    {appointment.notes &&
    <React.Fragment>
      <View style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
        <View style={styles.panelTopLineLeft}>
          <Text style={styles.panelTopRemarksTitle}>Comments</Text>
        </View>
      </View>
      <View style={[styles.panelTopLine, { alignItems: 'center', minHeight: 25, backgroundColor: '#F1F1F1' }]}>
        <View style={[styles.panelTopLineLeft, { paddingLeft: 10 }]}>
          <Text style={styles.panelTopRemarks}>{appointment.notes}</Text>
        </View>
      </View>
    </React.Fragment>
    }
  </React.Fragment>
);

export default blockHeader;
