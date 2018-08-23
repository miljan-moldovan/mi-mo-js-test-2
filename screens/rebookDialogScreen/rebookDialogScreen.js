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

import styles from './styles';


class RebookDialogScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const { appointment } = params;
    const { client } = appointment;

    return {
      headerTitle: (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleTitle}>
          Rebook
          </Text>
          <Text style={styles.headerTitleSubTitle}>
            {`${client.fullName}`}
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
    date: moment(),
    weeks: 0,
    updateRebookingPref: false,
    shouldRebookServices: {},
  };

  componentWillMount() {
    this.props.navigation.setParams({
      handleDone: () => this.saveRebook(),
    });
  }

  onChangeWeeks = (operation, weeks) => {
    if (operation === 'add') {
      this.setState({ date: moment(this.state.date, 'YYYY-MM-DD').add(1, 'weeks'), weeks }, this.checkCanSave);
    } else {
      this.setState({ date: moment(this.state.date, 'YYYY-MM-DD').subtract(1, 'weeks'), weeks }, this.checkCanSave);
    }
  }

  setShouldRebook = (serviceId) => {
    const { shouldRebookServices } = this.state;
    shouldRebookServices[serviceId] = !shouldRebookServices[serviceId];
    this.setState({ shouldRebookServices }, this.checkCanSave);
  }

  saveRebook() {
    const { appointment } = this.props.navigation.state.params;

    

    const data = {
      weeksCount: this.state.weeks,
      updatePreferences: this.state.updateRebookingPref,
      appointmentIds: [
        appointment.id,
      ],
    };

    this.props.rebookDialogActions.postRebook(data, this.finishedRebooking);
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
    // const {
    //   otherReason, startTimeScheduleOne, endTimeScheduleOne,
    //   startTimeScheduleTwo, endTimeScheduleTwo,
    //   selectedScheduleExceptionReason,
    // } = this.state;

    const canSave = true;

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
        this.setShouldRebook(service.serviceId);
        }}
        value={this.state.shouldRebookServices[service.serviceId]}
        text={
          <View style={styles.serviceContainer}>
            <Text style={styles.serviceNameText}>{service.serviceName}</Text>
            <Text style={styles.employeeNameText}>{`w/ ${service.employee.fullName}`}</Text>
          </View>
        }
      />
      <InputDivider />
    </React.Fragment>)

  render() {
    const { appointment } = this.props.navigation.state.params;



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
          key={Math.random()}
          label={this.state.date.format('DD MMMM YYYY')}
        />
      </InputGroup>

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
    </KeyboardAwareScrollView>)}
      </View>
    );
  }
}


RebookDialogScreen.propTypes = {
  rebookDialogActions: PropTypes.shape({
    postRebook: PropTypes.func,
  }).isRequired,
  rebookState: PropTypes.any.isRequired,
  navigate: PropTypes.any.isRequired,
};

export default RebookDialogScreen;
