import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import uuid from 'uuid/v4';
import { last, get, flatten, isNil, sortBy, chain } from 'lodash';

import {
  DefaultAvatar,
  LabeledTextInput,
  InputGroup,
  InputText,
  InputLabel,
  SectionTitle,
  InputSwitch,
  InputDivider,
  ClientInput,
  InputNumber,
  InputButton,
} from '../../components/formHelpers';
import {
  AddButton,
} from '../appointmentDetailsScreen/components/appointmentDetails/AppointmentDetails';
import {
  ConflictBox,
} from '../../components/slidePanels/SalonNewAppointmentSlide';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonCard from '../../components/SalonCard';
import SalonAvatar from '../../components/SalonAvatar';
import Icon from '../../components/UI/Icon';
import { Store, Client, AppointmentBook } from '../../utilities/apiWrapper';
import { getEmployeePhoto } from '../../utilities/apiWrapper/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto-Bold',
    color: '#727A8F',
  },
  timeCaretIcon: {
    fontSize: 12,
    marginHorizontal: 3,
  },
  serviceTitle: {

    fontSize: 14,
    lineHeight: 24,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  serviceInfo: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: 'Roboto-Light',
    color: '#727A8F',
  },
  serviceTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  serviceTime: {
    color: '#72838F',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Roboto',
  },
  guestContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});


const caretRight = (
  <FontAwesome style={styles.timeCaretIcon}>{Icons.angleRight}</FontAwesome>
);

const Guest = props => (
  <SalonCard
    bodyStyles={{ paddingVertical: 0 }}
    bodyChildren={(
      <ClientInput
        style={{ flex: 1, height: 40, paddingRight: 0 }}
        label={false}
        apptBook
        placeholder="Select a Client"
        selectedClient={props.selectedClient}
        onChange={client => props.onChange(client)}
        iconStyle={{ color: '#115ECD' }}
        headerProps={{
          title: 'Clients',
          leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
          leftButtonOnPress: navigation => navigation.goBack(),
        }}
        {...props}
      />
    )}
    backgroundColor="white"
  />
);

const ServiceInfo = props => (
  <Text style={styles.serviceInfo}>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>{props.waitTime}</Text>
    <Text style={{ fontSize: 13 }}>  |  </Text>
    <Text style={{ fontFamily: 'Roboto-Medium' }}>$ {props.price}</Text>
  </Text>
);

const SubTitle = props => (
  <View style={{
    height: 54,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  }}
  ><Text style={styles.subTitle}>{props.title.toUpperCase()}</Text>
  </View>
);

const LabeledTextarea = props => (
  <View style={{
    flex: 1,
    flexDirection: 'column',
  }}
  >
    <Text style={{
      fontSize: 14,
      lineHeight: 22,
      color: '#110A24',
      fontFamily: 'Roboto',
    }}
    >{props.label}
    </Text>
    <InputText onChangeText={props.onChangeText} placeholder={props.placeholder} />
  </View>
);

const SalonAppointmentTime = props => (
  <View style={[styles.serviceTimeContainer, { alignItems: 'center' }]}>
    <Icon
      size={12}
      color="#727A8F"
      name="clockO"
      type="light"
      style={{ marginRight: 5 }}
    />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.serviceTime}>{props.from}</Text>
      <Icon
        name="longArrowRight"
        size={11}
        color="#727A8F"
        type="light"
        style={{ marginHorizontal: 5 }}
      />
      <Text style={styles.serviceTime}>{props.to}</Text>
    </View>
  </View>
);

