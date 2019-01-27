import * as React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import SalonActionSheet from '../../../../SalonActionSheet';
import styles from './styles';

class CrossedAppointmentsActionSheet extends React.Component {
  private SalonActionSheet: any;

  get options() {
    const { appointments } = this.props;

    if (!appointments || appointments.length === 0) {
      return [];
    }

    const optionsMap = appointments.map((appointment) => this.generateOption(appointment));

    optionsMap.push(this.renderRow('Cancel'));

    return optionsMap;
  }

  generateOption(appointment) {
    if (appointment.isBlockTime) {
      return this.renderRow(appointment.reason.name);
    }

    return this.renderRow(
      `${appointment.client.name} ${appointment.client.lastName} - ${appointment.service.description}`
    );
  }

  renderRow(textValue) {
    return (
      <View style={styles.actionItemContainer}>
        <Text
          ellipsizeMode={'tail'}
          numberOfLines={1}
          style={styles.actionItemTitle}
        >
          {textValue}
        </Text>
      </View>
    );
  }

  handlePressAction = (index) => {
    const { appointments } = this.props;
    const { options } = this;
    if (index !== (options.length - 1)) {
      this.props.handleOnPress(appointments[index]);
    }

    this.props.slidingUpPanelRefs.transitionTo(this.props.previousPosition);
    return false;
  }

  show = () => {
    this.props.slidingUpPanelRefs.transitionTo(10);
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
  slidingUpPanelRefs: PropTypes.object.isRequired,
  previousPosition: PropTypes.number,
};

export default CrossedAppointmentsActionSheet;
