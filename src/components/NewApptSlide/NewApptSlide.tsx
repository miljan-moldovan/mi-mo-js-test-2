import * as React from 'react';
import { View, Text, Modal, ScrollView, Animated, Switch, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { compact, get, slice, isNull, isFunction } from 'lodash';

import { Services, AppointmentBook, Product } from '../../utilities/apiWrapper';
import Colors from '../../constants/Colors';
import { AppointmentTime } from '../slidePanels/SalonNewAppointmentSlide';
import SalonInputModal from '../SalonInputModal';
import { InputButton, InputDivider, ClientInput, ServiceInput, ProviderInput } from '../formHelpers';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import SalonFlatPicker from '../SalonFlatPicker';
import Icon from '@/components/common/Icon';
import Button from './components/Button';
import ConflictBox from './components/ConflictBox';
import AddonsContainer from './components/AddonsContainer';
import SalonToast from '../../screens/appointmentCalendarScreen/components/SalonToast';
import TrackRequestSwitch from '../TrackRequestSwitch';

import styles from './styles';

const TAB_BOOKING = 0;
const TAB_OTHER = 1;

type IProps = {
  navigation: any;
  filterProviders: any;
  maxHeight: any;
  activeTab: any;
  visible: boolean;
  getLength: () => object;
  getEndTime: () => void;
  handleBook: (arg?: any) => void;
  onChangeTab: (arg?: any) => void;
  show: () => void;
  hide: () => void;
  servicesActions: {
    setSelectingExtras: (boolean) => void;
  };
  newApptActions: INewApptActions;
  newApptState: INewApptState;
};

type INewApptActions = {
  addServiceItemExtras: (arg1?: any, arg2?: any, arg3?: any) => void;
  addQuickServiceItem: (arg1?: any, arg2?: any, arg3?: any) => void;
  messageProvidersClients: (arg1?: any, arg2?: any, arg3?: any, arg4?: any) => void;
  messageAllClients: (arg1?: any, arg2?: any, arg3?: any, arg4?: any) => void;
  setMainEmployee: (arg?: any) => void;
  setClient: (arg?: any) => void;
  setQuickApptRequested: (arg?: any) => void;
  getConflicts: (arg?: any) => any;
  isBookingQuickAppt: (arg?: any) => any;
};

type INewApptState = {
  mainEmployee: any;
  serviceItems: any;
  client: any;
  conflicts: any;
  bookedByEmployee: any;
  date: any;
  startTime: any;
  isLoading: boolean;
  isBooking: boolean;
  isQuickApptRequested: boolean;
};

type IState = {
  hasViewedRequired: any;
  selectedAddons: any;
  selectedRequired: any;
  selectedRecommended: any;
  isLoading: boolean;
  visible: boolean;
  activeTab: any;
  isAnimating: boolean;
  hasSelectedAddons: boolean;
  hasSelectedRecommended: boolean;
  hasViewedAddons: boolean;
  hasViewedRecommended: boolean;
  canBook: boolean;
  service: any;
  client: any;
  addons: any;
  recommended: any;
  required: any;
  conflicts: any;
  isRequested: boolean;
  serviceItems: any;
  addonsHeight: any;
  isInputModalVisible: boolean;
  postModalFunction: (arg?: any) => any;
  toast: any;
  otherHeight: number;
};

class NewApptSlide extends React.Component<IProps, IState> {
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
    toast: null,
    otherHeight: 0,
    selectedAddons: null,
    hasViewedRequired: null,
    selectedRequired: null,
    selectedRecommended: null,
    hasViewedAddons: null,
    hasViewedRecommended: null,
  });

  componentWillReceiveProps(newProps) {
    if (!this.props.visible && newProps.visible) {
      this.showPanel();
    } else if (this.props.visible && !newProps.visible) {
      this.hidePanel();
    }
  }

  // shouldComponentUpdate(nextProps) {

  // }

  onPressAddons = () => {
    this.props.servicesActions.setSelectingExtras(true);
    this.setState(
      {
        hasViewedAddons: false,
        hasViewedRecommended: false,
      },
      () => {
        const { service, itemId, addons, recommended } = this.getService(true);
        this.showAddons(service, addons.map(itm => itm.id))
          .then(addons =>
            this.setState({ selectedAddons: addons }, () => {
              this.showRecommended(
                service,
                recommended.map(itm => itm.id),
              ).then(recommended =>
                this.setState({ selectedRecommended: recommended }, () => {
                  const { selectedAddons, selectedRecommended } = this.state;
                  const {
                    newApptActions: { addServiceItemExtras },
                  } = this.props;
                  addServiceItemExtras(itemId, 'addon', selectedAddons);
                  addServiceItemExtras(itemId, 'recommended', selectedRecommended);
                  this.props.servicesActions.setSelectingExtras(false);
                  this.showPanel().checkConflicts();
                }),
              );
            }),
          )
          .catch(() => {
            this.props.servicesActions.setSelectingExtras(false);
          });
      },
    );
  };

  onPressRequired = () => {
    const { service, itemId, required } = this.getService(true);
    const {
      newApptActions: { addServiceItemExtras },
    } = this.props;
    this.showRequired(service, [get(required, 'id', null)]).then(selectedRequired =>
      this.setState({ selectedRequired }, () => {
        addServiceItemExtras(itemId, 'required', this.state.selectedRequired);
        this.showPanel().checkConflicts();
      }),
    );
  };

  onPressRemoveRequired = () => {
    const { itemId } = this.getService();
    const {
      newApptActions: { addServiceItemExtras },
    } = this.props;
    addServiceItemExtras(itemId, 'required', []);
    this.showPanel().checkConflicts();
  };

  get shouldShowExtras() {
    const { addons, required, recommended } = this.getService(true);
    return addons.length > 0 || recommended.length > 0 || required !== null;
  }

  setClient = (client, clientsNav) => {
    const {
      newApptState: { mainEmployee: selectedProvider },
    } = this.props;
    const { service: selectedService } = this.getService();
    clientsNav.navigate('Services', {
      selectedService,
      selectedProvider,
      dismissOnSelect: true,
      onChangeService: service => {
        this.props.newApptActions.setClient(client);
        clientsNav.goBack();
        this.setService(service);
      },
    });
  };

  setService = service => {
    this.props.servicesActions.setSelectingExtras(true);
    this.showAddons(service).then(selectedAddons => {
      this.setState(
        {
          selectedAddons,
        },
        () => {
          this.showRecommended(service).then(selectedRecommended => {
            this.setState(
              {
                selectedRecommended,
              },
              () => {
                this.showRequired(service)
                  .then(selectedRequired => {
                    this.setState({ selectedRequired }, () => {
                      const {
                        selectedRequired: required,
                        selectedAddons: addons,
                        selectedRecommended: recommended,
                      } = this.state;
                      this.props.newApptActions.addQuickServiceItem({
                        addons,
                        service,
                        required,
                        recommended,
                      });
                      this.props.servicesActions.setSelectingExtras(false);
                      this.showPanel().checkConflicts();
                    });
                  })
                  .catch(err => {
                    this.props.newApptActions.addQuickServiceItem({
                      service,
                    });
                    this.props.servicesActions.setSelectingExtras(false);
                    this.showPanel().checkConflicts();
                  });
              },
            );
          });
        },
      );
    });
  };

  setProvider = provider => {
    this.props.newApptActions.setMainEmployee(provider);
    return this.showPanel().checkConflicts();
  };

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
      extras.forEach(extra => {
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
        itemId: mainItemId,
      };
    }
    return { service, itemId: mainItemId };
  };

  getTotalLength = () => this.props.getLength;

  getEndTime = () => this.props.getEndTime;

  getBookButtonText = () => {
    const { isLoading, isBooking } = this.props.newApptState;
    if (isLoading) {
      return 'LOADING...';
    }
    if (isBooking) {
      return 'BOOKING APPOINTMENT...';
    }
    return 'BOOK NOW';
  };

  hideToast = () => this.setState({ toast: null });

  showRequired = (service, selectedIds = []) =>
    new Promise(resolve => {
      try {
        const {
          navigation: { navigate },
        } = this.props;
        const { hasViewedRequired: showCancelButton } = this.state;
        if (service && service.requiredServices.length > 0) {
          if (service.requiredServices.length === 1) {
            Services.getService(service.requiredServices[0].id).then(res => resolve({ name: res.description, ...res }));
          } else {
            const navigateCallback = () =>
              navigate('RequiredServices', {
                selectedIds,
                showCancelButton,
                services: service.requiredServices,
                serviceTitle: service.name,
                onNavigateBack: this.showPanel,
                onSave: selected => resolve(selected),
              });
            this.hidePanel(navigateCallback);
          }
        } else {
          resolve([]);
        }
      } catch (err) {
        console.warn(err);
        resolve([]);
      }
    });

  showAddons = (service, selectedIds = []) =>
    new Promise(resolve => {
      try {
        const {
          navigation: { navigate },
        } = this.props;
        const { hasViewedAddons: showCancelButton } = this.state;
        if (service && service.addons.length > 0) {
          const navigateCallback = () =>
            navigate('AddonServices', {
              selectedIds,
              showCancelButton,
              services: service.addons,
              serviceTitle: service.name,
              onNavigateBack: this.showPanel,
              onSave: services => resolve(services),
            });
          this.hidePanel(navigateCallback);
        } else {
          resolve([]);
        }
      } catch (err) {
        console.warn(err);
        resolve([]);
      }
    });

  showRecommended = (service, selectedIds = []) =>
    new Promise(resolve => {
      try {
        const {
          navigation: { navigate },
        } = this.props;
        const { hasViewedRecommended: showCancelButton } = this.state;
        if (service && service.recommendedServices.length > 0) {
          const navigateCallback = () =>
            navigate('RecommendedServices', {
              selectedIds,
              showCancelButton,
              services: service.recommendedServices,
              serviceTitle: service.name,
              onNavigateBack: this.showPanel,
              onSave: services => resolve(services),
            });
          this.hidePanel(navigateCallback);
        } else {
          resolve([]);
        }
      } catch (err) {
        console.warn(err);
        resolve([]);
      }
    });

  openAddons = () => {
    if (this.shouldShowExtras) {
      Animated.timing(this.state.addonsHeight, {
        toValue: 500,
        duration: 400,
      }).start();
    }
  };

  checkConflicts = () => this.props.newApptActions.getConflicts();

  canBook = () => {
    const { client, conflicts, isLoading, isBooking, mainEmployee, bookedByEmployee } = this.props.newApptState;
    const { service } = this.getService();
    if (
      service === null ||
      client === null ||
      mainEmployee === null ||
      bookedByEmployee === null ||
      conflicts.length > 0 ||
      isLoading ||
      isBooking
    ) {
      return false;
    }

    return true;
  };

  handleBookAnother = () => {
    if (!this.canBook()) {
      return false;
    }

    return this.props.handleBook(true);
  };

  handleBook = bookAnother => {
    const { bookedByEmployee } = this.props.newApptState;
    if (!this.canBook()) {
      return false;
    }
    if (isNull(bookedByEmployee)) {
      return this.setState({
        toast: {
          description: 'Logged in user isn\'t employee\nPlease select booked by from More Options',
          type: 'error',
          btnRightText: 'DISMISS',
        },
      });
    }
    if (bookedByEmployee.isFirstAvailable) {
      return this.setState({
        toast: {
          description: 'Booking employee can\'t be first available\nPlease select booked by from More Options',
          type: 'error',
          btnRightText: 'DISMISS',
        },
      });
    }
    return this.props.handleBook(bookAnother);
  };

  handleTabChange = (ev, activeTab) => this.props.onChangeTab(activeTab);

  showPanel = (callback?: () => void) => {
    if (!this.state.isAnimating) {
      this.setState({ isAnimating: true }, () => {
        setTimeout(() => {
          this.props.show();
          this.setState({ isAnimating: false }, () => {
            if (this.shouldShowExtras) {
              Animated.timing(this.state.addonsHeight, {
                toValue: 500,
                duration: 500,
              }).start(() => {
                if (isFunction(callback)) {
                  callback();
                }
              });
            }
          });
        }, 300);
      });
    }
    return this;
  };

  hidePanel = (callback?: any) => {
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
          Animated.timing(this.state.addonsHeight, {
            toValue: 0,
            duration: 500,
          }).start(() => animateClose());
        } else {
          animateClose();
        }
      });
    }

    return this;
  };

  goToFullForm = () => {
    const navigateCallback = () => this.props.navigation.navigate('NewAppointment');
    this.props.newApptActions.isBookingQuickAppt(false);
    return this.hidePanel(navigateCallback);
  };

  goToRoomAssignment = () => {
    const { date, mainEmployee: employee } = this.props.newApptState;
    const onSave = () => {
      this.hidePanel();
      this.props.apptBookActions.setGridView();
    };
    if (employee.isFirstAvailable) {
      return this.setState({
        toast: {
          description: 'Please select a specific employee',
          type: 'error',
          btnRightText: 'DISMISS',
        },
      });
    }
    const navigationCallback = () =>
      this.props.navigation.navigate('RoomAssignment', {
        date,
        employee,
        onSave,
      });
    return this.hidePanel(navigationCallback);
  };

  cancelButton = () => ({
    leftButton: <Text style={{ fontSize: 14, color: 'white' }}>Cancel</Text>,
    leftButtonOnPress: navigation => {
      this.showPanel();
      navigation.goBack();
    },
  });

  showToast = result => {
    // if (result) {
    //   alert('Messages has been successfully sent.');
    // } else {
    //   alert('An error occurred while sending the message.');
    // }
  };

  messageProvidersClients = message => {
    this.hidePanel();
    const { date, mainEmployee: employee } = this.props.newApptState;
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.newApptActions.messageProvidersClients(formated_date, employee.id, message, this.showToast);
  };

  messageAllClients = message => {
    this.hidePanel();
    const { date, mainEmployee: employee } = this.props.newApptState;
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.newApptActions.messageAllClients(formated_date, 'test', message, this.showToast);
  };

  openMessageProvidersClients = () => {
    this.setState({
      isInputModalVisible: true,
      postModalFunction: this.messageProvidersClients,
    });
  };

  openMessageAllClients = () => {
    this.setState({
      isInputModalVisible: true,
      postModalFunction: this.messageAllClients,
    });
  };

  renderActiveTab = () => {
    switch (this.props.activeTab) {
      case TAB_OTHER:
        return this.renderOthersTab();
      case TAB_BOOKING:
      default:
        return this.renderBookingTab();
    }
  };

  renderOthersTab = () => {
    const { mainEmployee: employee } = this.props.newApptState;

    const isFirstAvailable = employee ? get(employee, 'isFirstAvailable', false) : true;

    const messageAllClientsButton = (
      <InputButton
        icon={false}
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={this.openMessageAllClients}
        label="Message All Clients"
      >
        <View style={styles.iconContainer}>
          <Icon name="users" size={18} color={Colors.defaultBlue} type="solid"/>
        </View>
      </InputButton>
    );

    return (
      <View style={[styles.body, { height: this.state.otherHeight }]}>
        {isFirstAvailable ? (
          <React.Fragment>{messageAllClientsButton}</React.Fragment>
        ) : (
          <React.Fragment>
            <InputButton
              icon={false}
              style={styles.otherOptionsBtn}
              labelStyle={styles.otherOptionsLabels}
              onPress={() => {
                this.hidePanel();
                const { date, startTime, bookedByEmployee, mainEmployee: employee } = this.props.newApptState;
                this.props.navigation.navigate('BlockTime', {
                  date,
                  employee,
                  fromTime: startTime,
                  bookedByEmployee,
                });
              }}
              label="Block Time"
            >
              <View style={styles.iconContainer}>
                <Icon name="clockO" size={16} color={Colors.defaultBlue} type="regular"/>
                <View style={styles.banIconContainer}>
                  <Icon style={styles.subIcon} name="ban" size={9} color={Colors.defaultBlue} type="solid"/>
                </View>
              </View>
            </InputButton>

            <InputButton
              icon={false}
              style={styles.otherOptionsBtn}
              labelStyle={styles.otherOptionsLabels}
              onPress={() => {
                const { date, mainEmployee: employee } = this.props.newApptState;
                this.hidePanel();
                this.props.navigation.navigate('EditSchedule', {
                  date,
                  employee,
                });
              }}
              label="Edit Schedule"
            >
              <View style={styles.iconContainer}>
                <Icon name="calendarEdit" size={16} color={Colors.defaultBlue} type="regular"/>
              </View>
            </InputButton>

            <InputButton
              icon={false}
              style={styles.otherOptionsBtn}
              labelStyle={styles.otherOptionsLabels}
              onPress={this.goToRoomAssignment}
              label="Room Assignment"
            >
              <View style={styles.iconContainer}>
                <Icon name="streetView" size={16} color={Colors.defaultBlue} type="solid"/>
              </View>
            </InputButton>

            <InputButton
              icon={false}
              style={styles.otherOptionsBtn}
              labelStyle={styles.otherOptionsLabels}
              onPress={() => {
                this.hidePanel();
                const { date, mainEmployee: employee, startTime } = this.props.newApptState;
                this.props.navigation.navigate('TurnAway', {
                  date,
                  employee,
                  fromTime: startTime,
                  apptBook: true,
                });
              }}
              label="Turn Away"
            >
              <View style={styles.iconContainer}>
                <Icon name="ban" size={16} color={Colors.defaultBlue} type="solid"/>
              </View>
            </InputButton>

            <InputButton
              icon={false}
              style={styles.otherOptionsBtn}
              labelStyle={styles.otherOptionsLabels}
              onPress={this.openMessageProvidersClients}
              label="Message Provider's Clients"
            >
              <View style={styles.iconContainer}>
                <Icon name="userAlt" size={16} color={Colors.defaultBlue} type="regular"/>
              </View>
            </InputButton>
            <InputButton
              icon={false}
              style={styles.otherOptionsBtn}
              labelStyle={styles.otherOptionsLabels}
              onPress={this.openMessageAllClients}
              label="Message All Clients"
            >
              <View style={styles.iconContainer}>
                <Icon name="group" size={16} color={Colors.defaultBlue} type="regular"/>
              </View>
            </InputButton>
          </React.Fragment>
        )}
      </View>
    );
  };

  handleHeigth = (contentWidth, contentHeight) => {
    if (this.state.otherHeight !== contentHeight) {
      this.setState({
        otherHeight: contentHeight,
      });
    }
  };

  renderBookingTab = () => {
    const { navigation, filterProviders } = this.props;
    const {
      date,
      startTime,
      client,
      conflicts,
      mainEmployee: provider,
      isQuickApptRequested,
    } = this.props.newApptState;
    const { service = null, addons = [], recommended = [], required = null } = this.getService(true);

    const contentStyle = { alignItems: 'flex-start', paddingLeft: 11 };
    const selectedStyle = {
      fontSize: 14,
      lineHeight: 22,
      color: conflicts.length > 0 ? 'red' : 'black',
    };
    const serviceLengthStyle = {
      // TODO: opacity is not supported on <Text />
      // opacity: service === null ? 0.5 : 1,
      fontStyle: service === null ? 'italic' : 'normal',
    };
    const conflictsCallback = () => {
      navigation.navigate('Conflicts', {
        date,
        conflicts,
        startTime,
        endTime: this.getEndTime(),
        handleGoBack: () => this.showPanel(),
        handleDone: () => this.showPanel(),
      });
    };
    const onPressConflicts = () => this.hidePanel(conflictsCallback);
    return (
      <ScrollView
        onContentSizeChange={this.handleHeigth}
        contentContainerStyle={styles.body}
      >
        <Text style={styles.dateText}>{moment(date).format('ddd, MMM D')}</Text>
        <AppointmentTime containerStyle={styles.flexStart} startTime={startTime} endTime={this.getEndTime()}/>
        <View style={styles.mainInputGroup}>
          <ClientInput
            apptBook
            label={false}
            style={styles.inputHeight}
            selectedClient={client}
            placeholder={client === null ? 'Select Client' : 'Client'}
            placeholderStyle={styles.placeholderText}
            contentStyle={contentStyle}
            selectedStyle={selectedStyle}
            onPress={() => this.hidePanel()}
            navigate={navigation.navigate}
            headerProps={{ title: 'Clients', ...this.cancelButton() }}
            iconStyle={styles.inputColor}
            onChangeWithNavigation={this.setClient}
          />
          <InputDivider style={styles.middleSectionDivider}/>
          <ServiceInput
            apptBook
            label={false}
            showLength
            selectExtraServices
            hasViewedAddons={this.state.hasViewedAddons}
            hasViewedRequired={this.state.hasViewedRequired}
            hasViewedRecommended={this.state.hasViewedRecommended}
            ref={ref => {
              this.serviceInput = ref;
            }}
            selectedClient={client}
            selectedProvider={provider}
            selectedService={service}
            rootStyle={styles.inputHeight}
            selectedStyle={selectedStyle}
            placeholder="Select a Service"
            placeholderStyle={styles.placeholderText}
            contentStyle={contentStyle}
            onPress={this.hidePanel}
            navigate={navigation.navigate}
            headerProps={{ title: 'Services', ...this.cancelButton() }}
            iconStyle={styles.inputColor}
            onChange={this.setService}
          />
          <InputDivider style={styles.middleSectionDivider}/>
          <ProviderInput
            apptBook
            label={false}
            mode="newAppointment"
            date={date}
            isRequested={isQuickApptRequested}
            rootStyle={styles.inputHeight}
            selectedProvider={provider}
            selectedService={service}
            placeholder="Select a Provider"
            placeholderStyle={styles.placeholderText}
            selectedStyle={selectedStyle}
            contentStyle={contentStyle}
            iconStyle={styles.inputColor}
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
          onPressAddons={this.onPressAddons}
          onPressRequired={this.onPressRequired}
          onRemoveRequired={this.onPressRemoveRequired}
        />
        {conflicts.length > 0 && <ConflictBox onPress={onPressConflicts}/>}
        <View style={styles.requestedContainer}>
          {/*  <Text style={styles.requestedText}>Provider is Requested?</Text>
          <Switch
            value={this.props.newApptState.isQuickApptRequested}
            onValueChange={requested => this.props.newApptActions.setQuickApptRequested(requested)}
          />
          */}

          <View style={{ flex: 1 }}>
            {provider ? (
              <TrackRequestSwitch
                hideDivider={false}
                style={{ marginLeft: 0, paddingRight: 0 }}
                textStyle={styles.requestedText}
                onChange={this.props.newApptActions.setQuickApptRequested}
                isFirstAvailable={provider.isFirstAvailable}
              />
            ) : null}
          </View>
        </View>
        <View style={styles.lengthContainer}>
          <Text style={styles.lengthText}>Length</Text>
          <Text style={[styles.serviceLengthText, serviceLengthStyle]}>
            {
              service === null ?
              'select a service first' :
              `${this.getTotalLength().asMinutes()} min`
            }
          </Text>
        </View>
        <View style={styles.flexColumn}>
          <Button
            onPress={this.handleBook}
            disabled={!this.canBook()}
            text={this.getBookButtonText()}
          />
          <View style={styles.buttonGroupContainer}>
            <Button
              style={{ flex: 8 / 17 }}
              onPress={this.goToFullForm}
              backgroundColor="white"
              color={Colors.defaultBlue}
              text="MORE OPTIONS"
            />
            <Button
              style={{ flex: 8 / 17 }}
              onPress={this.handleBookAnother}
              disabled={!this.canBook()}
              backgroundColor="white"
              color={!this.canBook() ? '#fff' : Colors.defaultBlue}
              text="BOOK ANOTHER"
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  onPressCancelInputModal = () => {
    this.setState({ isInputModalVisible: false });
  };

  onPressOkInputModal = text =>
    this.setState({ isInputModalVisible: false }, () => {
      if (isFunction(this.state.postModalFunction)) {
        this.state.postModalFunction(text);
      }
    });

  render() {
    const { maxHeight: height } = this.props;
    const { toast } = this.state;
    return (
      <Modal visible={this.props.visible} transparent animationType="slide">
        <View style={styles.container}>
          {toast && (
            <SalonToast
              type={toast.type}
              hide={this.hideToast}
              description={toast.description}
              btnRightText={toast.btnRightText}
            />
          )}
          <SalonInputModal
            visible={this.state.isInputModalVisible}
            title="Enter a message"
            onPressCancel={this.onPressCancelInputModal}
            onPressOk={this.onPressOkInputModal}
          />
          <TouchableWithoutFeedback onPress={this.hidePanel}>
            <View style={styles.backDrop}/>
          </TouchableWithoutFeedback>
          <View style={[styles.slideContainer, { maxHeight: height }]}>
            <View style={styles.header}>
              <SalonTouchableOpacity
                style={styles.cancelButton}
                onPress={this.hidePanel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </SalonTouchableOpacity>
              <View style={styles.headerMiddle}>
                <SalonFlatPicker
                  rootStyle={styles.justifyCenter}
                  dataSource={['New Appt.', 'Other']}
                  selectedColor="#FFFFFF"
                  selectedTextColor={Colors.defaultBlue}
                  unSelectedTextColor="#FFFFFF"
                  textFontSize={13}
                  onItemPress={this.handleTabChange}
                  selectedIndex={this.props.activeTab}
                />
              </View>
              <View style={styles.headerStub}/>
            </View>
            {this.renderActiveTab()}
          </View>
        </View>
      </Modal>
    );
  }
}

export default NewApptSlide;
