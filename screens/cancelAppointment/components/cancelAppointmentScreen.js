import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';

import Icon from '../../../components/UI/Icon';
import { ProviderInput, InputGroup, InputDivider, InputText } from '../../../components/formHelpers';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 86.5,
    backgroundColor: 'rgb(227, 233, 241)',
    flexDirection: 'row',
    paddingHorizontal: 17,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
    marginBottom: 23,
  },
  clientName: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#111415',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  serviceInfo: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#4D5067',
    lineHeight: 13,
    marginBottom: 7,
  },
  timeInfo: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#000000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronRightIcon: {
    marginHorizontal: 6.5,
  },
  clockIcon: {
    marginRight: 5,
  },
  apptInfo: {
    flex: 1,
  },
  dateContainer: {
    paddingTop: 4,
    backgroundColor: '#fff',
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#4D5067',
    lineHeight: 18,
  },
  monthText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#115ECD',
    lineHeight: 10,
  },
  footer: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#727A8F',
    lineHeight: 18,
    marginHorizontal: 17,
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto',
    marginTop: 12,
  },
  cancelText: {
    fontSize: 14,
    color: 'white',
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#fff',
  },
  btnTextDisabled: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.3)',
  },
  btn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
    props.navigation.setParams({ handleCancel: this.handleCancel, isBtnEnabled: false })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCanceling && !nextProps.isCanceling) {
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
    navigation.setParams({ isBtnEnabled })
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
