import * as React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import moment from 'moment';
import {get, isNumber, toNumber} from 'lodash';

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
  LabeledTextInput,
} from '../../components/formHelpers';
import SalonToast from '../appointmentCalendarScreen/components/SalonToast';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

import styles from './styles';
import headerStyles from '../../constants/headerStyles';
import SalonHeader from '../../components/SalonHeader';

export default class ModifyApptServiceScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const handleSave = params.handleSave || (() => null);
    let title = 'New Service';
    if ('params' in navigation.state && navigation.state.params !== undefined) {
      if ('item' in navigation.state.params) {
        title = navigation.state.params.item.service.name;
      }
    }
    const buttonStyle = {color: canSave ? 'white' : 'rgba(0,0,0,.3)'};
    const buttonOnPress = () => (canSave ? handleSave () : null);
    return {
      header: (
        <SalonHeader
          title={title}
          headerLeft={
            <SalonTouchableOpacity
              style={{paddingLeft: 10}}
              onPress={navigation.goBack}
            >
              <Text style={styles.headerButton}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              style={{paddingRight: 10}}
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

  constructor (props) {
    super (props);

    this.state = this.getStateFromParams ();
    this.props.navigation.setParams ({handleSave: this.handleSave});
  }

  componentDidMount () {
    this.validate ();
  }

  onPressRemove = () => {
    const params = this.props.navigation.state.params || {};
    if (params.onRemoveService) {
      params.onRemoveService ();
    }
    return this.props.navigation.goBack ();
  };

  setPrice = price => {
    this.setState ({price: price.replace (/\D/g, '')});
  };

  getStateFromParams = () => {
    const params = this.props.navigation.state.params || {};
    const serviceItem = params.serviceItem || false;
    const client = params.client || null;
    const date = params.date || moment ();
    const startTime = get (serviceItem.service, 'fromTime', moment ());
    const endTime = get (
      serviceItem.service,
      'toTime',
      moment ().add (15, 'm')
    );
    const length = moment.duration (endTime.diff (startTime));
    const price = get (serviceItem.service.service || {}, 'price', '0');
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
      id: get (serviceItem.service, 'id', null),
      selectedClient: serviceItem.guestId
        ? get (serviceItem.service, 'client', null)
        : client,
      selectedProvider: get (serviceItem.service, 'employee', null),
      selectedService: get (serviceItem.service, 'service', null),
      requested: get (serviceItem.service, 'requested', true),
      bookBetween: get (serviceItem.service, 'bookBetween', false),
      gapTime: moment.duration (get (serviceItem.service, 'gapTime', 0)),
      afterTime: moment.duration (get (serviceItem.service, 'afterTime', 0)),
      room: get (serviceItem.service, 'room', null),
      resource: get (serviceItem.service, 'resource', null),
    };

    state.length = moment.duration (state.endTime.diff (state.startTime));

    return state;
  };

  validate = () => {
    const {selectedProvider, selectedService} = this.state;
    let valid = false;
    if (selectedProvider !== null || selectedService !== null) {
      valid = true;
    }
    this.setState ({canSave: valid});
    this.props.navigation.setParams ({canSave: valid});
  };

  toggleStartTimePicker = () =>
    this.setState (({startTimePickerOpen}) => ({
      startTimePickerOpen: !startTimePickerOpen,
    }));

  toggleEndTimePicker = () =>
    this.setState (({endTimePickerOpen}) => ({
      endTimePickerOpen: !endTimePickerOpen,
    }));

  cancelButton = () => ({
    leftButton: <Text style={{fontSize: 14, color: 'white'}}>Cancel</Text>,
    leftButtonOnPress: navigation => navigation.goBack (),
  });

  handleSelectService = selectedService => {
    const {startTime} = this.state;
    let endTime = null;
    if ('maxDuration' in selectedService) {
      endTime = moment (startTime).add (
        moment.duration (selectedService.maxDuration)
      );
    }
    const length = moment.duration (endTime.diff (startTime));
    const price = get (selectedService, 'price', '0');
    this.setState (
      {
        selectedService,
        endTime,
        length,
        price,
        bookBetween: get (selectedService, 'bookBetween', false),
        gapTime: moment.duration (get (selectedService, 'gapDuration', 0)),
        afterTime: moment.duration (get (selectedService, 'afterDuration', 0)),
      },
      this.validate
    );
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
      const price = isNumber (priceString)
        ? priceString
        : toNumber (priceString.replace (/\D/g, ''));
      const {params} = this.props.navigation.state;
      const serviceItem = {
        id,
        client: selectedClient,
        employee: selectedProvider,
        service: {...selectedService, price},
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
      params.onSaveService (serviceItem);
      this.props.navigation.goBack ();
    }
  };

  handleSelectProvider = selectedProvider => {
    this.setState (
      {
        selectedProvider,
      },
      this.validate
    );
  };

  handleRequested = requested => {
    this.setState ({requested: !requested}, this.validate);
  };

  handleChangeEndTime = endTimeDateObj => {
    const {startTime} = this.state;
    const endTime = moment (endTimeDateObj);
    if (startTime.isAfter (endTime)) {
      return this.setState ({
        toast: {
          description: "Start time can't be after end time!",
          type: 'error',
          btnRight: 'OK',
        },
      });
    }
    return this.setState (
      {
        endTime,
        length: moment.duration (endTime.diff (startTime)),
      },
      this.validate
    );
  };

  handleChangeStartTime = startTimeDateObj => {
    const {selectedService} = this.state;
    const startTime = moment (startTimeDateObj);
    const duration = selectedService.maxDuration
      ? selectedService.maxDuration
      : selectedService.duration;
    const endTime = moment (startTime).add (moment.duration (duration));
    return this.setState (
      {
        startTime,
        endTime,
        length: moment.duration (endTime.diff (startTime)),
      },
      this.validate
    );
  };

  handleChangeGapTime = (action, time) => {
    const {afterTime, length} = this.state;
    const gapTime = moment.duration (time, 'minute');
    if (
      moment.duration (gapTime).add (afterTime).asMilliseconds () >
      length.asMilliseconds ()
    ) {
      return this.setState ({
        toast: {
          description: "Sum of after and gap durations\ncan't be more than service length",
          type: 'error',
          btnRight: 'OK',
        },
      });
    }
    return this.setState ({gapTime});
  };

  handleChangeAfterTime = (action, time) => {
    const {gapTime, length} = this.state;
    const afterTime = moment.duration (time, 'minute');
    if (
      moment.duration (gapTime).add (afterTime).asMilliseconds () >
      length.asMilliseconds ()
    ) {
      return this.setState ({
        toast: {
          description: "Sum of after and gap durations\ncan't be more than service length",
          type: 'error',
          btnRight: 'OK',
        },
      });
    }
    return this.setState ({afterTime});
  };

  hideToast = () => this.setState ({toast: null});

  render () {
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
        <InputGroup style={{marginTop: 16}}>
          <ServiceInput
            apptBook
            noPlaceholder
            nameKey={selectedService.description ? 'description' : 'name'}
            selectedProvider={selectedProvider}
            selectedService={selectedService}
            navigate={this.props.navigation.navigate}
            onChange={this.handleSelectService}
            headerProps={{title: 'Services', ...this.cancelButton ()}}
          />
          <InputDivider />
          <ProviderInput
            apptBook
            noPlaceholder
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            onChange={this.handleSelectProvider}
            navigate={this.props.navigation.navigate}
            headerProps={{title: 'Providers', ...this.cancelButton ()}}
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
                {`${moment.duration (length).asMinutes ()} min`}
              </Text>
            }
          />
          <InputDivider />
          <InputSwitch
            text="Gap"
            value={bookBetween}
            onChange={bookBetween =>
              this.setState ({bookBetween: !bookBetween})}
          />
          {bookBetween &&
            <View>
              <InputDivider />
              <InputNumber
                value={gapTime.asMinutes ()}
                onChange={this.handleChangeGapTime}
                step={this.props.apptGridSettings.step} // TODO should be apptgrid step
                label="Gap Time"
                singularText="min"
                pluralText="min"
              />
              <InputDivider />
              <InputNumber
                value={afterTime.asMinutes ()}
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
              this.props.navigation.navigate ('SelectRoom', {
                onSelect: selectedRoom => this.setState ({room: selectedRoom}),
              });
            }}
            label="Assigned Room"
            value={room ? room.name : 'None'}
          />
          <InputDivider />
          <InputButton
            onPress={() => {
              this.props.navigation.navigate ('SelectResource', {
                onSelect: selectedResource =>
                  this.setState ({resource: selectedResource}),
              });
            }}
            label="Assigned Resource"
            value={resource ? resource.name : 'None'}
          />
        </InputGroup>
        <SectionDivider />
        {canRemove &&
          <RemoveButton title="Remove Service" onPress={this.onPressRemove} />}
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
