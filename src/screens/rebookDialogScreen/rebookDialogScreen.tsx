import * as React from 'react';
import moment from 'moment';
import {View, Text} from 'react-native';
import {find, remove, pull} from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputGroup,
  InputNumber,
  InputSwitch,
  InputDivider,
  SectionTitle,
  InputLabel,
} from '../../components/formHelpers';
import styles from './styles';
import SalonHeader from '../../components/SalonHeader';

class RebookDialogScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const {appointment} = params;
    const {client} = appointment;

    const fullName = 'fullName' in client
      ? client.fullName
      : `${client.name} ${client.lastName}`;

    return {
      header: (
        <SalonHeader
          title="Rebook"
          subTitle={fullName}
          headerLeft={
            <View style={styles.leftButtonContainer}>
              <SalonTouchableOpacity
                onPress={() => {
                  if (navigation.state.params.goBack) {
                    navigation.state.params.goBack ();
                  }
                }}
              >

                <Text style={styles.headerLeftText}>Cancel</Text>
              </SalonTouchableOpacity>
            </View>
          }
          headerRight={
            <View style={styles.rightButtonContainer}>
              <SalonTouchableOpacity
                disabled={!canSave}
                onPress={() => {
                  if (navigation.state.params.handleDone) {
                    navigation.state.params.handleDone ();
                  }
                }}
              >
                <Text
                  style={[
                    styles.headerRightText,
                    {color: canSave ? '#FFFFFF' : '#19428A'},
                  ]}
                >
                  Done
                </Text>
              </SalonTouchableOpacity>
            </View>
          }
        />
      ),
    };
  };

  state = {
    date: null,
    weeks: 1,
    updateRebookingPref: false,
    shouldRebookServices: {},
    rebookServices: [],
  };

  componentWillMount () {
    this.props.navigation.setParams ({
      handleDone: () => this.saveRebook (),
      goBack: () => this.goBack (),
    });

    this.props.navigation.setParams ({hideTabBar: true});

    this.props.rebookDialogActions.setRebookData ({});

    this.props.navigation.addListener ('willFocus', () => {
      this.loadRebookData ();
    });
  }

  onChangeWeeks = (operation, weeks) => {
    if (operation === 'add') {
      this.setState (
        {date: moment (this.state.date, 'YYYY-MM-DD').add (1, 'weeks'), weeks},
        this.checkCanSave
      );
    } else {
      this.setState (
        {
          date: moment (this.state.date, 'YYYY-MM-DD').subtract (1, 'weeks'),
          weeks,
        },
        this.checkCanSave
      );
    }
  };

  setShouldRebook = service => {
    const {shouldRebookServices} = this.state;
    let {rebookServices} = this.state;

    shouldRebookServices[service.listId] = !shouldRebookServices[
      service.listId
    ];
    const rebookService = find (rebookServices, {listId: service.listId});

    if (shouldRebookServices[service.listId] && !rebookService) {
      rebookServices.push (service);
    } else {
      rebookServices = rebookServices.filter (function (item) {
        return [service.listId].indexOf (item.listId) === -1;
      });
    }
    this.setState ({shouldRebookServices, rebookServices}, this.checkCanSave);
  };

  loadRebookData = () => {
    const {appointment} = this.props.navigation.state.params;

    const date = moment (appointment.date).add (1, 'weeks');

    const {services} = appointment;
    for (let i = 0; i < services.length; i += 1) {
      const service = services[i];
      service.serviceId = service.id || service.serviceId;
      //service.employee = appointment.employee;
      service.serviceLength = service.serviceLength || service.duration;
      service.serviceName =
        service.serviceName || service.name || service.description;
    }

    this.setState ({date}, this.checkCanSave);

    for (let i = 0; i < appointment.services.length; i += 1) {
      appointment.services[i].listId = i;
      this.setShouldRebook (appointment.services[i]);
    }
  };

  goBack = () => {
    const {resetToApptBook} = this.props.navigation.state.params;

    if (resetToApptBook) {
      this.props.navigation.navigate ('SalonCalendar');
    } else {
      this.props.navigation.goBack ();
    }
  };

  saveRebook () {
    const {appointment, mustGoBack} = this.props.navigation.state.params;
    const {rebookServices} = this.state;

    let rebookProviders = [];
    for (let i = 0; i < rebookServices.length; i += 1) {
      rebookServices[i].id =
        rebookServices[i].serviceId || rebookServices[i].id;

      if (rebookServices[i].employee) {
        const provider = find (rebookProviders, {
          id: rebookServices[i].employee.id,
        });
        if (!provider) {
          rebookProviders.push (rebookServices[i].employee);
        }
      }
    }

    const employee = appointment.employee
      ? appointment.employee
      : rebookProviders[0];
    rebookProviders = rebookProviders.length > 1 ? [employee] : rebookProviders;

    if (mustGoBack) {
      this.props.navigation.goBack ();
    }

    const {push} = this.props.navigation;

    push ('SalonCalendar');

    this.props.rebookDialogActions.setRebookData ({
      rebookAppointment: true,
      date: this.state.date,
      selectedAppointment: appointment,
      rebookProviders,
      rebookServices,
    });
  }

  goBack () {
    this.props.navigation.goBack ();
  }

  checkCanSave = () => {
    const {rebookServices} = this.state;

    const canSave = rebookServices.length > 0;

    this.props.navigation.setParams ({canSave});
  };

  OnChanageUpdateRebookingPref = state => {
    this.setState (
      {updateRebookingPref: !this.state.updateRebookingPref},
      this.checkCanSave
    );
  };

  renderService = (service, index) => (
    <React.Fragment key={index}>
      <InputSwitch
        style={{height: 60}}
        textStyle={{color: '#000000'}}
        onChange={() => {
          this.setShouldRebook (service);
        }}
        value={this.state.shouldRebookServices[service.listId]}
        text={
          <View style={styles.serviceContainer}>
            <Text style={styles.serviceNameText}>{service.serviceName}</Text>
            <Text
              style={styles.employeeNameText}
            >{`w/ ${service.employee ? service.employee.fullName : 'First Available'}`}</Text>
          </View>
        }
      />
      <InputDivider />
    </React.Fragment>
  );

  render () {
    const {appointment} = this.props.navigation.state.params;

    if ('service' in appointment && !('services' in appointment)) {
      appointment.services = [appointment.service];
    }

    return (
      <View style={styles.container}>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          ref="scroll"
          extraHeight={300}
          enableAutoAutomaticScroll
        >
          <SectionTitle
            value="HOW MANY WEEKS AHEAD TO REBOOK?"
            style={{height: 37}}
          />
          <InputGroup>
            <InputNumber
              onChange={(operation, weeks) => {
                this.onChangeWeeks (operation, weeks);
              }}
              textStyle={styles.weeksTextSyle}
              value={this.state.weeks}
              singularText="week"
              pluralText="weeks"
              min={1}
            />
            <InputDivider />
            {this.state.date
              ? <InputLabel label={this.state.date.format ('DD MMMM YYYY')} />
              : null}

            {/*appointment.services.length === 1 ?

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

        */}
          </InputGroup>

          {appointment.services.length > 1
            ? <React.Fragment>
                <SectionTitle value="SERVICES TO REBOOK" style={{height: 37}} />
                <InputGroup>
                  {appointment.services &&
                    appointment.services.map ((service, index) =>
                      this.renderService (service, index)
                    )}
                </InputGroup>
                {/*  <SectionDivider />
          <InputGroup >
            <InputSwitch
              style={{ height: 43 }}
              textStyle={{ color: '#000000' }}
              onChange={this.OnChanageUpdateRebookingPref}
              value={this.state.updateRebookingPref}
              text="Update rebooking pref."
            />
          </InputGroup> */}
              </React.Fragment>
            : null}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

RebookDialogScreen.propTypes = {
  rebookState: PropTypes.any.isRequired,
  navigate: PropTypes.any.isRequired,
};

export default RebookDialogScreen;
