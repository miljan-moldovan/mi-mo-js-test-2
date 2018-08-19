import React from 'react';
import {
  View,
  Text,
  Modal,
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

import { Services, AppointmentBook, Product } from '../../utilities/apiWrapper';
import Colors from '../../constants/Colors';
import { AppointmentTime } from '../slidePanels/SalonNewAppointmentSlide';
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
import Button from './components/Button';
import ConflictBox from './components/ConflictBox';
import AddonsContainer from './components/AddonsContainer';

import styles from './styles';

const TAB_BOOKING = 0;
const TAB_OTHER = 1;

class NewApptSlide extends React.Component {
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

  // shouldComponentUpdate(nextProps) {

  // }

  onPressAddons = () => {
    this.setState({
      hasViewedAddons: false,
      hasViewedRecommended: false,
    }, () => {
      const { service, itemId } = this.getService();
      this.showAddons(service)
        .then(addons => this.setState({ selectedAddons: addons }, () => {
          this.showRecommended(service)
            .then(recommended => this.setState({ selectedRecommended: recommended }, () => {
              const { selectedAddons, selectedRecommended } = this.state;
              const { newApptActions: { addServiceItemExtras } } = this.props;
              addServiceItemExtras(
                itemId,
                'addon',
                selectedAddons,
              );
              addServiceItemExtras(
                itemId,
                'recommended',
                selectedRecommended,
              );
              this.showPanel().checkConflicts();
            }));
        }));
    });
  }

  onPressRequired = () => {
    const { service, itemId } = this.getService();
    const { newApptActions: { addServiceItemExtras } } = this.props;
    this.showRequired(service)
      .then(required => this.setState({ selectedRequired: required }, () => {
        addServiceItemExtras(
          itemId,
          'required',
          this.state.selectedRequired,
        );
        this.showPanel().checkConflicts();
      }));
  }

  onPressRemoveRequired = () => {
    const { itemId } = this.getService();
    const { newApptActions: { addServiceItemExtras } } = this.props;
    addServiceItemExtras(
      itemId,
      'required',
      [],
    );
    this.showPanel().checkConflicts();
  }

  get shouldShowExtras() {
    const { addons, required, recommended } = this.getService(true);
    return addons.length > 0 || recommended.length > 0 || required !== null;
  }

  setClient = (client) => {
    this.props.newApptActions.setClient(client);
    this.showPanel().checkConflicts();
  }

  setService = (service) => {
    this.showAddons(service)
      .then((selectedAddons) => {
        this.setState({
          selectedAddons,
        }, () => {
          this.showRecommended(service)
            .then((selectedRecommended) => {
              this.setState({
                selectedRecommended,
              }, () => {
                this.showRequired(service)
                  .then((selectedRequired) => {
                    this.setState({ selectedRequired }, () => {
                      const {
                        selectedAddons: addons,
                        selectedRecommended: recommended,
                        selectedRequired: required,
                      } = this.state;
                      this.props.newApptActions.addQuickServiceItem({
                        service,
                        addons,
                        recommended,
                        required,
                      });
                      this.showPanel().checkConflicts();
                    });
                  });
              });
            });
        });
      })
      .catch((err) => {
        this.props.newApptActions.addQuickServiceItem({
          service,
        });
        this.showPanel().checkConflicts();
      });
  }

  setProvider = (provider) => {
    this.props.newApptActions.setMainEmployee(provider);
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

  getEndTime = () => this.props.getEndTime;

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

  showRequired = service => new Promise((resolve) => {
    try {
      const {
        navigation: { navigate },
      } = this.props;
      const { hasViewedRequired: showCancelButton } = this.state;
      if (service && service.requiredServices.length > 0) {
        if (service.requiredServices.length === 1) {
          Services.getService(service.requiredServices[0].id)
            .then(res => resolve({ name: res.description, ...res }));
        } else {
          const navigateCallback = () => navigate('RequiredServices', {
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
  })

  showAddons = service => new Promise((resolve) => {
    try {
      const {
        navigation: { navigate },
      } = this.props;
      const { hasViewedAddons: showCancelButton } = this.state;
      if (service && service.addons.length > 0) {
        const navigateCallback = () => navigate('AddonServices', {
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
  })

  showRecommended = service => new Promise((resolve) => {
    try {
      const {
        navigation: { navigate },
      } = this.props;
      const { hasViewedRecommended: showCancelButton } = this.state;
      if (service && service.recommendedServices.length > 0) {
        const navigateCallback = () => navigate('RecommendedServices', {
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
  })

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

  showToast = (result) => {
    if (result) {
      alert('Messages has been successfully sent.');
    } else {
      alert('An error occurred while sending the message.');
    }
  }

  messageProvidersClients = (message) => {
    this.hidePanel();
    const { date, mainEmployee: employee } = this.props.newApptState;
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.newApptActions.messageProvidersClients(formated_date, employee.id, message, this.showToast);
  }

  messageAllClients = (message) => {
    this.hidePanel();
    const { date, mainEmployee: employee } = this.props.newApptState;
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.newApptActions.messageAllClients(formated_date, 'test', message, this.showToast);
  }

  openMessageProvidersClients = () => {
    this.setState({ isInputModalVisible: true, postModalFunction: this.messageProvidersClients });
  }

  openMessageAllClients = () => {
    this.setState({ isInputModalVisible: true, postModalFunction: this.messageAllClients });
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
    <View style={styles.body}>
      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => {
          this.hidePanel();
          const {
           date, mainEmployee: employee, startTime, bookedByEmployee,
          } = this.props.newApptState;
          this.props.navigation.navigate(
            'BlockTime',
            {
              date, employee, fromTime: startTime, bookedByEmployee,
            },
          );
        }}
        label="Block Time"
      >
        <View style={styles.iconContainer}>
          <Icon name="clockO" size={18} color={Colors.defaultBlue} type="solid" />
          <View style={styles.banIconContainer}>
            <Icon
              style={styles.subIcon}
              name="ban"
              size={9}
              color={Colors.defaultBlue}
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
          const { date, mainEmployee: employee } = this.props.newApptState;
          this.props.navigation.navigate(
            'EditSchedule',
            { date, employee },
          );
        }}
        label="Edit Schedule"
      >
        <View style={styles.iconContainer}>
          <Icon name="calendarO" size={18} color={Colors.defaultBlue} type="solid" />
          <View style={styles.penIconContainer}>
            <Icon
              style={styles.subIcon}
              name="pen"
              size={9}
              color={Colors.defaultBlue}
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
          <Icon name="streetView" size={18} color={Colors.defaultBlue} type="solid" />
        </View>
      </InputButton>

      <InputButton
        noIcon
        style={styles.otherOptionsBtn}
        labelStyle={styles.otherOptionsLabels}
        onPress={() => {
          this.hidePanel();
          const { date, mainEmployee: employee, startTime } = this.props.newApptState;
          this.props.navigation.navigate(
            'ApptBookTurnAway',
            { date, employee, fromTime: startTime },
          );
        }}
        label="Turn Away"
      >
        <View style={styles.iconContainer}>
          <Icon name="ban" size={18} color={Colors.defaultBlue} type="solid" />
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
          <Icon name="user" size={18} color={Colors.defaultBlue} type="solid" />
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
          <Icon name="users" size={18} color={Colors.defaultBlue} type="solid" />
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
      mainEmployee: provider,
      isQuickApptRequested,
    } = this.props.newApptState;
    const {
      service = null,
      addons = [],
      recommended = [],
      required = null,
    } = this.getService(true);

    const contentStyle = { alignItems: 'flex-start', paddingLeft: 11 };
    const selectedStyle = { fontSize: 14, lineHeight: 22, color: conflicts.length > 0 ? 'red' : 'black' };
    const serviceLengthStyle = {
      opacity: service === null ? 0.5 : 1,
      fontStyle: service === null ? 'italic' : 'normal',
    };
    return (
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.dateText}>{moment(date).format('ddd, MMM D')}</Text>
        <AppointmentTime
          containerStyle={styles.flexStart}
          startTime={startTime}
          endTime={this.getEndTime()}
        />
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
          <InputDivider style={styles.middleSectionDivider} />
          <ProviderInput
            apptBook
            label={false}
            isRequested={isQuickApptRequested}
            filterList={filterProviders}
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
        {conflicts.length > 0 && (
          <ConflictBox
            onPress={() => {
              const callback = () => {
                this.props.navigation.navigate('Conflicts', {
                  date,
                  conflicts,
                  startTime,
                  endTime: this.getEndTime(),
                  handleGoBack: () => this.showPanel(),
                });
              };
              return this.hidePanel(callback);
            }}
          />
        )}
        <View style={styles.requestedContainer}>
          <Text style={styles.requestedText}>Provider is Requested?</Text>
          <Switch
            value={this.props.newApptState.isQuickApptRequested}
            onValueChange={requested => this.props.newApptActions.setQuickApptRequested(requested)}
          />
        </View>
        <View style={styles.lengthContainer}>
          <Text style={styles.lengthText}>Length</Text>
          <Text style={[styles.serviceLengthText, serviceLengthStyle]}>
            {service === null ? 'select a service first' : `${this.getTotalLength().asMinutes()} min`}
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
    const { maxHeight: height } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
      // style={{ marginBottom: 60 }}
      >
        <View style={[styles.container, { height }]}>
          <SalonInputModal
            visible={this.state.isInputModalVisible}
            title="Enter a message"
            onPressCancel={this.onPressCancelInputModal}
            onPressOk={this.onPressOkInputModal}
          />
          <TouchableWithoutFeedback onPress={this.hidePanel}>
            <View style={styles.backDrop} />
          </TouchableWithoutFeedback>
          <View style={[styles.slideContainer, { maxHeight: height }]}>
            <View style={styles.header}>
              <SalonTouchableOpacity style={styles.cancelButton} onPress={this.hidePanel}>
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
            </View>
            {this.renderActiveTab()}
          </View>
        </View>
      </Modal>
    );
  }
}
export default NewApptSlide;
