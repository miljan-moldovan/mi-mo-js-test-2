import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ProviderInput, InputGroup, InputDivider, InputText } from '../../../components/formHelpers';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './cancelApptStyles';
import Card from './card';
import SalonHeader from '../../../components/SalonHeader';

export default class CancelAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state: { params: { isBtnEnabled, handleCancel } }, goBack } = navigation;
    const btnTextStyle = isBtnEnabled ? styles.btnText : styles.btnTextDisabled;
    return {
      header: (
        <SalonHeader
          title="Confirm Cancelling Appt."
          headerLeft={(
            <SalonTouchableOpacity
              style={[styles.btn, { marginLeft: 10 }]}
              onPress={goBack}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </SalonTouchableOpacity>
          )}
          headerRight={(
            <SalonTouchableOpacity
              disabled={!isBtnEnabled}
              style={[styles.btn, { marginRight: 10 }]}
              onPress={handleCancel}
            >
              <Text style={btnTextStyle}>Done</Text>
            </SalonTouchableOpacity>
          )}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    const { appointments } = props.navigation.state.params;
    const { employee } = appointments[0];
    this.state = {
      selectedProvider: employee,
      reason: '',
      height1: 0,
      height2: 0,
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
    const { reason } = this.state;
    const { appointments } = this.props.navigation.state.params;
    const appointmentIds = appointments.map(appt => appt.id);
    if (appointments[0].isBlockTime) {
      this.props.cancelBlock(appointmentIds[0]);
    } else {
      this.props.cancelAppointment({ appointmentIds, appointmentCancellation: { reason } });
    }
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

  measureView = ({ nativeEvent: { layout: { width, height } } }) => {
    if (!this.state.height1) {
      this.setState(prevState => ({
        height1: height,
      }));
    }
  }

  measureView2 = ({ nativeEvent: { layout: { width, height } } }) => {
    if (!this.state.height2) {
      this.setState(prevState => ({
        height2: height,
      }));
    }
  }

  renderCard = (appointment) => {
    const {
      isBlockTime, client, service, employee,
    } = appointment;
    const employeeName = `${employee.name.toUpperCase()} ${employee.lastName[0]}.`;
    const subtitle = isBlockTime ? employeeName : `${service.description.toUpperCase()} with ${employeeName}`;
    const fromTime = moment(appointment.fromTime, 'HH:mm').format('h:mmA');
    const toTime = moment(appointment.toTime, 'HH:mm').format('h:mmA');
    const dateMoment = moment(appointment.date, 'YYYY-MM-DD');
    const title = isBlockTime ? appointment.reason.name : `${client.name} ${client.lastName}`;
    const props = {
      title,
      subtitle,
      fromTime,
      toTime,
      day: dateMoment.format('D'),
      month: dateMoment.format('MMM').toUpperCase(),
    };
    return (<Card {...props} />);
  }

  render() {
    const { selectedProvider, reason } = this.state;
    const { appointments } = this.props.navigation.state.params;
    const maxHeight = this.state.height1 - this.height2;
    const scrollViewHeight = 86.5 * appointments.length;
    const height = scrollViewHeight > maxHeight ? maxHeight : scrollViewHeight;
    return (
      <KeyboardAwareScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="always"
        enableAutoAutomaticScroll
      >
        <View
          style={styles.container}
          onLayout={this.measureView}
        >
          <ScrollView contentContainerStyle={{ maxHeight: height }} style={{ maxHeight: height }}>
            {appointments.map(this.renderCard)}
          </ScrollView>
          <View style={styles.bottomContainer} onLayout={this.measureView2}>
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
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

CancelAppointmentScreen.propTypes = {
  cancelAppointment: PropTypes.func.isRequired,
  cancelBlock: PropTypes.func.isRequired,
  isCancelling: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        isBtnEnabled: PropTypes.bool,
        handleCancel: PropTypes.func,
        appointments: PropTypes.arrayOf(PropTypes.shape({
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
        })),
      }),
    }),
  }).isRequired,
};
