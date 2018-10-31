import React, { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import moment, { isMoment } from 'moment';
import { get, isNull, cloneDeep } from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import DatePicker from '../../../components/modals/SalonDatePicker';
import ServiceSection from './serviceSection';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import LoadingOverlay from '../../../components/LoadingOverlay';
import Colors from '../../../constants/Colors';
import DateTime from '../../../constants/DateTime';
import { Services } from '../../../utilities/apiWrapper';

import {
  SectionDivider,
  InputText,
  InputGroup,
  InputRadioGroup,
  InputDivider,
  ClientInput,
  InputButton,
  SectionTitle,
} from '../../../components/formHelpers';

import styles from './styles';
import headerStyles from '../../../constants/headerStyles';

class TurnAwayScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const handleDone = params.handleDone || (() => null);
    const doneButtonStyle = { color: canSave ? '#FFFFFF' : '#19428A' };
    return {
      ...headerStyles,
      title: 'Turn Away',
      headerLeft: (
        <SalonTouchableOpacity
          onPress={navigation.goBack}
          style={styles.leftButton}
        >
          <Text style={styles.leftButtonText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          wait={3000}
          disabled={!canSave}
          onPress={handleDone}
          style={styles.rightButton}
        >
          <Text style={[styles.rightButtonText, doneButtonStyle]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    props.navigation.setParams({ handleDone: this.handleDone });

    const services = [];
    const { startTime } = this.params;
    const { apptGridSettings: { step } } = this.props;
    const fromTime = moment(startTime);
    const service = {
      provider: {
        id: 0, name: 'First', lastName: 'Available', fullName: 'First Available',
      },
      myEmployeeId: null,
      service: null,
      fromTime,
      toTime: moment(fromTime).add(step, 'm'),
      length: moment.duration(step, 'minutes'),
    };
    services.push(service);


    this.state = {
      date: moment(),
      isModalVisible: false,
      selectedClient: null,
      services,
      selectedReasonCode: null,
      isEditableOtherReason: true,
      otherReason: '',
    };

    this.checkCanSave();
  }

  componentDidMount() {
    this.props.turnAwayReasonsActions.getTurnAwayReasons(this.finishedGetTurnAwayReasons);
  }

  onChangeOtherReason = text => this.setState({ otherReason: text }, this.checkCanSave);

  onPressInputGroup = (option, index) => {
    const selectedReasonCode = this.props.turnAwayReasonsState.turnAwayReasons[
      this.props.turnAwayReasonsState.turnAwayReasons.length - 1
    ];

    const isEditableOtherReason = option.id === selectedReasonCode.id;

    let { otherReason } = this.state;

    if (!isEditableOtherReason) {
      otherReason = '';
    }
    this.setState({
      otherReason,
      isEditableOtherReason,
      selectedReasonCode: option,
    }, this.checkCanSave);
  }

  get params() {
    const params = this.props.navigation.state.params || {};
    const { employee, fromTime: startTime = moment('7:00:00', DateTime.time) } = params;
    return {
      employee,
      startTime,
    };
  }

  get totalDuration() {
    const { services } = this.state;
    return services.reduce((agg, srv) => agg.add(srv.length), moment.duration(0));
  }

  get hasInvalidServices() {
    const { services } = this.state;
    let hasInvalid = false;

    if (services.length > 0) {
      services.forEach((itm) => { hasInvalid = !this.validateServiceItem(itm); });
    }


    return hasInvalid;
  }

  checkCanSave = () => {
    const isTextValid = this.state.isEditableOtherReason ? this.state.otherReason.length > 0 : true;
    if (
      isTextValid &&
      this.state.date !== null &&
      this.state.services.length > 0 &&
      this.state.selectedReasonCode !== null &&
      !this.hasInvalidServices
    ) {
      this.props.navigation.setParams({ canSave: true });
    } else {
      this.props.navigation.setParams({ canSave: false });
    }
  }

  goBack = (result, userMessage) => {
    if (result) {
      alert(userMessage);
      this.props.navigation.goBack();
    }
  }

  finishedGetTurnAwayReasons = (result) => {
    const selectedReasonCode = this.props.turnAwayReasonsState.turnAwayReasons[0];
    this.setState({
      date: moment(),
      isModalVisible: false,
      selectedClient: null,
      services: [],
      selectedReasonCode,
      isEditableOtherReason: false,
      otherReason: '',
    }, this.checkCanSave);
  }

  handleDone = () => {
    const services = [];
    const selectedServices = JSON.parse(JSON.stringify(this.state.services));
    for (let i = 0; i < selectedServices.length; i += 1) {
      const service = selectedServices[i];
      delete service.service;
      delete service.provider;
      service.toTime = moment(service.toTime).format(DateTime.time);
      service.fromTime = moment(service.fromTime).format(DateTime.time);
      services.push(service);
    }
    const turnAway = {
      date: this.state.date.format(DateTime.date),
      reasonCode: this.state.selectedReasonCode.id,
      reason: this.state.otherReason.length > 0 ? this.state.otherReason : null,
      myClientId: this.state.selectedClient ? this.state.selectedClient.id : null,
      isAppointmentBookTurnAway: true,
      services,
    };

    this.props.turnAwayActions.postTurnAway(turnAway, this.goBack);
  }

  handleAddService = () => {
    const { apptGridSettings: { step } } = this.props;
    const { employee, startTime } = this.params;
    const services = cloneDeep(this.state.services);
    const fromTime = moment(startTime).add(this.totalDuration);
    const service = {
      provider: {
        id: 0, name: 'First', lastName: 'Available', fullName: 'First Available',
      },
      myEmployeeId: null,
      fromTime,
      toTime: moment(fromTime).add(step, 'm'),
      length: moment.duration(step, 'minutes'),
    };
    services.push(service);
    this.setState({ services }, this.checkCanSave);
  }

  handleRemoveService = (index) => {
    const { startTime } = this.params;
    const services = cloneDeep(this.state.services);
    services.splice(index, 1);

    this.setState({ services: this.resetTimeForServices(services, index, startTime) }, this.checkCanSave);
  }

  handleUpdateService = (index, updatedService) => {
    const { startTime } = this.params;
    const services = cloneDeep(this.state.services);
    const { provider, service } = updatedService;
    const serviceId = get(service, 'id');
    const employeeId = get(provider, 'id');
    this.setState({ isLoading: true }, () => {
      Services.getServiceEmployeeCheck({
        employeeId,
        serviceId,
      })
        .then((check) => {
          const length = moment.duration(get(check, 'duration'));
          services[index] = { ...updatedService, length };
          this.setState({ services: this.resetTimeForServices(services, index, startTime), isLoading: false }, this.checkCanSave);
        })
        .catch((error) => {
          const length = moment.duration(get(service, 'maxDuration'));
          services[index] = { ...updatedService, length };
          this.setState({ services: this.resetTimeForServices(services, index, startTime), isLoading: false }, this.checkCanSave);
        });
    });
  }

  handleDateModal = () => this.setState({ isModalVisible: true })

  handleSelectDate = (data) => {
    if (moment(data).isValid()) {
      this.setState({
        date: moment(data),
        isModalVisible: false,
      }, this.checkCanSave);
    }
  }

  handleClientSelection = (client) => {
    const selectedReasonCode = this.props.turnAwayReasonsState.turnAwayReasons[
      this.props.turnAwayReasonsState.turnAwayReasons.length - 1
    ];
    this.setState({
      selectedClient: client,
      isEditableOtherReason: this.state.selectedReasonCode.id === selectedReasonCode.id,
    }, this.checkCanSave);
  }

  handleRemoveClient = () => this.setState({ selectedClient: null }, this.checkCanSave);

  validateServiceItem = (serviceItem) => {
    const valid = (
      isMoment(get(serviceItem, 'fromTime', null)) &&
      isMoment(get(serviceItem, 'toTime', null)) &&
      !isNull(get(serviceItem, 'provider', null)) &&
      !isNull(get(serviceItem, 'service', null))
    );
    return valid;
  }

  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })

  resetTimeForServices = (items, index, initialFromTime) => items.map((item, i) => {
    if (i > index) {
      const prevItem = items[i - 1];
      let fromTime = initialFromTime;
      if (prevItem) {
        fromTime = get(prevItem, 'toTime', initialFromTime);
      }
      return {
        ...item,
        fromTime,
        toTime: moment(item.fromTime).add(item.length),
      };
    }
    return item;
  });

  render() {
    const {
      apptGridSettings: { step = 15 },
      turnAwayState: { isLoadingState },
      navigation: { navigate, state: { params = {} } },
      turnAwayReasonsState: { isLoading: isLoadingReasons },
    } = this.props;
    const { apptBook = false } = params;
    const { date, isLoading, selectedReasonCode } = this.state;
    const inputGroupLoadingStyle = isLoadingReasons ? {
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    } : {};
    return (
      <View style={styles.container} >
        {
          (isLoading || isLoadingState) &&
          <LoadingOverlay />
        }
        <KeyboardAwareScrollView
          extraHeight={80}
          enableAutoAutomaticScroll
          keyboardShouldPersistTaps="always"
          ref={(ref) => { this.scroll = ref; }}
        >
          <InputGroup>
            <InputButton
              label="Date"
              value={date.format('DD MMMM YYYY')}
              onPress={this.handleDateModal}
            />
            <InputDivider />
            <ClientInput
              apptBook={apptBook}
              label={false}
              selectedClient={this.state.selectedClient}
              placeholder="Client"
              placeholderStyle={styles.placeholderText}
              extraComponents={this.state.selectedClient === null ?
                <Text style={styles.optionaLabel}>Optional</Text> : null}
              navigate={navigate}
              headerProps={{ title: 'Clients', ...this.cancelButton() }}
              onChange={this.handleClientSelection}
            />
          </InputGroup>
          <SectionTitle value="SERVICES" />
          <ServiceSection
            apptBook={false}
            minuteInterval={step}
            services={this.state.services}
            onAdd={this.handleAddService}
            onRemove={this.handleRemoveService}
            onUpdate={this.handleUpdateService}
            cancelButton={this.cancelButton}
            validateItem={this.validateServiceItem}
            navigate={navigate}
            client={this.state.selectedClient}
          />
          <SectionDivider />
          <InputGroup style={inputGroupLoadingStyle}>
            {
              isLoadingReasons ?
                (
                  <ActivityIndicator color={Colors.mediumGrey} />
                ) : (
                  <React.Fragment>
                    <InputRadioGroup
                      options={this.props.turnAwayReasonsState.turnAwayReasons}
                      defaultOption={selectedReasonCode}
                      onPress={this.onPressInputGroup}
                    />
                    <InputText
                      value={this.state.otherReason}
                      isEditable={this.state.isEditableOtherReason}
                      onChangeText={this.onChangeOtherReason}
                      placeholder="Please specify"
                    />
                  </React.Fragment>
                )
            }
          </InputGroup>
          <DatePicker onPress={this.handleSelectDate} isVisible={this.state.isModalVisible} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

TurnAwayScreen.defaultProps = {

};

TurnAwayScreen.propTypes = {
  apptGridSettings: PropTypes.shape({
    step: PropTypes.number.isRequired,
  }).isRequired,
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
