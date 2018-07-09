import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import moment from 'moment';
import {
  compact,
  get,
  slice,
  isFunction,
} from 'lodash';

import { AppointmentBook } from '../../utilities/apiWrapper';
import { AppointmentTime } from './SalonNewAppointmentSlide';
import {
  InputDivider,
  ClientInput,
  ServiceInput,
  ProviderInput,
} from '../formHelpers';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import SalonFlatPicker from '../SalonFlatPicker';
import Icon from '../UI/Icon';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
    flex: 1,
  },
  header: {
    backgroundColor: '#115ECD',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
  },
  dateText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 30 - 16,
    color: '#111415',
  },
  placeholderText: {
    fontSize: 14,
    color: '#727A8F',
    lineHeight: 22,
  },
  middleSectionDivider: {
    width: '95%', height: 1, alignSelf: 'center', backgroundColor: '#DDE6F4',
  },

});

const Button = props => (
  <SalonTouchableOpacity
    style={[{
      height: 48,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props.disabled ? '#C0C0C0' : props.backgroundColor || '#115ECD',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: props.disabled ? '#86868a' : '#115ECD',
    }, props.style]}
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <Text style={{
      fontSize: 12,
      color: props.color || 'white',
      fontFamily: 'Roboto-Bold',
    }}
    >
      {props.text}
    </Text>
  </SalonTouchableOpacity>
);

const AddonsContainer = (props) => {
  const extrasArray = [...props.addons, ...props.recommended];
  const extrasLength = extrasArray.reduce((aggregator, current) => {
    if (current.maxDuration) {
      return aggregator.add(moment.duration(current.maxDuration));
    }
    return aggregator;
  }, moment.duration());
  return (
    <Animated.View style={{
      maxHeight: props.height,
      overflow: 'hidden',
    }}
    >
      <View style={{
        marginHorizontal: 2,
        backgroundColor: '#F1F1F1',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        paddingBottom: 9,
        paddingHorizontal: 8,
      }}
      >
        <Text style={{
          fontSize: 9,
          lineHeight: 22,
          color: '#727A8F',
        }}
        >ADD-ONS / RECOMMENDED / REQUIRED
        </Text>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent',
          borderColor: '#F4F7FC',
          borderWidth: 1,
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 1,
          zIndex: 2,
          shadowOffset: { width: 0, height: 2 },
          backgroundColor: '#F3F7FC',
        }}
        >
          {extrasArray.length > 0 && (
            <Addon
              title={extrasArray[0].name}
              number={extrasArray.length - 1}
              onPress={props.onPressAddons}
              length={`${extrasLength.asMinutes()} min`}
            />
          )}
          {extrasArray.length > 0 && props.required !== null && (
            <InputDivider style={styles.middleSectionDivider} />
          )}
          {props.required !== null && (
            <Addon
              required
              icon="times"
              title={props.required.name}
              length={`${moment.duration(props.required.maxDuration).asMinutes()} min`}
              onPress={props.onPressRequired}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const Addon = props => (
  <SalonTouchableOpacity
    style={{
      height: 39,
      flexDirection: 'row',
      paddingLeft: 11,
      paddingRight: 16,
    }}
    onPress={props.onPress}
  >
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
      <Text
        style={{
          fontSize: 14,
          lineHeight: 22,
          color: '#110A24',
        }}
        numberOfLines={1}
      >{props.title}
      </Text>
      {props.number > 0 && (
        <View style={{
          height: 24,
          borderRadius: 12,
          backgroundColor: 'white',
          padding: 5,
          marginLeft: 10,
        }}
        >
          <Text style={{
            fontSize: 12,
            color: '#115ECD',
            fontFamily: 'Roboto-Bold',
          }}
          >+{props.number}
          </Text>
        </View>
      )}
      {props.required && (
        <Text style={{
          fontSize: 10,
          lineHeight: 22,
          color: '#F5A623',
          marginLeft: 10,
          fontFamily: 'Roboto-Medium',
        }}
        >
          REQUIRED
        </Text>
      )}
    </View>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
    >
      {props.length && (
        <Text style={{
          fontSize: 12,
          lineHeight: 18,
          fontFamily: 'Roboto-Medium',
          color: '#727A8F',
          opacity: 0.9,
          marginRight: 10,
        }}
        >
          {props.length}
        </Text>
      )}
      <Icon
        name={props.required ? 'times' : 'angleRight'}
        type="light"
        color="#115ECD"
        size={props.required ? 15 : 24}
      />
    </View>
  </SalonTouchableOpacity>
);

const ConflictBox = props => (
  <SalonTouchableOpacity
    style={[{
      alignSelf: 'stretch',
      backgroundColor: '#FFF7CC',
      borderRadius: 4,
      marginVertical: 8,
      flexDirection: 'row',
      paddingHorizontal: 12,
      height: 32,
      alignItems: 'center',
    }, props.style]}
    onPress={() => props.onPress()}
  >
    <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    }}
    >
      <Icon type="solid" name="warning" color="#D1242A" size={12} />
      <Text style={{
        color: '#2F3142',
        fontSize: 11,
        lineHeight: 22,
        marginLeft: 7,
      }}
      >
        Conflicts found
      </Text>
    </View>
    <Text style={{
      fontSize: 11,
      lineHeight: 22,
      color: '#D1242A',
      textDecorationLine: 'underline',
    }}
    >
      Show Conflicts
    </Text>
  </SalonTouchableOpacity>
);

