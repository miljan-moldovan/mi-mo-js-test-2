import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import SalonActionSheet from '../../../../../components/SalonActionSheet';
import styles from './styles';

class CrossedAppointmentsActionSheet extends React.Component {
  get options() {
    const { appointments } = this.props;
    if (!appointments || appointments.length === 0) {
      return [];
    }
    const optionsMap = appointments.map((appointment) => (
      <View style={styles.actionItemContainer}>
        <Text style={styles.actionItemTitle}>{`${appointment.client.name} ${appointment.client.lastName}`}</Text>
      </View>
    ));
    optionsMap.push((
      <View style={styles.actionItemContainer}>
        <Text style={styles.actionItemTitle}>Cancel</Text>
      </View>
    ));
    return optionsMap;
  }

  handlePressAction = (index) => {
    const { appointments } = this.props;
    const { options } = this;
    if (index !== (options.length - 1)) {
      this.props.handleOnPress(appointments[index]);
    }

    return false;
  }

  show = () => {
    this.SalonActionSheet.show();
  };

  assignSalonActionsSheet = (item) => {
    this.SalonActionSheet = item;
  }

  render() {
    const { options } = this;
    return (
      <SalonActionSheet
        ref={this.assignSalonActionsSheet}
        options={options}
        cancelButtonIndex={options.length - 1}
        destructiveButtonIndex={options.length - 1}
        onPress={this.handlePressAction}
        wrapperStyle={{ paddingBottom: 11 }}
      />
    );
  }
}

CrossedAppointmentsActionSheet.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.shape({
    client: PropTypes.shape({
      name: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
  handleOnPress: PropTypes.func.isRequired,
};

export default CrossedAppointmentsActionSheet;
