import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputGroup,
  InputNumber,
  InputSwitch,
  InputDivider,
  SectionTitle,
  InputLabel,
  SectionDivider,
} from '../../components/formHelpers';
import { find, remove } from 'lodash';
import styles from './styles';


class RebookDialogScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const { appointment } = params;
    const { client } = appointment;


    const fullName = 'fullName' in client ? client.fullName : `${client.name} ${client.lastName}`;

    return {
      headerTitle: (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleTitle}>
          Rebook
          </Text>
          <Text style={styles.headerTitleSubTitle}>
            {`${fullName}`}
          </Text>
        </View>
      ),

      headerLeft: (
        <View style={styles.leftButtonContainer}>
          <SalonTouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerLeftText}>Cancel</Text>
          </SalonTouchableOpacity>
        </View>
      ),
      headerRight: (
        <View style={styles.rightButtonContainer}>
          <SalonTouchableOpacity
            disabled={!canSave}
            onPress={() => {
            if (navigation.state.params.handleDone) {
              navigation.state.params.handleDone();
            }
          }}
          >
            <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
            Done
            </Text>
          </SalonTouchableOpacity>
        </View>
      ),
    };
  }

  state = {
    date: moment().add(1, 'weeks'),
    weeks: 1,
    updateRebookingPref: false,
    shouldRebookServices: {},
    rebookServices: [],
  };

  componentWillMount() {
    this.props.navigation.setParams({
      handleDone: () => this.saveRebook(),
    });

    const { appointment } = this.props.navigation.state.params;

    if ('service' in appointment && !('services' in appointment)) {
      const { service } = appointment;
      service.employee = appointment.employee;
      service.serviceLength = service.serviceLength ? service.serviceLength : service.duration;
      appointment.services = [service];
    }

    if (appointment.services.length === 1) {
      this.setState({ rebookServices: appointment.services }, this.checkCanSave);
    }
  }

  onChangeWeeks = (operation, weeks) => {
    if (operation === 'add') {
      this.setState({ date: moment(this.state.date, 'YYYY-MM-DD').add(1, 'weeks'), weeks }, this.checkCanSave);
    } else {
      this.setState({ date: moment(this.state.date, 'YYYY-MM-DD').subtract(1, 'weeks'), weeks }, this.checkCanSave);
    }
  }

  setShouldRebook = (service) => {
    const { shouldRebookServices } = this.state;
    let { rebookServices } = this.state;

    shouldRebookServices[service.id] = !shouldRebookServices[service.id];

    if (shouldRebookServices[service.id]) {
      rebookServices.push(service);
    } else {
      rebookServices = remove(rebookServices, { id: service.id });
    }
    this.setState({ shouldRebookServices, rebookServices }, this.checkCanSave);
  }

  saveRebook() {
    const { appointment } = this.props.navigation.state.params;
    const { rebookServices } = this.state;

    const rebookProviders = [];
    for (let i = 0; i < rebookServices.length; i += 1) {
      rebookServices[i].id = rebookServices[i].serviceId;
      if (rebookServices[i].employee) {
        const provider = find(rebookProviders, { id: rebookServices[i].employee.id });
        if (!provider) {
          rebookProviders.push(rebookServices[i].employee);
        }
      }
    }

    const { navigate } = this.props.navigation;

    this.goBack();

    navigate('SalonCalendar', {
      rebookAppointment: true,
      date: this.state.date,
      // client: appointment.client,
      selectedAppointment: appointment,
      rebookProviders,
      rebookServices,
    });
  }

  finishedRebooking = (result, error) => {
    if (result) {
      this.props.navigation.goBack();
    } else {
      alert(error.message);
    }
  }


  goBack() {
    this.props.navigation.goBack();
  }

  checkCanSave = () => {
    const {
      rebookServices,
    } = this.state;

    const canSave = rebookServices.length > 0;

    this.props.navigation.setParams({ canSave });
  }


  OnChanageUpdateRebookingPref = (state) => {
    let { updateRebookingPref } = this.state;
    updateRebookingPref = !this.state.updateRebookingPref;
    this.setState({ updateRebookingPref: !this.state.updateRebookingPref }, this.checkCanSave);
  }

  renderService = (service, index) => (
    <React.Fragment>
      <InputSwitch
        style={{ height: 60 }}
        textStyle={{ color: '#000000' }}
        onChange={() => {
          this.setShouldRebook(service);
        }}
        value={this.state.shouldRebookServices[service.id]}
        text={
          <View style={styles.serviceContainer}>
            <Text style={styles.serviceNameText}>{service.serviceName}</Text>
            <Text style={styles.employeeNameText}>{`w/ ${service.employee ? service.employee.fullName : 'First Available'}`}</Text>
          </View>
        }
      />
      <InputDivider />
    </React.Fragment>)

  render() {
    const { appointment } = this.props.navigation.state.params;


    if ('service' in appointment && !('services' in appointment)) {
      appointment.services = [appointment.service];
    }


    return (
      <View style={styles.container}>

        {this.props.rebookState.isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
  ) : (

    <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
      <SectionTitle value="HOW MANY WEEKS AHEAD TO REBOOK?" style={{ height: 37 }} />
      <InputGroup >
        <InputNumber onChange={(operation, weeks) => { this.onChangeWeeks(operation, weeks); }} textStyle={styles.weeksTextSyle} value={this.state.weeks} singularText="week" pluralText="weeks" min={0} />
        <InputDivider />
        <InputLabel
          label={this.state.date.format('DD MMMM YYYY')}
        />

        {appointment.services.length === 1 ?

          <React.Fragment>
            <InputDivider />
            <InputSwitch
              style={{ height: 43 }}
              textStyle={{ color: '#000000' }}
              onChange={this.OnChanageUpdateRebookingPref}
              value={this.state.updateRebookingPref}
              text="Update rebooking pref."
            />
          </React.Fragment>

          : null

        }
      </InputGroup>


      {appointment.services.length > 1 ?
        <React.Fragment>
          <SectionTitle value="SERVICES TO REBOOK" style={{ height: 37 }} />
          <InputGroup>
            {appointment.services && appointment.services.map((service, index) => this.renderService(service, index))}
          </InputGroup>
          <SectionDivider />
          <InputGroup >
            <InputSwitch
              style={{ height: 43 }}
              textStyle={{ color: '#000000' }}
              onChange={this.OnChanageUpdateRebookingPref}
              value={this.state.updateRebookingPref}
              text="Update rebooking pref."
            />
          </InputGroup>
        </React.Fragment>
      : null}
    </KeyboardAwareScrollView>)}
      </View>
    );
  }
}


RebookDialogScreen.propTypes = {
  rebookState: PropTypes.any.isRequired,
  navigate: PropTypes.any.isRequired,
};

export default RebookDialogScreen;
