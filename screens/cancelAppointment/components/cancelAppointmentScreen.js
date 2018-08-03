import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';

import Icon from '../../../components/UI/Icon';
import { ProviderInput, InputGroup, InputDivider, InputText } from '../../../components/formHelpers';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './cancelApptStyles';

export default class CancelAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state: { params: { isBtnEnabled, handleCancel } }, goBack } = navigation;
    const btnTextStyle = isBtnEnabled ? styles.btnText : styles.btnTextDisabled;
    return {
      headerTitle: (
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Confirm Cancelling Appt.</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity
          style={styles.btn}
          onPress={goBack}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!isBtnEnabled}
          style={styles.btn}
          onPress={handleCancel}
        >
          <Text style={btnTextStyle}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    const { appointment: { employee } } = props.navigation.state.params;
    this.state = {
      selectedProvider: employee,
      reason: '',
    };
    props.navigation.setParams({ handleCancel: this.handleCancel, isBtnEnabled: false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCancelling && !nextProps.isCancelling) {
      this.props.navigation.goBack();
    }
  }

  setProvider = (selectedProvider) => {
    this.setState({ selectedProvider }, this.isBtnEnabled);
  }

  handleCancel = () => {
    const { reason, selectedProvider } = this.state;
    const { appointment } = this.props.navigation.state.params;
    const employeeId = selectedProvider.id;
    this.props.cancelAppointment(appointment.id, { reason, employeeId });
  }

  goBack = (navigation) => {
    navigation.goBack();
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelText}>Cancel</Text>,
    leftButtonOnPress: this.goBack,
  })

  handleChange = (reason) => {
    this.setState({ reason }, this.isBtnEnabled);
  }

  isBtnEnabled = () => {
    const { navigation } = this.props;
    const { selectedProvider, reason } = this.state;
    const isBtnEnabled = selectedProvider && reason;
    navigation.setParams({ isBtnEnabled });
  }

  render() {
    const { selectedProvider, reason } = this.state;
    const { appointment } = this.props.navigation.state.params;
    const { client, service, employee } = appointment;
    const serviceName = service.description.toUpperCase();
    const employeeName = `${employee.name.toUpperCase()} ${employee.lastName[0]}.`;
    const fromTimeMoment = moment(appointment.fromTime, 'HH:mm');
    const toTimeMoment = moment(appointment.toTime, 'HH:mm');
    const dateMoment = moment(appointment.date, 'YYYY-MM-DD');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.apptInfo}>
            <Text style={styles.clientName}>{`${client.name} ${client.lastName}`}</Text>
            <Text style={styles.serviceInfo}>{`${serviceName} with ${employeeName}`}</Text>
            <View style={styles.timeContainer}>
              <Icon style={styles.clockIcon} name="clockO" type="regular" size={12} color="rgb(122, 139, 149)" />
              <Text style={styles.timeInfo}>{fromTimeMoment.format('HH:mmA')}</Text>
              <Icon name="chevronRight" size={8} type="light" color="#000" style={styles.chevronRightIcon} />
              <Text style={styles.timeInfo}>{toTimeMoment.format('HH:mmA')}</Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>{dateMoment.format('D')}</Text>
            <Text style={styles.monthText}>{dateMoment.format('MMM').toUpperCase()}</Text>
          </View>
        </View>
        <InputGroup>
          <ProviderInput
            placeholder="Select Employee"
            labelText="Employee"
            selectedProvider={selectedProvider}
            avatarSize={20}
            navigate={this.props.navigation.navigate}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
            onChange={this.setProvider}
            apptBook
          />
          <InputDivider />
          <Text style={styles.label}>Reason</Text>
          <InputText
            isEditable
            placeholder="Please specify"
            onChangeText={this.handleChange}
            value={reason}
          />
        </InputGroup>
        <Text style={styles.footer}>IN ORDER TO CANCEL THIS APPOINTMENT, PLEASE ENTER
          YOUR REASON FOR CANCELING THE APPOINTMENT.
        </Text>
      </View>
    );
  }
}

CancelAppointmentScreen.propTypes = {
  cancelAppointment: PropTypes.func.isRequired,
  isCancelling: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        isBtnEnabled: PropTypes.bool,
        handleCancel: PropTypes.func,
        appointment: PropTypes.shape({
          id: PropTypes.number,
          fromTime: PropTypes.string,
          toTime: PropTypes.string,
          date: PropTypes.string,
          client: PropTypes.shape({
            name: PropTypes.string,
            lastName: PropTypes.string,
          }),
          employee: PropTypes.shape({
            name: PropTypes.string,
            lastName: PropTypes.string,
          }),
          service: PropTypes.shape({
            description: PropTypes.string,
          }),
        }),
      }),
    }),
  }).isRequired,
};
