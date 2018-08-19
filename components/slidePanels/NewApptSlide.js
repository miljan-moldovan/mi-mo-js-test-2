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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import newApptActions from '../../actions/newAppointment';
import {
  getEndTime,
  appointmentLength,
} from '../../redux/selectors/newAppt';

import { AppointmentBook, Product } from '../../utilities/apiWrapper';
import { AppointmentTime } from './SalonNewAppointmentSlide';
import SalonInputModal from '../SalonInputModal';
import {
  InputButton,
  InputDivider,
  ClientInput,
  ServiceInput,
  ProviderInput,
} from '../formHelpers';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import SalonFlatPicker from '../SalonFlatPicker';
import Icon from '../UI/Icon';

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
  return props.visible ? (
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
              onPressIcon={props.onRemoveRequired}
              length={`${moment.duration(props.required.maxDuration).asMinutes()} min`}
              onPress={props.onPressRequired}
            />
          )}
        </View>
      </View>
    </Animated.View>
  ) : null;
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
      <SalonTouchableOpacity onPress={props.onPressIcon || null}>
        <Icon
          name={props.required ? 'times' : 'angleRight'}
          type="light"
          color="#115ECD"
          size={props.required ? 15 : 24}
        />
      </SalonTouchableOpacity>
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

const TAB_BOOKING = 0;
const TAB_OTHER = 1;