const ServiceCard = ({ data, ...props }) => {
  const employee = data.employee || null;
  const isFirstAvailable = data.isFirstAvailable || false;
  const employeePhoto = getEmployeePhoto(isFirstAvailable ? 0 : employee.id);
  return ([
    <SalonTouchableOpacity
      onPress={props.onPress}
    >
      <SalonCard
        key={props.id}
        containerStyles={{ marginVertical: 0, marginBottom: 10 }}
        bodyStyles={{ paddingTop: 7, paddingBottom: 13 }}
        backgroundColor="white"
        bodyChildren={
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              {props.isAddon && (
                <Icon
                  style={{
                    marginRight: 10,
                    transform: [{ rotate: '90deg' }],
                  }}
                  name="levelUp"
                  type="regular"
                  color="black"
                  size={12}
                />
              )}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Text style={[styles.serviceTitle, props.hasConflicts ? { color: 'red' } : {}]}>
                  {data.service.name}
                </Text>
                {props.isRequired && (
                  <Text style={{
                    fontSize: 10,
                    marginLeft: 6,
                    color: '#1DBF12',
                  }}
                  >
                    REQUIRED
                  </Text>
                )}
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              >
                <ServiceInfo price={data.service.price} waitTime={`${moment.duration(data.service.maxDuration).asMinutes()}min`} />
                <FontAwesome style={{
                  color: '#115ECD',
                  fontSize: 20,
                  marginLeft: 15,
                }}
                >{Icons.angleRight}
                </FontAwesome>
              </View>
            </View>
            <View style={{
              flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'flex-start',
            }}
            >
              <SalonAvatar
                wrapperStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                width={26}
                borderWidth={1}
                borderColor="transparent"
                hasBadge={data.requested}
                badgeComponent={
                  <FontAwesome style={{
                    color: '#1DBF12', fontSize: 10,
                  }}
                  >{Icons.lock}
                  </FontAwesome>
                }
                image={{ uri: employeePhoto }}
                defaultComponent={<ActivityIndicator />}
              />
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 22,
                  color: props.hasConflicts ? 'red' : '#2F3142',
                }}
              >{isFirstAvailable ? 'First Available' : `${employee.name} ${employee.lastName}`}
              </Text>
            </View>
            <View style={{
              height: 1, alignSelf: 'stretch', backgroundColor: '#E0EAF7', marginVertical: 7,
            }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SalonAppointmentTime
                from={moment(data.fromTime, 'HH:mm').format('HH:mm A')}
                to={moment(data.toTime, 'HH:mm').format('HH:mm A')}
              />
              <SalonTouchableOpacity onPress={props.onPressDelete}>
                <Icon
                  name="trashAlt"
                  size={12}
                  color="#D1242A"
                  type="regular"
                />
              </SalonTouchableOpacity>
            </View>
          </View>
        }
      />
    </SalonTouchableOpacity>,
  ]);
};

