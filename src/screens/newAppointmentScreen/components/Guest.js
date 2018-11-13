import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { SubTitle } from '../NewAppointmentScreen';
import Icon from '../../../components/UI/Icon';
import SalonCard from '../../../components/SalonCard';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import { ClientInput } from '../../../components/formHelpers';
import styles from '../styles';

const RemoveGuest = ({ onPress }) => (
  <View style={styles.removeGuestContainer}>
    <SalonTouchableOpacity
      style={styles.flexRow}
      onPress={onPress}
    >
      <Icon
        name="timesCircle"
        type="solid"
        color="red"
        size={10}
      />
      <Text style={styles.removeGuestText}>REMOVE</Text>
    </SalonTouchableOpacity>
  </View>
);

const Guest = props => (
  <View style={styles.flexColumn}>
    <SubTitle style={styles.guestSubTitle} title={`Guest ${props.index + 1}`}>
      <RemoveGuest onPress={() => props.onRemove()} />
    </SubTitle>
    <SalonCard
      bodyStyles={styles.cardPadding}
      bodyChildren={(
        <ClientInput
          style={styles.guestInput}
          label={false}
          apptBook
          placeholder="Select a Client"
          selectedClient={props.selectedClient}
          onChange={client => props.onChange(client)}
          iconStyle={styles.inputIconColor}
          headerProps={{
            title: 'Clients',
            leftButton: <Text style={styles.headerButtonText}>Cancel</Text>,
            leftButtonOnPress: navigation => navigation.goBack(),
          }}
          {...props}
        />
      )}
      backgroundColor="white"
    />
  </View>
);
export default Guest;