export default class NewApptSlide extends React.Component {
  constructor(props) {
    super(props);

    const provider = this.props.provider || null;
    this.state = {
      isLoading: false,
      visible: false,
      isAnimating: false,
      // isBooking: false,
      canBook: false,
      service: null,
      client: null,
      provider,
      addons: [],
      recommended: [],
      required: null,
      conflicts: [],
      isRequested: true,
      serviceItems: [],
      addonsHeight: new Animated.Value(0),
      height: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.visible && newProps.visible) {
      this.showPanel();
    } else if (this.props.visible && !newProps.visible) {
      this.hidePanel();
    }
  }

  animateHeight = value => Animated.timing(
    this.state.height,
    {
      toValue: value,
      duration: 300,
    },
  )

  setClient = client => this.setState({ client }, () => {
    this.showPanel().checkConflicts();
  })

  setService = ({
    service, addons, recommended, required,
  }) => this.setState({
    service, addons, recommended, required,
  }, () => {
    this.showPanel().checkConflicts();
  })

  openAddons = () => {
    if (this.shouldShowExtras()) {
      Animated.timing(
        this.state.addonsHeight,
        {
          toValue: 500,
          duration: 400,
        },
      ).start();
    }
  }

  setProvider = (provider) => {
    this.props.onChangeProvider(provider);
    return this.showPanel().checkConflicts();
  }

  resetTimeForServices = (items, index, initialFromTime) => {
    items.forEach((item, i) => {
      if (i > index) {
        const prevItem = items[i - 1];

        item.fromTime = prevItem && prevItem.toTime ?
          moment(prevItem.toTime) : initialFromTime;
        item.toTime = moment(item.fromTime).add(moment.duration(item.service ?
          item.service.maxDuration : item.maxDuration));
      }
    });

    return items;
  }

  getAllServices = () => {
    const {
      service,
      addons,
      recommended,
      required,
    } = this.state;
    return compact([
      service,
      ...addons,
      ...recommended,
      required,
    ]);
  }

  getTotalLength = (index = false) => {
    const allServices = this.getAllServices();
    if (index) {
      slice(allServices, index);
    }
    return allServices.reduce((duration, curr) => {
      if (curr && curr.maxDuration) {
        return duration.add(curr.maxDuration);
      }
      return duration;
    }, moment.duration());
  }

  getEndTime = () => {
    const { startTime } = this.props;
    return moment(startTime, 'HH:mm').add(this.getTotalLength());
  }

  getBookButtonText = () => {
    if (this.state.isLoading) {
      return 'LOADING...';
    }
    if (this.props.isBooking) {
      return 'BOOKING APPOINTMENT...';
    }
    return 'BOOK NOW';
  }

  async checkConflicts() {
    const {
      client,
    } = this.state;
    const { date, startTime, provider } = this.props;
    const services = this.getAllServices();
    if (!client || !provider || !services.length > 0) {
      return;
    }
    this.setState({
      conflicts: [],
      isLoading: true,
    }, async () => {
      this.resetTimeForServices(services, -1, moment(startTime, 'HH:mm'));

      const conflictData = {
        date: date.format('YYYY-MM-DD'),
        clientId: client.id,
        items: [],
      };
      services.forEach((service) => {
        conflictData.items.push({
          clientId: client.id,
          serviceId: service.id,
          employeeId: provider.id,
          fromTime: service.fromTime.format('HH:mm:ss', { trim: false }),
          toTime: service.toTime.format('HH:mm:ss', { trim: false }),
          bookBetween: false,
          roomId: get(get(service, 'room', null), 'id', null),
          roomOrdinal: get(service, 'roomOrdinal', null),
          resourceId: get(get(service, 'resource', null), 'id', null),
          resourceOrdinal: get(service, 'resourceOrdinal', null),
        });
      });

      const conflicts = await AppointmentBook.postCheckConflicts(conflictData);
      this.setState({
        conflicts,
        isLoading: false,
      });
    });
  }

  canBook = () => {
    const {
      service,
      client,
      conflicts,
      isLoading,
    } = this.state;
    const {
      provider,
      isBooking,
    } = this.props;
    if (
      service === null ||
      client === null ||
      provider === null ||
      conflicts.length > 0 ||
      isLoading ||
      isBooking
    ) {
      return false;
    }

    return true;
  }

