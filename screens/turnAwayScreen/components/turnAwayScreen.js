import React, { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import DatePicker from '../../../components/modals/SalonDatePicker';
import ServiceSection from './serviceSection';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

import {
  SectionDivider,
  InputText,
  InputGroup,
  InputRadioGroup,
  InputDivider,
  ClientInput,
} from '../../../components/formHelpers';

import styles from './styles';


class TurnAwayScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    return {
      headerTitle: <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Turn Away</Text>
      </View>,
      headerLeft:
  <View style={styles.leftButtonContainer}>
    <SalonTouchableOpacity
      onPress={navigation.goBack}
      style={styles.leftButton}
    >
      <Text style={styles.leftButtonText}>Cancel</Text>
    </SalonTouchableOpacity>
  </View>,
      headerRight: (
        <View style={styles.rightButtonContainer}>
          <SalonTouchableOpacity
            disabled={!canSave}
            wait={3000}
            onPress={() => {
            if (navigation.state.params.handleDone) {
              navigation.state.params.handleDone();
            }
          }}
            style={styles.rightButton}
          >
            <Text style={[styles.rightButtonText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>Done</Text>
          </SalonTouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);

    props.navigation.setParams({ handleDone: this.handleDone });
    props.turnAwayReasonsActions.getTurnAwayReasons(this.finishedGetTurnAwayReasons);
  }

  state = {
    date: moment(),
    isModalVisible: false,
    selectedClient: null,
    services: [],
    selectedReasonCode: null,
    isEditableOtherReason: true,
    otherReason: '',
  }

  finishedGetTurnAwayReasons = (result) => {
    const selectedReasonCode = this.props.turnAwayReasonsState.turnAwayReasons[this.props.turnAwayReasonsState.turnAwayReasons.length - 1];
    this.setState({
      date: moment(),
      isModalVisible: false,
      selectedClient: null,
      services: [],
      selectedReasonCode,
      isEditableOtherReason: true,
      otherReason: '',
    });
  }

  componentWillMount() {
  }

  handleDone = () => {
    const services = [];

    const selectedServices = JSON.parse(JSON.stringify(this.state.services));
    for (let i = 0; i < selectedServices.length; i += 1) {
      const service = selectedServices[i];
      delete service.service;
      delete service.provider;
      service.toTime = moment(service.toTime).format('HH:mm:ss');
      service.fromTime = moment(service.fromTime).format('HH:mm:ss');
      services.push(service);
    }


    const turnAway = {
      date: this.state.date.format('YYYY-MM-DD'),
      reasonCode: this.state.selectedReasonCode.id,
      reason: this.state.otherReason.length > 0 ? this.state.otherReason : null,
      myClientId: this.state.selectedClient ? this.state.selectedClient.id : null,
      isAppointmentBookTurnAway: true,
      services,
    };

    this.props.turnAwayActions.postTurnAway(turnAway, this.goBack);
  }

  goBack = (result) => {
    if (result) {
      this.props.navigation.goBack();
    } else {
      alert('An error ocurred');
    }
  }

  handleAddService= () => {
    const params = this.props.navigation.state.params || {};


    const {
      fromTime,
      employee,
    } = params;

    const service = {
      provider: employee,
      service: null,
      fromTime: moment(fromTime, 'hh:mm:ss A'),
      toTime: moment(fromTime, 'hh:mm:ss A').add(15, 'minutes'),
    };

    this.props.navigation.setParams({ canSave: false });

    const { services } = this.state;
    services.push(service);
    this.setState({ services });
  }

  handleRemoveService= (index) => {
    const { services } = this.state;
    services.splice(index, 1);
    this.setState({ services });
  }

  handleUpdateService= (index, service) => {
    const { services } = this.state;
    services[index] = service;
    this.setState({ services }, this.checkCanSave);
  }

  handleDateModal = () => {
    this.setState({ isModalVisible: true });
  }

  handleSelectDate = (data) => {
    this.setState({ date: moment(data), isModalVisible: false }, this.checkCanSave);
  }

  handlePressClient = () => {
    const { navigate } = this.props.navigation;

    this.setState({ isEditableOtherReason: false });

    navigate('Clients', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeClient: this.handleClientSelection,
    });
  }

  handleClientSelection = (client) => {
    const selectedReasonCode = this.props.turnAwayReasonsState.turnAwayReasons[this.props.turnAwayReasonsState.turnAwayReasons.length - 1];
    this.setState({ selectedClient: client, isEditableOtherReason: this.state.selectedReasonCode.id === selectedReasonCode.id });
  }

  handleRemoveClient = () => {
    this.setState({ selectedClient: null });
  }

  onChangeOtherReason = (text) => {
    this.setState({ otherReason: text }, this.checkCanSave);
  }


  onPressInputGroup = (option, index) => {
    const selectedReasonCode = this.props.turnAwayReasonsState.turnAwayReasons[this.props.turnAwayReasonsState.turnAwayReasons.length - 1];

    const isEditableOtherReason = option.id === selectedReasonCode.id;

    let { otherReason } = this.state;

    if (!isEditableOtherReason) {
      otherReason = '';
    }
    this.setState({ selectedReasonCode: option, isEditableOtherReason, otherReason }, this.checkCanSave);
  }

  checkCanSave = () => {
    const isTextValid = this.state.isEditableOtherReason ? this.state.otherReason.length > 0 : true;

    if (isTextValid &&
      this.state.date !== null &&
      this.state.services.length > 0 &&
      this.state.selectedReasonCode !== null) {
      this.props.navigation.setParams({ canSave: true });
    } else {
      this.props.navigation.setParams({ canSave: false });
    }
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })

  render() {
    const { navigate } = this.props.navigation;
    const params = this.props.navigation.state.params || {};
    const { apptBook } = params;
    const { selectedReasonCode } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={80} enableAutoAutomaticScroll>

          {this.props.turnAwayState.isLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
      ) : (<View>

        <View style={[styles.row, styles.rowFirst]}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.dataContainer}>
            <Text onPress={this.handleDateModal} style={styles.textData}>{this.state.date.format('DD MMMM YYYY')}</Text>
          </View>
        </View>
        <View style={styles.inputDividerContainer}>
          <InputDivider style={styles.inputDivider} />
        </View>
        <ClientInput
          apptBook={apptBook}
          label={false}
          selectedClient={this.state.selectedClient}
          placeholder={this.state.selectedClient === null ? 'Select Client' : 'Client'}
          placeholderStyle={styles.placeholderText}
          style={styles.clientInput}
          extraComponents={this.state.selectedClient === null ?
            <Text style={styles.optionaLabel}>Optional</Text> : null}
          onPress={this.handlePressClient}
          navigate={navigate}
          headerProps={{ title: 'Clients', ...this.cancelButton() }}
          onChange={this.handleClientSelection}
        />
        <View style={styles.titleRow}>
          <Text style={styles.title}>SERVICES</Text>
        </View>
        <ServiceSection
          apptBook={apptBook}
          services={this.state.services}
          onAdd={this.handleAddService}
          onRemove={this.handleRemoveService}
          onUpdate={this.handleUpdateService}
          cancelButton={this.cancelButton}
          navigate={navigate}
        />
        <SectionDivider />
        <InputGroup>
          <InputRadioGroup
            options={this.props.turnAwayReasonsState.turnAwayReasons}
            defaultOption={selectedReasonCode}
            onPress={this.onPressInputGroup}
          />
          <InputText
            // autoFocus
            value={this.state.otherReason}
            isEditable={this.state.isEditableOtherReason}
            onChangeText={this.onChangeOtherReason}
            placeholder="Please specify"
          />
        </InputGroup>
        <DatePicker onPress={this.handleSelectDate} isVisible={this.state.isModalVisible} />

      </View>)}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

TurnAwayScreen.defaultProps = {

};

TurnAwayScreen.propTypes = {
  turnAwayReasonsActions: PropTypes.shape({
    getTurnAwayReasons: PropTypes.func.isRequired,
  }).isRequired,
  turnAwayActions: PropTypes.shape({
    postTurnAway: PropTypes.func.isRequired,
  }).isRequired,
  turnAwayReasonsState: PropTypes.any.isRequired,
  turnAwayState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
};

export default TurnAwayScreen;
