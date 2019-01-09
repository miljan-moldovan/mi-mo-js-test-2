import * as React from 'react';
import { Text, View, ScrollView } from 'react-native';
import moment from 'moment';
import { get, isNumber, toNumber } from 'lodash';

import {
  InputGroup,
  SectionTitle,
  ServiceInput,
  ProviderInput,
  SectionDivider,
  InputSwitch,
  InputLabel,
  InputNumber,
  InputButton,
  InputDivider,
  RemoveButton,
  SchedulePicker,
} from '../../components/formHelpers';
import SalonToast from '../appointmentCalendarScreen/components/SalonToast';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

import styles from './styles';
import SalonHeader from '../../components/SalonHeader';
import { ConflictBox } from '../../components/slidePanels/SalonNewAppointmentSlide';
import LoadingOverlay from '../../components/LoadingOverlay';

export default class ModifyApptServiceScreen extends React.Component<any, any> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const handleSave = params.handleSave || (() => null);
    const handleCancel = params.handleCancel || (() => null);
    let title = 'New Service';
    let subTitle = ';';
    if ('params' in navigation.state && navigation.state.params !== undefined) {
      if ('serviceItem' in navigation.state.params) {
        title = 'Modify Service';
        if ('service' in navigation.state.params.serviceItem &&
          'service' in navigation.state.params.serviceItem.service) {
          subTitle = navigation.state.params.serviceItem.service.service.description;
        }
      }
    }
    const buttonStyle = { color: canSave ? 'white' : 'rgba(0,0,0,.3)' };
    const buttonOnPress = () => (canSave ? handleSave() : null);
    return {
      header: (
        <SalonHeader
          title={title}
          subTitle={subTitle}
          headerLeft={
            <SalonTouchableOpacity
              style={{ paddingLeft: 10 }}
              onPress={handleCancel}
            >
              <Text style={styles.headerButton}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={buttonOnPress}
              disabled={!canSave}
            >
              <Text style={[styles.headerButton, buttonStyle]}>Done</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = this.getStateFromParams();
    this.props.navigation.setParams({
      handleSave: this.handelSaveWithNavigate,
      handleCancel: this.handelCancel,
    });
  }

  componentDidMount() {
    this.checkConflicts();
  }

  onPressRemove = () => {
    const params = this.props.navigation.state.params || {};
    if (params.onRemoveService) {
      params.onRemoveService();
    }
    return this.props.navigation.goBack();
  };

  setPrice = price => {
    this.setState({ price: price.replace(/\D/g, '') });
  };

  getStateFromParams = () => {
    const params = this.props.navigation.state.params || {};
    const serviceItem = params.serviceItem || false;
    const client = params.client || null;
    const date = params.date || moment();
    const startTime = get(serviceItem.service, 'fromTime', moment());
    const endTime = get(
      serviceItem.service,
      'toTime',
      moment().add(15, 'm'),
    );
    const length = moment.duration(endTime.diff(startTime));
    const price = get(serviceItem.service.service || {}, 'price', '0');
    const state = {
      date,
      price,
      startTime,
      endTime,
      length,
      toast: null,
      canSave: false,
      endTimePickerOpen: false,
      startTimePickerOpen: false,
      canRemove: !!params.onRemoveService,
      id: get(serviceItem.service, 'id', null),
      selectedClient: serviceItem.guestId
        ? get(serviceItem.service, 'client', null)
        : client,
      selectedProvider: get(serviceItem.service, 'employee', null),
      selectedService: get(serviceItem.service, 'service', null),
      requested: get(serviceItem.service, 'requested', true),
      bookBetween: get(serviceItem.service, 'bookBetween', false),
      gapTime: moment.duration(get(serviceItem.service, 'gapTime', 0)),
      afterTime: moment.duration(get(serviceItem.service, 'afterTime', 0)),
      room: get(serviceItem.service, 'room', null),
      resource: get(serviceItem.service, 'resource', null),
      serviceId: serviceItem && serviceItem.itemId || null,
    };

    state.length = moment.duration(state.endTime.diff(state.startTime));
    state.initialConflicts = this.props.newAppointmentState.conflicts;

    return state;
  };

  validate = () => {
    const { selectedProvider, selectedService } = this.state;
    let valid = false;
    if ((selectedProvider !== null || selectedService !== null) && !this.conflictsForThisService().length) {
      valid = true;
    }
    this.setState({ canSave: valid });
    this.props.navigation.setParams({ canSave: valid });
  };

  toggleStartTimePicker = () =>
    this.setState(({ startTimePickerOpen }) => ({
      startTimePickerOpen: !startTimePickerOpen,
      endTimePickerOpen: false,
    }));

  toggleEndTimePicker = () =>
    this.setState(({ endTimePickerOpen }) => ({
      endTimePickerOpen: !endTimePickerOpen,
      startTimePickerOpen: false,
    }));

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack(),
  });

  handleSelectService = selectedService => {
    const { startTime } = this.state;
    let endTime = null;
    if ('maxDuration' in selectedService) {
      endTime = moment(startTime).add(
        moment.duration(selectedService.maxDuration),
      );
    }
    const length = moment.duration(endTime.diff(startTime));
    const price = get(selectedService, 'price', '0');
    this.setState(
      {
        selectedService,
        endTime,
        length,
        price,
        bookBetween: get(selectedService, 'bookBetween', false),
        gapTime: moment.duration(get(selectedService, 'gapDuration', 0)),
        afterTime: moment.duration(get(selectedService, 'afterDuration', 0)),
      },
      this.checkConflicts,
    );
  };

  conflictsForThisService = () => this.props.newAppointmentState.conflicts.filter(conf =>
    conf.associativeKey === this.state.serviceId,
  );

  getConflictsByProblem = () => {
    let listConflicts = {};
    const newListConflicts = this.conflictsForThisService().map(item => {
      return item;
    });

    return newListConflicts;
  };

  handleSave = () => {
    const {
      canSave,
      selectedClient,
      selectedProvider,
      selectedService,
      startTime,
      endTime,
      requested,
      bookBetween,
      gapTime,
      afterTime,
      room,
      price: priceString,
      resource,
      length,
      id,
    } = this.state;

    if (canSave) {
      const price = isNumber(priceString)
        ? priceString
        : toNumber(priceString.replace(/\D/g, ''));
      const { params } = this.props.navigation.state;
      const serviceItem = {
        id,
        client: selectedClient,
        employee: selectedProvider,
        service: { ...selectedService, price },
        fromTime: startTime,
        toTime: endTime,
        requested,
        bookBetween,
        gapTime,
        afterTime,
        room,
        resource,
        length,
      };
      params.onSaveService(serviceItem);
    }
  };

  handelSaveWithNavigate = () => {
    this.handleSave();
    this.props.navigation.goBack();
  };

  handelCancel = () => {
    this.props.setConflicts(this.state.initialConflicts);
    this.props.navigation.goBack();
  };

  handleSelectProvider = selectedProvider => {
    this.setState(
      {
        selectedProvider,
      },
      this.checkConflicts,
    );
  };

  handleRequested = requested => {
    this.setState({ requested: !requested }, this.checkConflicts);
  };

  handleChangeEndTime = endTimeDateObj => {
    const { startTime } = this.state;
    const endTime = moment(endTimeDateObj);
    if (startTime.isAfter(endTime)) {
      return this.setState({
        toast: {
          description: 'Start time can\'t be after end time!',
          type: 'error',
          btnRight: 'OK',
        },
      });
    }
    return this.setState(
      {
        endTime,
        length: moment.duration(endTime.diff(startTime)),
      },
      this.checkConflicts,
    );
  };

  handleChangeStartTime = startTimeDateObj => {
    const { selectedService } = this.state;
    const startTime = moment(startTimeDateObj);
    const duration = selectedService.maxDuration
      ? selectedService.maxDuration
      : selectedService.duration;
    const endTime = moment(startTime).add(moment.duration(duration));
    return this.setState(
      {
        startTime,
        endTime,
        length: moment.duration(endTime.diff(startTime)),
      },
      this.checkConflicts,
    );
  };

  handleChangeGapTime = (action, time) => {
    const { afterTime, length } = this.state;
    const gapTime = moment.duration(time, 'minute');
    if (
      moment.duration(gapTime).add(afterTime).asMilliseconds() >
      length.asMilliseconds()
    ) {
      return this.setState({
        toast: {
          description: 'Sum of after and gap durations\ncan\'t be more than service length',
          type: 'error',
          btnRight: 'OK',
        },
      });
    }
    return this.setState({ gapTime });
  };

  handleChangeAfterTime = (action, time) => {
    const { gapTime, length } = this.state;
    const afterTime = moment.duration(time, 'minute');
    if (
      moment.duration(gapTime).add(afterTime).asMilliseconds() >
      length.asMilliseconds()
    ) {
      return this.setState({
        toast: {
          description: 'Sum of after and gap durations\ncan\'t be more than service length',
          type: 'error',
          btnRight: 'OK',
        },
      });
    }
    return this.setState({ afterTime });
  };

  hideToast = () => this.setState({ toast: null });

  onPressConflicts = () => {
    const { date, startTime } = this.props.newAppointmentState;
    const conflicts = this.conflictsForThisService();
    const totalDuration = this.props.appointmentLength;
    const endTime = moment(startTime).add(moment.duration(totalDuration));
    this.props.navigation.navigate('Conflicts', {
      date,
      conflicts,
      startTime,
      endTime,
    });
  };

  checkConflicts = () => {
    const isFirstAvailable = get(this.state.selectedProvider, 'id', 0) === 0;
    const serviceState = {};
    serviceState.service = {
      isFirstAvailable,
      appointmentId: this.state.id,
      clientId: this.state.selectedClient.id,
      serviceId: this.state.selectedService.id,
      employeeId: isFirstAvailable
        ? null
        : get(this.state.selectedProvider, 'id', null),
      fromTime: this.state.startTime.format('HH:mm:ss'),
      toTime: this.state.endTime.format('HH:mm:ss'),
      bookBetween: this.state.bookBetween,
      roomId: get(get(this.state, 'room', null), 'id', null),
      roomOrdinal: get(this.state, 'roomOrdinal', null),
      resourceId: get(get(this.state, 'resource', null), 'id', null),
      resourceOrdinal: get(this.state, 'resourceOrdinal', null),
      associativeKey: this.state.serviceId,
    };
    this.props.newAppointmentActions.getConflictsForService(serviceState, () => this.validate());
    this.validate();
  };

  renderConflictsBox() {
    if (!this.conflictsForThisService().length) {
      return <SectionDivider />;
    }

    return (
      <ConflictBox
        style={styles.conflictsBox}
        onPress={() => this.onPressConflicts()}
      />
    );
  }

  render() {
    const {
      canRemove,
      selectedProvider,
      selectedService,
      startTime,
      endTime,
      requested,
      bookBetween,
      gapTime,
      afterTime,
      length,
      room,
      price,
      resource,
      toast,
      date,
    } = this.state;

    return (
      <ScrollView style={styles.container}>
        {this.props.newAppointmentState.isLoading ? <LoadingOverlay /> : null}
        <InputGroup style={{ marginTop: 16 }}>
          <ServiceInput
            apptBook
            noPlaceholder
            nameKey={selectedService.description ? 'description' : 'name'}
            selectedProvider={selectedProvider}
            selectedService={selectedService}
            navigate={this.props.navigation.navigate}
            onChange={this.handleSelectService}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
          />
          <InputDivider />
          <ProviderInput
            date={date}
            mode="newAppointment"
            apptBook={true}
            noPlaceholder={true}
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            onChange={this.handleSelectProvider}
            navigate={this.props.navigation.navigate}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
          />
          <InputDivider />
          <InputSwitch
            text="Provider is requested"
            value={requested}
            onChange={this.handleRequested}
          />
          <InputDivider />
          <InputLabel label="Price" value={`$ ${price}`} />
        </InputGroup>
        <SectionTitle value="Time" />
        <InputGroup>
          <SchedulePicker
            date={date}
            label="Start"
            value={startTime}
            isOpen={this.state.startTimePickerOpen}
            onChange={this.handleChangeStartTime}
            toggle={this.toggleStartTimePicker}
          />
          <InputDivider />
          <SchedulePicker
            date={date}
            label="Ends"
            value={endTime}
            isOpen={this.state.endTimePickerOpen}
            onChange={this.handleChangeEndTime}
            toggle={this.toggleEndTimePicker}
          />
          <InputDivider />
          <InputLabel
            label="Length"
            value={
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  color: '#727A8F',
                }}
              >
                {`${moment.duration(length).asMinutes()} min`}
              </Text>
            }
          />
          <InputDivider />
          <InputSwitch
            text="Gap"
            value={bookBetween}
            onChange={bookBetween =>
              this.setState({ bookBetween: !bookBetween })}
          />
          {bookBetween &&
          <View>
            <InputDivider />
            <InputNumber
              value={gapTime.asMinutes()}
              onChange={this.handleChangeGapTime}
              step={this.props.apptGridSettings.step} // TODO should be apptgrid step
              label="Gap Time"
              singularText="min"
              pluralText="min"
            />
            <InputDivider />
            <InputNumber
              value={afterTime.asMinutes()}
              onChange={this.handleChangeAfterTime}
              label="After"
              step={this.props.apptGridSettings.step}
              singularText="min"
              pluralText="min"
            />
          </View>}
        </InputGroup>
        <SectionTitle value="Room & Resource" />
        <InputGroup>
          <InputButton
            onPress={() => {
              this.props.navigation.navigate('SelectRoom', {
                onSelect: selectedRoom => this.setState({ room: selectedRoom }),
              });
            }}
            label="Assigned Room"
            value={room ? room.name : 'None'}
          />
          <InputDivider />
          <InputButton
            onPress={() => {
              this.props.navigation.navigate('SelectResource', {
                onSelect: selectedResource =>
                  this.setState({ resource: selectedResource }),
              });
            }}
            label="Assigned Resource"
            value={resource ? resource.name : 'None'}
          />
        </InputGroup>
        {this.renderConflictsBox()}
        {canRemove &&
        <RemoveButton
          disabled={this.props.navigation.state.params.isOnlyMainService}
          title="Remove Service"
          onPress={this.onPressRemove}
        />}
        <SectionDivider />
        {toast &&
        <SalonToast
          description={toast.description}
          type={toast.type}
          btnRightText={toast.btnRight}
          hide={this.hideToast}
        />}
      </ScrollView>
    );
  }
}