  handleBook = () => {
    if (!this.canBook()) {
      return false;
    }
    const {
      service,
      client,
      addons,
      required,
      isRequested,
      recommended,
    } = this.state;
    const { startTime, provider } = this.props;
    const totalServices = [
      required,
      ...recommended,
      ...addons,
      service,
    ];

    const items = compact(totalServices).map(item => ({
      service: item,
      client,
      employee: provider,
      requested: isRequested,
    }));
    this.resetTimeForServices(items, -1, moment(startTime, 'HH:mm'));
    const appt = {
      date: moment(this.props.date).format('YYYY-MM-DD'),
      client,
      bookedByEmployee: provider,
      items,
    };

    return this.props.handleBook(appt);
  }

  onItemPress = () => { }

  showPanel = () => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        this.animateHeight(580).start(() => {
          this.props.show();
          this.setState({ isAnimating: false }, () => {
            if (this.shouldShowExtras()) {
              Animated.timing(
                this.state.addonsHeight,
                {
                  toValue: 500,
                  duration: 500,
                },
              ).start();
            }
          });
        });
      });
    }
    return this;
  }

  hidePanel = (callback = false) => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        const animateClose = () => {
          this.animateHeight(0).start(() => {
            this.props.hide();
            this.setState({ isAnimating: false }, () => {
              if (isFunction(callback)) {
                return callback();
              }
              return false;
            });
          });
        };
        if (this.shouldShowExtras()) {
          Animated.timing(
            this.state.addonsHeight,
            {
              toValue: 0,
              duration: 500,
            },
          ).start(() => animateClose());
        } else {
          animateClose();
        }
      });
    }

    return this;
  }

  goToFullForm = () => {
    const {
      client,
      service,
      isRequested,
    } = this.state;
    const {
      date,
      provider: bookedByEmployee,
      startTime,
    } = this.props;
    if (!bookedByEmployee) {
      return alert('Please select a provider first');
    }
    const fromTime = moment(startTime, 'HH:mm');
    const toTime = moment(fromTime).add(this.getTotalLength());
    const services = this.getAllServices();

    const newAppt = {
      date,
      bookedByEmployee,
      service,
      client,
      fromTime,
      toTime,
      requested: isRequested,
    };

    this.hidePanel().props.navigation.navigate('NewAppointment', { newAppt });
  }

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      this.showPanel();
      navigation.goBack();
    },
  })

  shouldShowExtras = () => {
    const { addons, required, recommended } = this.state;
    return addons.length > 0 || recommended.length > 0 || required !== null;
  }

  render() {
    const {
      client,
      service,
      isRequested,
    } = this.state;
    const {
      date,
      startTime,
      provider,
      filterProviders,
      navigation,
    } = this.props;
    const contentStyle = { alignItems: 'flex-start', paddingLeft: 11 };
    const selectedStyle = { fontSize: 14, lineHeight: 22, color: this.state.conflicts.length > 0 ? 'red' : 'black' };
    return (
      <Modal
        visible={this.props.visible}
        transparent
        style={{ marginBottom: 60 }}
      >
        <View style={[
          styles.container,
        ]}
        >
          <TouchableWithoutFeedback onPress={() => this.hidePanel()}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          </TouchableWithoutFeedback>
          <Animated.View style={{
            // transform: [{ translateY: this.state.height }],
            maxHeight: this.state.height,
          }}
          >
            <View style={styles.header}>
              <SalonTouchableOpacity
                style={{ flex: 4 / 17, justifyContent: 'flex-start' }}
                onPress={() => this.hidePanel()}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: 'Roboto-Medium',
                  textAlign: 'left',
                }}
                >
                  Cancel
                </Text>
              </SalonTouchableOpacity>
              <View style={{ flex: 9 / 17, justifyContent: 'center', alignItems: 'stretch' }}>
                <SalonFlatPicker
                  rootStyle={{ justifyContent: 'center' }}
                  dataSource={['New Appt.', 'Other']}
                  selectedColor="#FFFFFF"
                  selectedTextColor="#115ECD"
                  unSelectedTextColor="#FFFFFF"
                  textFontSize={13}
                  onItemPress={this.handleTypeChange}
                  selectedIndex={this.state.selectedFilter}
                />
              </View>
            </View>
            <View style={styles.body}>
              <ScrollView style={{ paddingVertical: 15 }}>
                <Text style={styles.dateText}>{moment(date).format('ddd, MMM D')}</Text>
                <AppointmentTime
                  containerStyle={{
                    justifyContent: 'flex-start',
                  }}
                  startTime={startTime}
                  endTime={this.getEndTime()}
                />
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  borderBottomColor: 'transparent',
                  borderTopColor: 'transparent',
                  borderColor: '#F4F7FC',
                  borderWidth: 1,
                  marginTop: 15,
                  shadowColor: '#000000',
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 1,
                  zIndex: 2,
                  shadowOffset: { width: 0, height: 2 },
                  backgroundColor: '#F3F7FC',
                }}
                >
                  <ClientInput
                    apptBook
                    label={false}
                    style={{ height: 39 }}
                    selectedClient={client}
                    placeholder={client === null ? 'Select Client' : 'Client'}
                    placeholderStyle={styles.placeholderText}
                    contentStyle={contentStyle}
                    selectedStyle={selectedStyle}
                    onPress={() => this.hidePanel()}
                    navigate={navigation.navigate}
                    headerProps={{ title: 'Clients', ...this.cancelButton() }}
                    iconStyle={{ color: '#115ECD' }}
                    onChange={this.setClient}
                  />
                  <InputDivider style={styles.middleSectionDivider} />
                  <ServiceInput
                    apptBook
                    noLabel
                    showLength
                    ref={(serviceInput) => { this.serviceInput = serviceInput; }}
                    selectedProvider={provider}
                    selectedService={service}
                    rootStyle={{ height: 39 }}
                    selectedStyle={selectedStyle}
                    placeholder="Select a Service"
                    placeholderStyle={styles.placeholderText}
                    contentStyle={contentStyle}
                    onPress={() => this.hidePanel()}
                    navigate={navigation.navigate}
                    headerProps={{ title: 'Services', ...this.cancelButton() }}
                    iconStyle={{ color: '#115ECD' }}
                    onChange={this.setService}
                  />
                  <InputDivider style={styles.middleSectionDivider} />
                  <ProviderInput
                    noLabel
                    apptBook
                    filterByService
                    isRequested={isRequested}
                    filterList={filterProviders}
                    rootStyle={{ height: 39 }}
                    selectedProvider={provider}
                    placeholder="Select a Provider"
                    placeholderStyle={styles.placeholderText}
                    selectedStyle={selectedStyle}
                    contentStyle={contentStyle}
                    iconStyle={{ color: '#115ECD' }}
                    avatarSize={20}
                    onPress={() => this.hidePanel()}
                    navigate={navigation.navigate}
                    headerProps={{ title: 'Providers', ...this.cancelButton() }}
                    onChange={this.setProvider}
                  />
                </View>
                <AddonsContainer
                  visible={this.shouldShowExtras()}
                  addons={this.state.addons}
                  required={this.state.required}
                  recommended={this.state.recommended}
                  height={this.state.addonsHeight}
                  onPressAddons={() => {

                  }}
                  onPressRequired={() => {

                  }}
                />
                {this.state.conflicts.length > 0 && (
                  <ConflictBox
                    onPress={() => {
                      const callback = () => {
                        this.props.navigation.navigate('Conflicts', {
                          date,
                          conflicts: this.state.conflicts,
                          startTime,
                          endTime: moment(startTime).add(moment.duration(this.getTotalLength())),
                          handleGoBack: () => this.showPanel(),
                        });
                      };
                      return this.hidePanel(callback);
                    }}
                  />
                )}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}
                >
                  <Text style={{
                    fontSize: 14,
                    lineHeight: 22,
                    color: '#110A24',
                  }}
                  >Provider is Requested?
                  </Text>
                  <Switch
                    value={isRequested}
                    onValueChange={isRequested => this.setState({ isRequested })}
                  />
                </View>
                <View style={{
                  marginVertical: 14,
                  backgroundColor: '#F1F1F1',
                  height: 32,
                  borderRadius: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingHorizontal: 12,
                }}
                >
                  <Text style={{
                    fontSize: 13,
                    lineHeight: 22,
                    color: '#2F3142',
                    marginRight: 6,
                  }}
                  >Length
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    lineHeight: 22,
                    color: '#2F3142',
                    opacity: service === null ? 0.5 : 1,
                    fontStyle: service === null ? 'italic' : 'normal',
                  }}
                  >
                    {service === null ? 'select a service first' : `${this.getTotalLength().asMinutes()} min`}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'column',
                }}
                >
                  <Button
                    onPress={this.handleBook}
                    disabled={!this.canBook()}
                    text={this.getBookButtonText()}
                  />
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 16,
                  }}
                  >
                    <Button
                      style={{ flex: 8 / 17 }}
                      onPress={this.goToFullForm}
                      // disabled={this.state.canBook}
                      backgroundColor="white"
                      color="#115ECD"
                      text="MORE OPTIONS"
                    />
                    <Button
                      style={{ flex: 8 / 17 }}
                      onPress={() => alert('Not Implemented')}
                      disabled={this.state.canBook}
                      backgroundColor="white"
                      color="#115ECD"
                      text="BOOK ANOTHER"
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