export default class NewAppointmentScreen extends React.Component {
  static navigationOptions = ({ navigation, ...props }) => {
    const { params } = navigation.state;
    const canSave = params ? params.canSave : false;

    return ({
      headerTitle: 'New Appointment',
      headerLeft: (
        <SalonTouchableOpacity
          onPress={() => { navigation.goBack(); }}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: 'white',
          }}
          >Cancel
          </Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          onPress={() => (canSave ? navigation.state.params.handleSave() : null)}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: canSave ? 'white' : 'rgba(0,0,0,0.3)',
          }}
          >Done
          </Text>
        </SalonTouchableOpacity>
      ),
    });
  }

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ canSave: false, handleSave: this.handleSave });
    const {
      client,
    } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.getClientInfo(client);

    this.state = {
      isRecurring: false,
      isLoading: false,
      canSave: false,
      clientEmail,
      clientPhone,
      clientPhoneType,
    };
  }

  componentDidMount() {
    // this.calculateTotals();
    this.validate();
  }

  getClientInfo = (client) => {
    const phones = get(client, 'phones', []);
    const clientPhone = phones.reduce((phone, currentPhone) => (currentPhone.value ? currentPhone.value : phone), '');
    return {
      clientPhone,
      clientEmail: get(client, 'email', ''),
      clientPhoneType: clientPhone !== '' ? phones.findIndex(phone => phone.value === clientPhone) : 0,
    };
  }

  deleteMainService = (serviceIndex) => {
    const { serviceItems } = this.state;
    serviceItems.splice(serviceIndex, 1);
    this.setState({ serviceItems });
  }

  deleteGuestService = (guestIndex, serviceIndex) => {
    const newGuests = this.state.guests;
    const newGuest = newGuests[guestIndex];

    newGuest.services.splice(serviceIndex, 1);
    newGuests[guestIndex] = newGuest;

    this.setState({ guests: newGuests });
  }

  addService = async (service, guestId = false) => {
    const {
      client,
      startTime,
      serviceItems,
      totalDuration,
      bookedByEmployee,
    } = this.state;

    const fromTime = moment(startTime).add(moment.duration(totalDuration));
    const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
    const newService = {
      service,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : client,
      requested: true,
      employee: bookedByEmployee,
      fromTime,
      toTime,
    };

    // if (service.requireRoom) {
    //   const room = await this.getRoomInfo(service.requireRoom);
    //   if (room) {
    //     newService.room = room;
    //   }
    // }

    // if (service.requiredResourceId) {
    //   const resource = await this.getResourceInfo(service.requiredResourceId);
    //   if (resource) {
    //     newService.resource = resource;
    //   }
    // }

    const newServiceItem = {
      itemId: uuid(),
      guestId,
      service: newService,
    };

    serviceItems.push(newServiceItem);
    this.setState({ serviceItems }, () => {
      this.validate();
    });
  }

  getRoomInfo = roomId => new Promise((resolve, reject) => {
    Store.getRooms()
      .then(rooms => resolve(rooms.find(room => room.id === roomId)))
      .catch(err => reject(err));
  })

  getResourceInfo = resourceId => new Promise((resolve, reject) => {
    Store.getResources()
      .then(resources => resolve(resources.find(resource => resource.id === resourceId)))
      .catch(err => reject(err));
  })

  updateContactInformation = () => {
    const {
      client,
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.state;

    Client.putContactInformation(
      client.id,
      {
        id: client.id,
        email: clientEmail || null,
        phones: [
          {
            type: clientPhoneType,
            value: clientPhone,
          },
          ...client.phones.filter(phone => phone.value && phone.type !== clientPhoneType),
        ],
        confirmationType: 1,
      },
    )
      .then((res) => {

      })
      .catch(err => console.warn(err));
  }

  addAddonServices = (serviceId, services) => {
    const {
      client,
      startTime,
      totalDuration,
      bookedByEmployee,
    } = this.state;

    const parentService = this.getServiceItem(serviceId);
    const newServiceItems = [];
    services.forEach((service) => {
      const fromTime = moment(startTime).add(moment.duration(totalDuration));
      const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
      const newService = {
        service,
        client: parentService.guestId ? get(this.getGuest(parentService.guestId), 'client', null) : client,
        requested: true,
        employee: bookedByEmployee,
        fromTime,
        toTime,
      };

      newServiceItems.push({
        itemId: uuid(),
        parentId: parentService.itemId,
        guestId: parentService.guestId,
        service: newService,
      });
    });


    this.setState({
      serviceItems: [...this.state.serviceItems, ...newServiceItems],
    }, () => {
      this.validate();
      if (parentService.service.service.requiredServices.length > 0) {
        return this.props.navigation.navigate('RecommendedServices', {
          serviceTitle: parentService.service.service.name,
          services: parentService.service.service.requiredServices,
          onSave: selectedServices => this.addRecommendedServices(parentService.itemId, selectedServices),
        });
      }
    });
  }

  addRecommendedServices = (serviceId, services) => {
    const {
      client,
      startTime,
      totalDuration,
      bookedByEmployee,
    } = this.state;

    const parentService = this.getServiceItem(serviceId);
    const newServiceItems = [];
    services.forEach((service) => {
      const fromTime = moment(startTime).add(moment.duration(totalDuration));
      const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
      const newService = {
        service,
        client: parentService.guestId ? get(this.getGuest(parentService.guestId), 'client', null) : client,
        requested: true,
        employee: bookedByEmployee,
        fromTime,
        toTime,
      };

      newServiceItems.push({
        itemId: uuid(),
        parentId: parentService.itemId,
        guestId: parentService.guestId,
        service: newService,
      });
    });


    this.setState({
      serviceItems: [...this.state.serviceItems, ...newServiceItems],
    }, () => {
      this.validate();
      if (parentService.service.service.requiredServices.length > 0) {
        return this.props.navigation.navigate('RequiredServices', {
          serviceTitle: parentService.service.service.name,
          services: parentService.service.service.requiredServices,
          onSave: selectedService => this.addRequiredServices(parentService.itemId, selectedService),
        });
      }
    });
  }

  addRequiredServices = (serviceId, service) => {
    const {
      client,
      startTime,
      serviceItems,
      totalDuration,
      bookedByEmployee,
    } = this.state;

    const parentService = this.getServiceItem(serviceId);
    const fromTime = moment(startTime).add(moment.duration(totalDuration));
    const toTime = moment(fromTime).add(moment.duration(service.maxDuration));
    const newService = {
      service,
      client: parentService.guestId ? get(this.getGuest(parentService.guestId), 'client', null) : client,
      requested: true,
      employee: bookedByEmployee,
      fromTime,
      toTime,
    };

    serviceItems.push({
      itemId: uuid(),
      isRequired: true,
      parentId: parentService.itemId,
      guestId: parentService.guestId,
      service: newService,
    });


    this.setState({ serviceItems }, this.validate);
  }

  onPressService = (serviceId, guestId = false) => {
    this.props.navigation.navigate('ModifyApptService', {
      guestId,
      client: guestId ? get(this.getGuest(guestId), 'client', null) : this.state.client,
      date: this.state.date,
      serviceItem: this.getServiceItem(serviceId),
      onSaveService: service => this.updateService(serviceId, service, guestId),
      onRemoveService: () => this.removeService(serviceId),
    });
  }

  updateService = (itemId, updatedService, guestId = false) => {
    const serviceIndex = this.state.serviceItems.findIndex(item => item.itemId === itemId);
    const newServiceItems = this.state.serviceItems;
    const serviceItem = {
      guestId,
      itemId,
      service: updatedService,
    };
    newServiceItems.splice(serviceIndex, 1, serviceItem);
    this.setState({ serviceItems: newServiceItems }, this.validate);
  }

  removeService = (serviceId) => {
    const serviceIndex = this.state.serviceItems.findIndex(item => item.itemId === serviceId);
    const newServiceItems = this.state.serviceItems;
    const removedAppt = newServiceItems.splice(serviceIndex, 1)[0];
    const serviceItems = this.resetTimeForServices(
      newServiceItems,
      serviceIndex - 1,
      removedAppt.service.fromTime,
    );
    this.setState({
      serviceItems,
    }, this.validate);
  }

  setGuest = (client, guestId) => {
    const newGuests = this.state.guests;
    const guestIndex = newGuests.findIndex(item => item.guestId === guestId);
    newGuests[guestIndex].client = client;
    this.setState({ guests: newGuests }, this.validate);
  }

  getGuestServices = guestId => this.props.newAppointmentState.serviceItems.filter(item => item.guestId === guestId)

  getGuest = guestId => this.props.newAppointmentState.guests.find(item => item.guestId === guestId)

  getServiceItem = serviceId => this.props.newAppointmentState.serviceItems.find(item => item.itemId === serviceId)

  onChangeRecurring = isRecurring => this.setState({ isRecurring: !isRecurring });

  onChangeProvider = (employee) => {
    this.setState({ employee }, this.validate);
  }

  onChangeClient = (client) => {
    const {
      clientEmail,
      clientPhone,
      clientPhoneType,
    } = this.getClientInfo(client);
    this.props.formulaActions.getFormulasAndNotes(client.id);
    this.setState({
      client, clientEmail, clientPhone, clientPhoneType,
    }, this.validate);
  }

  onChangeRemarks = remarks => this.setState({ remarks })

  onChangeGuestNumber = (action, guestNumber) => {
    const newGuests = this.state.guests;
    if (this.state.guests.length < guestNumber) {
      newGuests.push({
        guestId: uuid(),
        client: null,
      });
    } else {
      newGuests.pop();
    }
    this.setState({ guests: newGuests }, this.validate);
  }

  handleAddMainService = () => {
    const { client, bookedByEmployee } = this.state;
    if (client !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        filterByProvider: true,
        clientId: client.id,
        employeeId: bookedByEmployee.id,
        onChangeService: this.addService,
      });
    }
    return alert('Select a client first');
  }

  getMainServices = () => this.props.newAppointmentState.serviceItems.filter(item => !item.guestId && !item.parentId)

  getAddonsForService = serviceId => this.props.newAppointmentState.serviceItems.filter(item => item.parentId === serviceId)

  checkConflicts = (prevValue) => {
    // const {
    //   date,
    //   client,
    //   bookedByEmployee,
    //   serviceItems,
    //   guests,
    // } = this.state;

    // let servicesToCheck = [];

    // this.setState({
    //   conflicts: [],
    // });

    // if (!client || !bookedByEmployee) {
    //   return;
    // }

    // servicesToCheck = serviceItems.filter(serviceItem => serviceItem.service.service &&
    //   serviceItem.service.employee &&
    //   serviceItem.service.employee.id !== null &&
    //   (serviceItem.guestId ? serviceItem.service.client : true));

    // if (!servicesToCheck.length) {
    //   return;
    // }

    // const conflictData = {
    //   date: date.format('YYYY-MM-DD'),
    //   clientId: client.id,
    //   items: [],
    // };
    // servicesToCheck.forEach((serviceItem) => {
    //   if (
    //     serviceItem.service &&
    //     serviceItem.service.employee &&
    //     serviceItem.service.employee.id === 0
    //   ) {
    //     return;
    //   }

    //   conflictData.items.push({
    //     appointmentId: serviceItem.service.id ? serviceItem.service.id : null,
    //     clientId: serviceItem.guestId ? serviceItem.service.client.id : client.id,
    //     serviceId: serviceItem.service.service.id,
    //     employeeId: serviceItem.service.employee.id,
    //     fromTime: serviceItem.service.fromTime.format('HH:mm:ss', { trim: false }),
    //     toTime: serviceItem.service.toTime.format('HH:mm:ss', { trim: false }),
    //     gapTime: moment().startOf('day').add(moment.duration(+serviceItem.service.gapTime, 'm')).format('HH:mm:ss', { trim: false }),
    //     afterTime: moment().startOf('day').add(moment.duration(+serviceItem.service.afterTime, 'm')).format('HH:mm:ss', { trim: false }),
    //     bookBetween: !!serviceItem.service.gapTime,
    //     roomId: get(get(serviceItem.service, 'room', null), 'id', null),
    //     roomOrdinal: get(serviceItem.service, 'roomOrdinal', null),
    //     resourceId: get(get(serviceItem.service, 'resource', null), 'id', null),
    //     resourceOrdinal: get(serviceItem.service, 'resourceOrdinal', null),
    //   });
    // });

    // AppointmentBook.postCheckConflicts(conflictData)
    //   .then(conflicts => this.setState({
    //     conflicts,
    //     canSave: conflicts.length > 0 ? false : prevValue,
    //   }));

    return this.props.newAppointmentActions.getConflicts();
  }

  handleAddGuestService = (guestId) => {
    const { bookedByEmployee } = this.state;
    if (guestId !== null) {
      return this.props.navigation.navigate('ApptBookService', {
        dismissOnSelect: true,
        filterByProvider: true,
        clientId: this.getGuest(guestId).client.id,
        employeeId: bookedByEmployee.id,
        onChangeService: service => this.addService(service, guestId),
      });
    }
    return alert('Select a guest first');
  }

  handleSave = () => {
    if (this.state.canSave) {
      const {
        date,
        client,
        bookedByEmployee,
        remarks,
        serviceItems,
      } = this.state;
      const callback = () => {
        this.props.navigation.navigate('SalonCalendar');
        this.props.apptBookActions.setGridView();
      };
      // this.props.navigation.setParams({ redirect: true });
      this.setState({ isLoading: true }, () => {
        this.updateContactInformation();
        this.props.newAppointmentActions.bookNewAppt({
          date,
          client,
          bookedByEmployee,
          remarks,
          rebooked: false,
          items: serviceItems.map(item => ({ isGuest: item.guestId, ...item.service })),
        }, callback)
          .then((res) => {
            this.props.navigation.navigate('SalonCalendar');
            this.props.apptBookActions.setGridView();
          })
          .catch((err) => {
            console.warn(err);
            this.setState({ isLoading: false });
          });
      });
    }
  }

  calculateTotals = () => {
    const {
      startTime,
      serviceItems,
    } = this.state;

    this.setState({
      totalDuration: this.totalLength(),
      totalPrice: this.totalPrice(),
    });
  }

  validate = () => {
    const {
      date,
      isLoading,
      isBooking,
      bookedByEmployee,
      client,
      serviceItems,
      conflicts,
    } = this.props.newAppointmentState;

    let valid = false;
    if (
      date &&
      bookedByEmployee !== null &&
      client !== null &&
      serviceItems.length &&
      !conflicts.length &&
      !isLoading &&
      !isBooking
    ) {
      valid = true;
    }
    this.props.navigation.setParams({ canSave: valid });
    this.setState({ canSave: valid }, () => {
      this.checkConflicts(valid);
    });
  }

  totalPrice = () => this.props.totalPrice

  totalLength = () => this.props.appointmentLength

  resetTimeForServices = (items, index, initialFromTime) => {
    items.forEach((item, i) => {
      if (i > index) {
        const prevItem = items[i - 1];

        item.service.fromTime = (prevItem && prevItem.service.toTime.clone()) || initialFromTime;
        item.service.toTime = item.service.fromTime.clone().add(moment.duration(item.service.toTime));
      }
    });
    return items;
  }

  renderExtraClientButtons = isDisabled => ([
    <SalonTouchableOpacity
      disabled={isDisabled}
      key={Math.random().toString()}
      onPress={() => {
        //const isFormulas = this.props.settingState.data.PrintToTicket === 'Formulas';
        //const url = isFormulas ? 'ClientFormulas' : 'ClientNotes';
        this.props.navigation.navigate('ClientNotes', { client: this.state.client });
      }}
      style={{
        marginHorizontal: 5,
      }}
    >
      <Icon
        name="fileText"
        size={20}
        color={isDisabled ? '#ccc' : '#115ECD'}
        type="regular"
      />
    </SalonTouchableOpacity>,
    <SalonTouchableOpacity
      key={Math.random().toString()}
      onPress={() => {
        // TODO
      }}
      style={{
        marginHorizontal: 5,
      }}
    >
      <Icon
        name="infoCircle"
        size={20}
        color="#115ECD"
        type="regular"
      />
    </SalonTouchableOpacity>,
  ]);

  render() {
    const {
      isLoading,
      isBooking,
      date,
      client,
      bookedByEmployee: employee,
      startTime,
      conflicts,
      guests,
      // totalPrice,
      // totalDuration,
    } = this.props.newAppointmentState;
    const {
      clientEmail,
      clientPhone,
    } = this.state;
    const totalPrice = this.totalPrice();
    const totalDuration = this.totalLength();

    //const isFormulas = this.props.settingState.data.PrintToTicket === 'Formulas';
    const isDisabled = this.props.formulasAndNotesState.notes.length < 1;
    const displayDuration = moment.duration(totalDuration).asMilliseconds() === 0 ? '0 min' : `${moment.duration(totalDuration).asMinutes()} min`;
    const guestsLabel = guests.length === 0 || guests.length > 1 ? `${guests.length} Guests` : `${guests.length} Guest`;
    return (
      <ScrollView style={styles.container}>
        {isLoading && (
          <View style={{
            position: 'absolute', zIndex: 999, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#cccccc4d',
          }}
          ><ActivityIndicator />
          </View>
        )}
        <InputGroup style={{ marginTop: 15 }}>
          <InputLabel
            label="Booked by"
            value={(
              <Text style={{
                fontSize: 14,
                lineHeight: 18,
                color: '#727A8F',
              }}
              >{`${employee.name} ${employee.lastName}`}
              </Text>
            )}
          />
          <InputDivider />
          <InputLabel
            label="Date"
            value={`${date.format('ddd, MM/DD/YYYY')}, ${startTime.format('HH:mm A')}`}
          />
        </InputGroup>
        <SectionTitle style={{ height: 46 }} value="Client" />
        <InputGroup>
          <ClientInput
            apptBook
            navigate={this.props.navigation.navigate}
            label={client === null ? 'Select Client' : 'Client'}
            headerProps={{
              title: 'Clients',
              leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
              leftButtonOnPress: (navigation) => {
                navigation.goBack();
              },
            }}
            selectedClient={client}
            onChange={this.onChangeClient}
            extraComponents={client !== null && this.renderExtraClientButtons(isDisabled)}
          />
          <InputDivider />
          <LabeledTextInput
            label="Email"
            value={clientEmail}
            onChangeText={clientEmail => this.setState({ clientEmail })}
          />
          <InputDivider />
          <LabeledTextInput
            label="Phone"
            value={clientPhone}
            onChangeText={clientPhone => this.setState({ clientPhone })}
          />
          <InputDivider />
          <InputNumber
            value={guests.length}
            onChange={this.onChangeGuestNumber}
            label="Multiple Guests"
            singularText="guest"
            pluralText="guests"
          />
        </InputGroup>
        <View>
          <SubTitle title={guests.length > 0 ? 'Main Client' : 'Services'} />
          {conflicts.length > 0 && (
            <ConflictBox
              style={{
                marginHorizontal: 10,
                marginVertical: 10,
              }}
              onPress={() => this.props.navigation.navigate('Conflicts', {
                date,
                conflicts,
                startTime,
                endTime: moment(startTime).add(moment.duration(totalDuration)),
              })}
            />
          )}
          {this.getMainServices().map((item, itemIndex) => [
            (
              <ServiceCard
                hasConflicts={conflicts.length > 0}
                onPress={() => this.onPressService(item.itemId)}
                onPressDelete={() => this.removeService(item.itemId)}
                key={item.itemId}
                addons={this.getAddonsForService(item.itemId)}
                data={item.service}
              />
            ),
            this.getAddonsForService(item.itemId).map(addon => (
              <ServiceCard
                key={addon.itemId}
                data={addon.service}
                isAddon
                isRequired={addon.isRequired}
                hasConflicts={conflicts.length > 0}
                onPress={() => this.onPressService(addon.itemId)}
                onPressDelete={() => this.removeService(addon.itemId)}
              />
            )),
          ])}
          <AddButton
            style={{
              marginVertical: 5,
              paddingTop: 0,
            }}
            onPress={this.handleAddMainService}
            iconStyle={{ marginLeft: 10, marginRight: 4 }}
            title="add service"
          />
        </View>
        {guests.length > 0 && (
          <View>
            <SubTitle title={guestsLabel} />
            {
              guests.map((guest, guestIndex) => (
                <View>
                  <Guest
                    index={guestIndex}
                    navigate={this.props.navigation.navigate}
                    selectedClient={guest.client || null}
                    onChange={selectedClient => this.setGuest(selectedClient, guest.guestId)}
                  />
                  {
                    this.getGuestServices(guest.guestId).map(item => (
                      <ServiceCard
                        hasConflicts={conflicts.length > 0}
                        key={item.itemId}
                        data={item.service}
                        onPress={() => this.onPressService(item.itemId, guest.guestId)}
                        onPressDelete={() => this.removeService(item.itemId)}
                      />
                    ))
                  }
                  <AddButton
                    style={{ marginVertical: 5 }}
                    onPress={() => this.handleAddGuestService(guest.guestId)}
                    iconStyle={{ marginLeft: 10, marginRight: 6 }}
                    title="add service"
                  />
                </View>
              ))
            }
          </View>
        )}
        <InputGroup style={{ marginVertical: 20 }}>
          <InputSwitch
            text="Recurring appt."
            value={this.state.isRecurring}
            // onChange={this.onChangeRecurring}
            onChange={() => alert('API not implemented')}
          />
        </InputGroup>
        {this.state.isRecurring && (
          <View>
            <SectionTitle style={{ marginTop: 0, paddingBottom: 12, height: 26 }} value="Repeat Every" />
            <InputGroup>
              <InputButton
                label="Repeats every"
                value={`${this.state.recurringNumber} ${this.state.recurringType}`}
                onPress={() => this.setState({ recurringPickerOpen: !this.state.recurringPickerOpen })}
                style={{ paddingLeft: 0 }}
              />
              {this.state.recurringPickerOpen && (
                <View style={{
                  flexDirection: 'row',
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                >
                  <Picker
                    style={{ flex: 1 }}
                    itemStyle={{ backgroundColor: 'white' }}
                    selectedValue={this.state.recurringNumber}
                    pickerData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                    onValueChange={recurringNumber => this.setState({ recurringNumber })}
                  />
                  <Picker
                    style={{ flex: 1 }}
                    itemStyle={{ backgroundColor: 'white' }}
                    selectedValue={this.state.recurringType}
                    pickerData={['Weeks', 'Months']}
                    onValueChange={recurringType => this.setState({ recurringType })}
                  />
                </View>
              )}
              <InputDivider />
              <InputButton
                label="On"
                value="The same day each month"
                onPress={() => this.props.navigation.navigate('RepeatsOn')}
                style={{ paddingLeft: 0 }}
              />
              <InputDivider />
              <InputButton
                label="Ends"
                value="After 5 ocurrences"
                onPress={() => this.props.navigation.navigate('EndsOn')}
                style={{ paddingLeft: 0 }}
              />
            </InputGroup>
            <Text style={{
              fontSize: 12,
              lineHeight: 14,
              color: '#727A8F',
              marginLeft: 16,
              marginTop: 5,
            }}
            >Event will occur every month on the same day each month
            </Text>
          </View>
        )}
        <View style={{ paddingHorizontal: 8, marginVertical: 10 }}>
          <View style={{ height: 2, alignSelf: 'stretch', backgroundColor: '#c2c2c2' }} />
        </View>
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 22,
          justifyContent: 'space-between',
        }}
        >
          <Text style={{
            color: '#C0C1C6',
            fontSize: 11,
          }}
          >TOTAL
          </Text>
          <Text style={{
            fontSize: 16,
            lineHeight: 19,
            fontFamily: 'Roboto-Medium',
            color: '#4D5067',
          }}
          >{`${displayDuration} / $ ${totalPrice}`}
          </Text>
        </View>
        <InputGroup style={{
          marginVertical: 30,
          paddingVertical: 10,
        }}
        >
          <LabeledTextarea
            label="Remarks"
            placeholder="Please specify"
            onChangeText={this.onChangeRemarks}
          />
        </InputGroup>
      </ScrollView>
    );
  }
}