export class NewApptSlide extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    isLoading: false,
    visible: false,
    activeTab: TAB_BOOKING,
    isAnimating: false,
    hasSelectedAddons: false,
    hasSelectedRecommended: false,
    canBook: false,
    service: null,
    client: null,
    addons: [],
    recommended: [],
    required: null,
    conflicts: [],
    isRequested: true,
    serviceItems: [],
    addonsHeight: new Animated.Value(0),
    isInputModalVisible: false,
    postModalFunction: null,
  });

  componentWillReceiveProps(newProps) {
    if (!this.props.visible && newProps.visible) {
      this.showPanel();
    } else if (this.props.visible && !newProps.visible) {
      this.hidePanel();
    }
  }

  get shouldShowExtras() {
    const {
      addons = [],
      requiredServices = [],
      recommendedServices = [],
    } = this.getService(true);
    if (addons.length > 0) {
      return true;
    }
    if (recommendedServices.length > 0) {
      return true;
    }
    if (requiredServices.length > 0) {
      return true;
    }
    return false;
  }

  setClient = (client) => {
    this.props.newApptActions.setClient(client);
    this.showPanel().checkConflicts();
  }

  setService = (service) => {
    this.props.newApptActions.addQuickServiceItem(service);
  }

  setAddons = (addons) => {
    const { itemId } = this.getService();
    this.props.newApptActions.addServiceItemExtras(
      itemId,
      'addon',
      addons,
    );
    this.setState((state) => {
      state.hasSelectedAddons = true;
      if (state.hasSelectedAddons && state.hasSelectedRecommended) {
        this.showPanel().checkConflicts();
      }
      return state;
    });
  }

  setRecommended = (recommended) => {
    const { itemId } = this.getService();
    this.props.newApptActions.addServiceItemExtras(
      itemId,
      'recommended',
      recommended,
    );
    this.setState((state) => {
      state.hasSelectedRecommended = true;
      if (state.hasSelectedAddons && state.hasSelectedRecommended) {
        this.showPanel().checkConflicts();
      }
      return state;
    });
  }

  setRequired = (required) => {
    const { itemId } = this.getService();
    this.props.newApptActions.addServiceItemExtras(
      itemId,
      'required',
      required,
    );
  }

  setProvider = (provider) => {
    this.props.newApptActions.setBookedBy(provider);
    return this.showPanel().checkConflicts();
  }

  getService = (withExtras = false) => {
    const { serviceItems } = this.props.newApptState;
    const firstServiceItem = serviceItems[0] || { service: {} };
    const {
      itemId: mainItemId = null,
      service: { service = null },
    } = firstServiceItem;

    if (withExtras) {
      const addons = [];
      const recommended = [];
      let required = null;
      const extras = serviceItems.filter(item => item.parentId === mainItemId);
      extras.forEach((extra) => {
        switch (extra.type) {
          case 'required': {
            required = extra.service.service;
            break;
          }
          case 'recommended': {
            recommended.push(extra.service.service);
            break;
          }
          case 'addon': {
            addons.push(extra.service.service);
            break;
          }
          default:
            break;
        }
      });
      return {
        service,
        addons,
        recommended,
        required,
      };
    }
    return { service, itemId: mainItemId };
  }

  getTotalLength = () => this.props.getLength;

  getEndTime = () => this.props.getEndTime

  getBookButtonText = () => {
    const {
      isLoading,
      isBooking,
    } = this.props.newApptState;
    if (isLoading) {
      return 'LOADING...';
    }
    if (isBooking) {
      return 'BOOKING APPOINTMENT...';
    }
    return 'BOOK NOW';
  }


  openAddons = () => {
    if (this.shouldShowExtras) {
      Animated.timing(
        this.state.addonsHeight,
        {
          toValue: 500,
          duration: 400,
        },
      ).start();
    }
  }

  checkConflicts = () => this.props.newApptActions.getConflicts()

  canBook = () => {
    const {
      client,
      conflicts,
      isLoading,
      isBooking,
      bookedByEmployee,
    } = this.props.newApptState;
    const { service } = this.getService();
    if (
      service === null ||
      client === null ||
      bookedByEmployee === null ||
      conflicts.length > 0 ||
      isLoading ||
      isBooking
    ) {
      return false;
    }

    return true;
  }

  handleBookAnother = () => {
    if (!this.canBook()) {
      return false;
    }

    return this.props.handleBook(true);
  }

  handleBook = (bookAnother) => {
    if (!this.canBook()) {
      return false;
    }

    return this.props.handleBook(bookAnother);
  }

  handleTabChange = (ev, activeTab) => this.props.onChangeTab(activeTab)

  showPanel = () => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        setTimeout(() => {
          this.props.show();
          this.setState({ isAnimating: false }, () => {
            if (this.shouldShowExtras) {
              Animated.timing(
                this.state.addonsHeight,
                {
                  toValue: 500,
                  duration: 500,
                },
              ).start();
            }
          });
        }, 300);
      });
    }
    return this;
  }

  hidePanel = (callback = false) => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        const animateClose = () => {
          setTimeout(() => {
            this.props.hide();
            this.setState({ isAnimating: false }, () => {
              if (isFunction(callback)) {
                return callback();
              }
              return false;
            });
          }, 300);
        };
        if (this.shouldShowExtras) {
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
    const navigateCallback = () => this.props.navigation.navigate('NewAppointment');
    this.props.newApptActions.isBookingQuickAppt(false);
    return this.hidePanel(navigateCallback);
  }

  goToRoomAssignment = () => {
    const { date, bookedByEmployee: employee } = this.props.newApptState;
    const onSave = () => this.showPanel();
    return this.props.navigation.navigate('RoomAssignment', { date, employee, onSave });
  }

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      this.showPanel();
      navigation.goBack();
    },
  })

  renderActiveTab = () => {
    switch (this.props.activeTab) {
      case TAB_OTHER:
        return this.renderOthersTab();
      case TAB_BOOKING:
      default:
        return this.renderBookingTab();
    }
  }

  showToast = (result) => {
    if (result) {
      alert('Messages has been successfully sent.');
    } else {
      alert('An error occurred while sending the message.');
    }
  }

  messageProvidersClients = (message) => {
    this.hidePanel();
    const { date, bookedByEmployee: employee } = this.props.newApptState;
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.newApptActions.messageProvidersClients(formated_date, employee.id, message, this.showToast);
  }

  messageAllClients = (message) => {
    this.hidePanel();
    const { date, bookedByEmployee: employee } = this.props.newApptState;
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.newApptActions.messageAllClients(formated_date, 'test', message, this.showToast);
  }

  openMessageProvidersClients = () => {
    this.setState({ isInputModalVisible: true, postModalFunction: this.messageProvidersClients });
  }

  openMessageAllClients = () => {
    this.setState({ isInputModalVisible: true, postModalFunction: this.messageAllClients });
  }

  renderOthersTab = () => (
    <View style={styles.body}>
      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => {
          this.hidePanel();
          const { date, bookedByEmployee: employee, startTime } = this.props.newApptState;
          this.props.navigation.navigate(
            'BlockTime',
            { date, employee, fromTime: startTime },
          );
        }}
        label="Block Time"
      >
        <View style={styles.iconContainer}>
          <Icon name="clockO" size={18} color="#115ECD" type="solid" />
          <View style={styles.banIconContainer}>
            <Icon
              style={styles.subIcon}
              name="ban"
              size={9}
              color="#115ECD"
              type="solid"
            />
          </View>
        </View>
      </InputButton>

      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => {
          this.hidePanel();
          const { date, bookedByEmployee: employee } = this.props.newApptState;
          this.props.navigation.navigate(
            'EditSchedule',
            { date, employee },
          );
        }}
        label="Edit Schedule"
      >
        <View style={styles.iconContainer}>
          <Icon name="calendarO" size={18} color="#115ECD" type="solid" />

          <View style={styles.penIconContainer}>
            <Icon
              style={styles.subIcon}
              name="pen"
              size={9}
              color="#115ECD"
              type="solid"
            />
          </View>
        </View>
      </InputButton>

      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => this.hidePanel(this.goToRoomAssignment)}
        label="Room Assignment"
      >
        <View style={styles.iconContainer}>
          <Icon name="streetView" size={18} color="#115ECD" type="solid" />
        </View>
      </InputButton>

      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => {
          this.hidePanel();
          const { date, bookedByEmployee: employee } = this.props.newApptState;
          this.props.navigation.navigate(
            'TurnAway',
            { date, employee },
          );
        }}
        label="Turn Away"
      >
        <View style={styles.iconContainer}>
          <Icon name="ban" size={18} color="#115ECD" type="solid" />
        </View>
      </InputButton>

      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={this.openMessageProvidersClients}
        label="Message Provider's Clients"
      >
        <View style={styles.iconContainer}>
          <Icon name="user" size={18} color="#115ECD" type="solid" />
        </View>
      </InputButton>
      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={this.openMessageAllClients}
        label="Message All Clients"
      >
        <View style={styles.iconContainer}>
          <Icon name="users" size={18} color="#115ECD" type="solid" />
        </View>
      </InputButton>
    </View>
  )

  renderBookingTab = () => {
    const {
      navigation,
      filterProviders,
    } = this.props;
    const {
      date,
      startTime,
      client,
      conflicts,
      bookedByEmployee: provider,
      isQuickApptRequested,
    } = this.props.newApptState;
    const contentStyle = { alignItems: 'flex-start', paddingLeft: 11 };
    const selectedStyle = { fontSize: 14, lineHeight: 22, color: conflicts.length > 0 ? 'red' : 'black' };
    const {
      service = null,
      addons = [],
      recommended = [],
      required = null,
    } = this.getService(true);

    return (
      <ScrollView contentContainerStyle={styles.body}>
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
            label={false}
            showLength
            selectExtraServices
            hasViewedAddons={this.state.hasViewedAddons}
            hasViewedRequired={this.state.hasViewedRequired}
            hasViewedRecommended={this.state.hasViewedRecommended}
            ref={(ref) => { this.serviceInput = ref; }}
            selectedClient={client}
            selectedProvider={provider}
            selectedService={service}
            rootStyle={{ height: 39 }}
            selectedStyle={selectedStyle}
            placeholder="Select a Service"
            placeholderStyle={styles.placeholderText}
            contentStyle={contentStyle}
            onPress={this.hidePanel}
            navigate={navigation.navigate}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
            iconStyle={{ color: '#115ECD' }}
            afterDone={() => { this.showPanel().checkConflicts(); }}
            onChange={this.setService}
            onChangeAddons={this.setAddons}
            onChangeRecommended={this.setRecommended}
            onChangeRequired={this.setRequired}
            onCancelExtrasSelection={() => this.showPanel()}
          />
          <InputDivider style={styles.middleSectionDivider} />
          <ProviderInput
            apptBook
            label={false}
            showFirstAvailable={false}
            isRequested={isQuickApptRequested}
            filterList={filterProviders}
            rootStyle={{ height: 39 }}
            selectedProvider={provider}
            selectedService={service}
            placeholder="Select a Provider"
            placeholderStyle={styles.placeholderText}
            selectedStyle={selectedStyle}
            contentStyle={contentStyle}
            iconStyle={{ color: '#115ECD' }}
            avatarSize={20}
            onPress={this.hidePanel}
            navigate={navigation.navigate}
            headerProps={{ title: 'Providers', ...this.cancelButton() }}
            onChange={this.setProvider}
          />
        </View>
        <AddonsContainer
          visible={this.shouldShowExtras}
          addons={addons}
          required={required}
          recommended={recommended}
          height={this.state.addonsHeight}
          onPressAddons={() => {
            this.setState({
              hasSelectedAddons: false,
              hasSelectedRecommended: false,
            }, () => {
              this.serviceInput.selectRecommended().selectAddons();
            });
          }}
          onPressRequired={() => {
            this.serviceInput.selectRequired();
          }}
          onRemoveRequired={() => this.setRequired([])}
        />
        {conflicts.length > 0 && (
          <ConflictBox
            onPress={() => {
              const callback = () => {
                this.props.navigation.navigate('Conflicts', {
                  date,
                  conflicts,
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
            value={this.props.newApptState.isQuickApptRequested}
            onValueChange={requested => this.props.newApptActions.setQuickApptRequested(requested)}
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
              onPress={this.handleBookAnother}
              disabled={!this.canBook()}
              backgroundColor="white"
              color={!this.canBook() ? '#fff' : '#115ECD'}
              text="BOOK ANOTHER"
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  onPressCancelInputModal = () => {
    this.setState({ isInputModalVisible: false });
  }

  onPressOkInputModal = text => this.setState({ isInputModalVisible: false }, () => {
    if (isFunction(this.state.postModalFunction)) {
      this.state.postModalFunction(text);
    }
  });

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
      // style={{ marginBottom: 60 }}
      >
        <View style={[
          styles.container,
          { height: this.props.maxHeight },
        ]}
        >
          <SalonInputModal
            visible={this.state.isInputModalVisible}
            title="Enter a message"
            onPressCancel={this.onPressCancelInputModal}
            onPressOk={this.onPressOkInputModal}
          />
          <TouchableWithoutFeedback onPress={this.hidePanel}>
            <View style={{
              backgroundColor: 'transparent', position: 'absolute', height: this.props.maxHeight, bottom: 0, right: 0, left: 0,
            }}
            />
          </TouchableWithoutFeedback>
          <View style={[styles.slideContainer, {
            maxHeight: this.props.maxHeight,
          }]}
          >
            <View style={styles.header}>
              <SalonTouchableOpacity
                style={{ flex: 4 / 17, justifyContent: 'flex-start' }}
                onPress={this.hidePanel}
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
                  onItemPress={this.handleTabChange}
                  selectedIndex={this.props.activeTab}
                />
              </View>
            </View>
            {this.renderActiveTab()}
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  newApptState: state.newAppointmentReducer,
  getLength: appointmentLength(state),
  getEndTime: getEndTime(state),
});

const mapActionsToProps = dispatch => ({
  newApptActions: bindActionCreators({ ...newApptActions }, dispatch),
});

export default connect(mapStateToProps, mapActionsToProps)(NewApptSlide);
