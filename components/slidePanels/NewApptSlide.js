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
import newAppointmentState from '../../reducers/newAppointment';
import {
  getEndTime,
  appointmentLength,
} from '../../redux/selectors/newAppt';

import { AppointmentBook } from '../../utilities/apiWrapper';
import { AppointmentTime } from './SalonNewAppointmentSlide';
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
  otherOptionsBtn: { height: 67, paddingRight: 0 },
  subIcon: {
    backgroundColor: '#E5E5E5',
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
  },
  clockIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  penIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingTop: 5,
  },
  banIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingRight: 15,
  },
  bookApptContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
              onPressIcon={props.onRemoveRequired}
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
    height: new Animated.Value(0),
  });

  componentWillReceiveProps(newProps) {
    if (!this.props.visible && newProps.visible) {
      this.showPanel();
    } else if (this.props.visible && !newProps.visible) {
      this.hidePanel();
    }
  }

  setClient = (client) => {
    this.props.newApptActions.setClient(client);
    this.showPanel().checkConflicts();
  }

  setService = (service) => {
    this.props.newApptActions.addQuickServiceItem(service);
    this.showPanel().checkConflicts();
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
    return this.showPanel().checkConflicts();
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

  animateHeight = value => Animated.timing(
    this.state.height,
    {
      toValue: value,
      duration: 300,
    },
  )

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

  handleBook = () => {
    if (!this.canBook()) {
      return false;
    }

    return this.props.handleBook();
  }

  handleTabChange = (ev, activeTab) => this.props.onChangeTab(activeTab)

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

  shouldShowExtras = () => {
    const { addons, required, recommended } = this.getService(true);
    return addons.length > 0 || recommended.length > 0 || required !== null;
  }

  renderActiveTab = () => {
    switch (this.props.activeTab) {
      case TAB_OTHER:
        return this.renderOthersTab();
      case TAB_BOOKING:
      default:
        return this.renderBookingTab();
    }
  }

  renderOthersTab = () => (
    <React.Fragment>
      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => { alert('Not implemented'); }}
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
        onPress={() => { alert('Not implemented'); }}
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
        onPress={() => { alert('Not implemented'); }}
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
        onPress={() => { alert('Not implemented'); }}
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
        onPress={() => { alert('Not implemented'); }}
        label="Message All Clients"
      >
        <View style={styles.iconContainer}>
          <Icon name="users" size={18} color="#115ECD" type="solid" />
        </View>
      </InputButton>
    </React.Fragment>
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
            hasViewedAddons
            hasViewedRequired
            hasViewedRecommended
            selectExtraServices
            ref={(serviceInput) => { this.serviceInput = serviceInput; }}
            selectedProvider={provider}
            selectedService={service}
            addons={addons}
            required={required}
            recommended={recommended}
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
            onChangeAddons={this.setAddons}
            onChangeRecommended={this.setRecommended}
            onChangeRequired={this.setRequired}
            onCancelExtrasSelection={() => this.showPanel()}
          />
          <InputDivider style={styles.middleSectionDivider} />
          <ProviderInput
            noLabel
            apptBook
            filterByService
            isRequested={isQuickApptRequested}
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
              onPress={() => alert('Not Implemented')}
              disabled={this.state.canBook}
              backgroundColor="white"
              color="#115ECD"
              text="BOOK ANOTHER"
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  render() {
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
                  onItemPress={this.handleTabChange}
                  selectedIndex={this.props.activeTab}
                />
              </View>
            </View>
            <View style={styles.body}>
              {this.renderActiveTab()}
            </View>
          </Animated.View>
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
