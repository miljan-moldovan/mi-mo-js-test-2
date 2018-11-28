import React from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Alert,
  //  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';

import moment from 'moment';
import _, {get} from 'lodash';
import PropTypes from 'prop-types';

import LoadingOverlay from '../../../components/LoadingOverlay';

import QueueItemSummary from '../queueItemSummary';
import * as actions from '../../../redux/actions/queue';
import SalonInputModal from '../../../components/SalonInputModal';
import SalonAlert from '../../../components/SalonAlert';
import {Client, QueueStatus} from '../../../utilities/apiWrapper';
import regexs from '../../../constants/Regexs';

import {
  QUEUE_ITEM_FINISHED,
  QUEUE_ITEM_RETURNING,
  QUEUE_ITEM_NOT_ARRIVED,
} from '../../../constants/QueueStatus';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import CircularCountdown from '../../../components/CircularCountdown';
import {
  NotificationBanner,
  NotificationBannerButton,
} from '../../../components/NotificationBanner';
import ServiceIcons from '../../../components/ServiceIcons';
import Icon from '@/components/common/Icon';
import QueueTimeNote from '../queueTimeNote';
import {shortenTitle} from '../../../utilities/helpers';
import groupedSettingsSelector from '../../../redux/selectors/settingsSelector';
import styles from './styles';

import type {QueueItem} from '../../../models';
import checkBusyEmploeeInServiceQueue
  from '../../../utilities/helpers/checkBusyEmploeeInServiceQueue';

const groups = {};

class Queue extends React.Component {
  state = {
    refreshing: false,
    notificationVisible: false,
    notificationType: '',
    notificationItem: {},
    appointment: null,
    isVisible: false,
    client: null,
    services: null,
    data: [],
    isEmailVisible: false,
    email: '',
    sortItemsBy: {value: 'FIRST_ARRIVED', label: 'First Arrived'},
    modalBusyEmployee: null,
  };
  componentWillMount () {
    const {data, searchClient, searchProvider, filterText} = this.props;

    const sortedItems = this.sortItems (this.state.sortItemsBy, data);
    this.setState ({data: sortedItems});
    if (searchClient || searchProvider) {
      this.searchText (filterText, searchClient, searchProvider);
    }
  }
  componentWillReceiveProps({data, searchClient, searchProvider, filterText}) {
    if (data !== this.props.data) {
      let sortedItems = this.sortItems (this.state.sortItemsBy, data);
      sortedItems = sortedItems.filter (({services}) => services.length > 0);
      this.setState ({data: sortedItems});
    }
    // if (nextProps.filterText !== null && nextProps.filterText !== this.props.filterText) {
    if (
      searchClient !== this.props.searchClient ||
      searchProvider !== this.props.searchProvider ||
      filterText !== this.props.filterText ||
      (data !== this.props.data && filterText)
    ) {
      this.searchText (filterText, searchClient, searchProvider);
    }
  }
  onChangeFilterResultCount = () => {
    if (this.props.onChangeFilterResultCount) {
      this.props.onChangeFilterResultCount (this.state.data.length);
    }
  };

  componentDidUpdate (prevProps, prevState) {
    if (this.props.error && !this.state.notificationVisible) {
      this.showNotification (this.props.error, 'error');
    }
  }

  searchText = (
    query: string,
    searchClient: boolean,
    searchProvider: boolean
  ) => {
    const {data} = this.props;
    const prevCount = this.state.data.length;
    if (query === '' || (!searchClient && !searchProvider)) {
      this.setState (
        {data},
        prevCount != data.length ? this.onChangeFilterResultCount : undefined
      );
    }
    const text = query.toLowerCase ();
    // search by the client full name
    const filteredData = data.filter (({client, services}) => {
      //  if (searchClient) {
      const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
      // if this row is a match, we don't need to check providers
      if (fullName.toLowerCase ().match (text)) {
        return true;
      }
      //  }
      //    if (searchProvider) {
      for (let i = 0; i < services.length; i++) {
        const service = services[i];

        const employee = service.isFirstAvailable
          ? {
              id: 0,
              isFirstAvailable: true,
              fullName: 'First Available',
            }
          : service.employee;

        const fullNameProvider = `${employee.name || ''} ${employee.lastName || ''}`;

        if (fullNameProvider.toLowerCase ().match (text)) {
          return true;
        }
        if (service.serviceName.toLowerCase ().match (text)) {
          return true;
        }
      }
      //  }
      return false;
    });
    // if no match, set empty array
    if (!filteredData || !filteredData.length) {
      this.setState (
        {data: []},
        prevCount != 0 ? this.onChangeFilterResultCount : undefined
      );
    } else if (filteredData.length === data.length) {
      // if the matched numbers are equal to the original data, keep it the same
      this.setState (
        {data: this.props.data},
        prevCount != this.props.data.length
          ? this.onChangeFilterResultCount
          : undefined
      );
    } else {
      // else, set the filtered data
      this.setState (
        {data: filteredData},
        prevCount != filteredData.length
          ? this.onChangeFilterResultCount
          : undefined
      );
    }
  };

  handlePressSummary = {
    checkIn: isActiveCheckin => this.handlePressCheckIn (isActiveCheckin),
    rebook: () => this.handlePressRebook (),
    walkOut: isActiveWalkOut => this.handlePressWalkOut (isActiveWalkOut),
    modify: (isWaiting, onPressSummary) =>
      this.handlePressModify (isWaiting, onPressSummary),
    returning: returned => this.handleReturning (returned),
    toService: () => this.checkHasEmail (),
    toWaiting: () => this.handleToWaiting (),
    finish: finish => this.handlePressFinish (finish),
    checkOut: id => this.handlePressCheckOut (id),
  };

  _onRefresh = () => {
    this.props.loadQueueData ();
  };

  getGroupLeaderName = (item: QueueItem) => {
    const {groups} = this.props;
    if (groups && groups[item.groupId]) {
      return groups[item.groupId].groupLeadName;
    }
    return null;
  };

  getprocessMinutes = item => {
    const processTime = moment (item.processTime, 'hh:mm:ss');
    const processMinutes = moment (item.processTime, 'hh:mm:ss').isValid ()
      ? processTime.minutes () + processTime.hours () * 60
      : 0;

    return processMinutes;
  };

  getprogressMaxMinutes = item => {
    const progressMaxTime = moment (item.progressMaxTime, 'hh:mm:ss');

    const progressMaxMinutes = moment (
      item.progressMaxTime,
      'hh:mm:ss'
    ).isValid ()
      ? progressMaxTime.minutes () + progressMaxTime.hours () * 60
      : 0;

    return progressMaxMinutes;
  };

  getLabelForItem = (item, customStyle = {}) => {
    switch (item.status) {
      case QUEUE_ITEM_FINISHED:
        return (
          <View style={styles.finishedContainer}>

            <View style={styles.finishedTime}>
              <View
                style={[
                  styles.finishedTimeFlag,
                  item.processTime > item.estimatedTime
                    ? {backgroundColor: '#D1242A'}
                    : null,
                ]}
              />
              <Text style={styles.finishedTimeText}>
                {this.getprocessMinutes (item)}min /
                <Text style={{fontFamily: 'Roboto-Regular'}}>
                  {this.getprogressMaxMinutes (item)}min est.{' '}
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.waitingTime,
                {backgroundColor: 'black', marginRight: 0},
              ]}
            >
              <Text style={[styles.waitingTimeTextTop, {color: 'white'}]}>
                FINISHED
              </Text>
            </View>
          </View>
        );
        break;
      case QUEUE_ITEM_RETURNING:
        return (
          <View style={styles.returningContainer}>
            <View
              style={[
                styles.waitingTime,
                {marginRight: 0, backgroundColor: 'black'},
              ]}
            >
              <Text style={[styles.waitingTimeTextTop, {color: 'white'}]}>
                RETURNING
              </Text>
            </View>
          </View>
        );
      case QUEUE_ITEM_NOT_ARRIVED:
        return (
          <View style={styles.notArrivedContainer}>
            <View
              style={[
                styles.waitingTime,
                {
                  marginRight: 0,
                  flexDirection: 'row',
                  backgroundColor: 'rgba(192,193,198,1)',
                },
              ]}
            >
              <Text style={[styles.waitingTimeTextTop, {color: '#555'}]}>
                NOT ARRIVED{' '}
              </Text>
              <Icon
                name="circle"
                style={{fontSize: 2, color: '#555'}}
                type="solid"
              />
              <Text style={[styles.waitingTimeTextTop, {color: '#D1242A'}]}>
                {' '}LATE
              </Text>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.circularCountdownContainer}>
            <CircularCountdown
              size={46}
              item={item}
              style={[styles.circularCountdown, customStyle]}
            />
          </View>
        );
    }
  };

  hideAll = () => {
    this.props.setLoading (true);
    setTimeout (() => {
      this.hideDialog ();
    }, 500);
  };

  handlePress = item => {
    if (!this.state.isVisible) {
      this.setState ({
        appointmentId: item.id,
        appointment: item,
        client: item.client,
        services: item.services,
        isVisible: true,
      });
    }
  };

  showDialog = () => {
    this.setState ({isVisible: true});
  };

  handlePressModify = (isWaiting, onPressSummary) => {
    const {appointment} = this.state;
    const client = get (appointment, 'client', null);
    if (appointment && client) {
      this.hideDialog ();
      const getLabel = style => this.getLabelForItem (appointment, style);
      this.props.navigation.navigate ('AppointmentDetails', {
        client,
        appointment,
        getLabel,
        isWaiting,
        onPressSummary: this.handlePressSummary,
        loadQueueData: this.props.loadQueueData,
      });
    }
  };

  handlePressRebook = () => {
    const {appointment} = this.state;
    this.hideDialog ();
    if (appointment !== null) {
      this.props.navigation.navigate ('RebookDialog', {
        mustGoBack: true,
        appointment,
        ...this.props,
      });
    }
  };

  handlePressCheckIn = isActiveCheckin => {
    const {appointment} = this.state;
    if (isActiveCheckin) {
      this.hideAll ();
      this.props.checkInClient (appointment.id, this.props.loadQueueData);
    } else {
      this.hideAll ();
      this.props.uncheckInClient (appointment.id, this.props.loadQueueData);
    }
  };

  handlePressWalkOut = isActiveWalkOut => {
    const {appointment} = this.state;

    const {settings} = this.props.settings;

    let trackQueueRemoval = _.find (settings, {
      settingName: 'TrackQueueRemoval',
    });
    trackQueueRemoval = trackQueueRemoval
      ? trackQueueRemoval.settingValue
      : false;

    if (isActiveWalkOut) {
      if (appointment !== null) {
        this.hideDialog ();

        if (trackQueueRemoval) {
          this.props.navigation.navigate ('RemovalReasonTypes', {
            transition: 'SlideFromBottom',
            appointment,
            type: 'walkout',
            ...this.props,
          });
        } else {
          this.props.setLoading (true);
          const {client} = appointment;

          const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;

          setTimeout (() => {
            Alert.alert (
              'WALK-OUT',
              `Are you sure you want to mark ${fullName} as a walk-out?`,
              [
                {
                  text: 'No, cancel',
                  onPress: () => {
                    this.props.setLoading (false);
                  },
                  style: 'cancel',
                },
                {
                  text: 'Yes, I’m sure',
                  onPress: () => {
                    this.hideAll ();
                    this.props.walkOut (
                      appointment.id,
                      {},
                      this.props.loadQueueData
                    );
                  },
                },
              ],
              {cancelable: false}
            );
          }, 500);
        }
      }
    } else if (appointment !== null) {
      this.hideDialog ();

      if (trackQueueRemoval) {
        this.props.navigation.navigate ('RemovalReasonTypes', {
          transition: 'SlideFromBottom',
          appointment,
          type: 'noshow',
          ...this.props,
        });
      } else {
        this.props.setLoading (true);
        const {client} = appointment;

        const fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
        setTimeout (() => {
          Alert.alert (
            'No show',
            `Are you sure you want to mark ${fullName} as a no show?`,
            [
              {
                text: 'No, cancel',
                onPress: () => {
                  this.props.setLoading (false);
                },
                style: 'cancel',
              },
              {
                text: 'Yes, I’m sure',
                onPress: () => {
                  this.hideAll ();
                  this.props.noShow (
                    appointment.id,
                    {},
                    this.props.loadQueueData
                  );
                },
              },
            ],
            {cancelable: false}
          );
        }, 500);
      }
    }
  };

  handleReturning = returned => {
    const {appointment} = this.state;

    if (returned) {
      this.hideAll ();
      this.props.returned (appointment.id, this.props.loadQueueData);
    } else {
      this.hideAll ();
      this.props.returnLater (appointment.id, this.props.loadQueueData);
    }
  };

  cancelButton = () => ({
    leftButton: <Text style={{fontSize: 14, color: 'white'}}>Cancel</Text>,
    leftButtonOnPress: navigation => {
      this.props.navigation.navigate ('Main');
    },
  });

  checkHasProvider = (ignoreAutoAssign, redirectAfterMerge = false) => {
    const {appointment} = this.state;
    const serviceIndexesWithOutProvider = [];
    const {services} = appointment;

    const {settings} = this.props.settings;

    let autoAssignFirstAvailableProvider = _.find (settings, {
      settingName: 'AutoAssignFirstAvailableProvider',
    });
    autoAssignFirstAvailableProvider = autoAssignFirstAvailableProvider
      ? autoAssignFirstAvailableProvider.settingValue
      : false;
    autoAssignFirstAvailableProvider = ignoreAutoAssign
      ? false
      : autoAssignFirstAvailableProvider;
    if (!autoAssignFirstAvailableProvider) {
      services.forEach ((service, index) => {
        if (!service.employee || ignoreAutoAssign) {
          serviceIndexesWithOutProvider.push (index);
        }
      });
    }
    if (serviceIndexesWithOutProvider.length) {
      this.hideDialog ();
      this.selectProvider (serviceIndexesWithOutProvider);
    } else {
      this.hideAll ();
      this.handleStartService ();
      if (redirectAfterMerge) {
        this.props.navigation.navigate ('Main');
      }
    }
  };

  selectProvider = serviceIndexesWithOutProvider => {
    const {appointment} = this.state;
    const index = serviceIndexesWithOutProvider[0];
    const service = appointment.services[index];
    const newServiceIndexesWithOutProvider = serviceIndexesWithOutProvider.slice (
      1
    );
    this.props.navigation.navigate ('Providers', {
      headerProps: {
        title: shortenTitle (service.serviceName),
        subTitle: 'Select Provider',
        ...this.cancelButton (),
      },
      dismissOnSelect: false,
      selectedService: {id: service.serviceId},
      showFirstAvailable: false,
      checkProviderStatus: true,
      queueList: true,
      onChangeProvider: provider =>
        this.handleProviderSelection (
          provider,
          index,
          newServiceIndexesWithOutProvider
        ),
    });
  };

  checkHasEmail = () => {
    const {appointment} = this.state;

    const {client} = appointment;

    const {settings} = this.props.settings;

    this.setState ({email: ''});
    let forceMissingQueueEmail = _.find (settings, {
      settingName: 'ForceMissingQueueEmail',
    });
    forceMissingQueueEmail = forceMissingQueueEmail
      ? forceMissingQueueEmail.settingValue
      : false;
    if (forceMissingQueueEmail && (!client.email || !client.email.trim ())) {
      this.hideDialog ();
      this.props.setLoading (true);
      setTimeout (this.showEmailModal, 500);
    } else {
      this.hideAll ();
      this.checkShouldMerge ();
    }
  };

  checkShouldMerge = () => {
    const {appointment} = this.state;
    this.props.setLoading (true);
    const {client} = appointment;

    this.props.clientsActions.getMergeableClients (client.id, response => {
      if (response) {
        const {mergeableClients} = this.props.clientsState;
        if (mergeableClients.length === 0) {
          this.checkHasProvider (false);
        } else {
          this.hideDialog ();

          this.props.navigation.navigate ('ClientMerge', {
            clientId: client.id,
            onPressBack: () => {
              this.checkHasProvider (false, true);
            },
            onDismiss: () => {
              this.checkHasProvider (false, true);
            },
          });
        }
      } else {
        alert ('error');
      }
    });
  };

  handleProviderSelection = (
    provider,
    index,
    serviceIndexesWithOutProvider
  ) => {
    const {appointment} = this.state;
    const service = appointment.services[index];
    service.employee = provider;
    if (serviceIndexesWithOutProvider.length) {
      this.selectProvider (serviceIndexesWithOutProvider);
    } else {
      this.handleStartService ();
      this.props.navigation.navigate ('Main');
    }
  };

  startService = () => {
    const {appointment} = this.state;
    const serviceEmployees = [];
    appointment.services.forEach (service => {
      if (service.employee) {
        serviceEmployees.push ({
          serviceEmployeeId: service.id,
          serviceId: service.serviceId,
          employeeId: service.employee.id,
          isRequested: true,
        });
      }
    });

    const serviceData = {
      serviceEmployees,
      deletedServiceEmployeeIds: [],
    };
    this.props.startService (appointment.id, serviceData, (response, error) => {
      if (response) {
        this.hideAll ();
        this.props.loadQueueData ();
      } else if (error.response.data.result === 6) {
        // "Can't automatically assign FA employee, please finish service for some provider"
        const {settings} = this.props.settings;

        let preventActivity = _.find (settings, {
          settingName: 'PreventActivity',
        });
        preventActivity = preventActivity
          ? preventActivity.settingValue
          : false;

        let autoAssignFirstAvailableProvider = _.find (settings, {
          settingName: 'AutoAssignFirstAvailableProvider',
        });
        autoAssignFirstAvailableProvider = autoAssignFirstAvailableProvider
          ? autoAssignFirstAvailableProvider.settingValue
          : false;

        if (preventActivity && autoAssignFirstAvailableProvider) {
          this.checkHasProvider (true);
        }
      }
    });
  };

  handleStartService = () => {
    const {appointment} = this.state;
    const settingAllowMultiService = get (
      this.props.groupedSettings,
      '[AllowServiceProviderToPerformServicesOnMultipleClientsSimultaneously][0].settingValue',
      false
    );
    const modalBusyEmployee = settingAllowMultiService
      ? null
      : checkBusyEmploeeInServiceQueue (
          appointment,
          null,
          this.props.serviceQueue
        );
    this.hideAll ();
    if (modalBusyEmployee) {
      this.setState ({modalBusyEmployee});
    } else {
      this.startService ();
    }
  };

  handleToWaiting = () => {
    const {appointment} = this.state;
    this.hideAll ();
    this.props.toWaiting (appointment.id, this.props.loadQueueData);
  };

  handlePressCheckOut = (id = false) => {
    const {appointment} = this.state;
    this.hideDialog ();
    this.props.checkOut (id || appointment.id, this.props.loadQueueData);
  };

  handlePressFinish = finish => {
    const {appointment} = this.state;

    if (!finish) {
      this.hideAll ();
      this.props.undoFinishService (appointment.id, this.props.loadQueueData);
    } else {
      this.hideAll ();
      this.props.finishService ([appointment.id], this.props.loadQueueData);
    }
  };

  hideDialog = () => {
    this.setState ({isVisible: false});
  };

  searchText = (
    query: string,
    searchClient: boolean,
    searchProvider: boolean
  ) => {
    const {data} = this.props;
    const prevCount = this.state.data.length;
    if (query === '' || (!searchClient && !searchProvider)) {
      this.setState (
        {data},
        prevCount != data.length ? this.onChangeFilterResultCount : undefined
      );
    }
    const text = query.toLowerCase ();
    // search by the client full name
    const filteredData = data.filter (({client, services}) => {
      //  if (searchClient) {
      let fullName = `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`;
      fullName = fullName.replace (/ +(?= )/g, '');
      // if this row is a match, we don't need to check providers
      if (fullName.toLowerCase ().match (text)) {
        return true;
      }

      for (let i = 0; i < services.length; i++) {
        const service = services[i];

        const employee = service.isFirstAvailable
          ? {
              id: 0,
              isFirstAvailable: true,
              fullName: 'First Available',
            }
          : service.employee;

        const fullNameProvider = `${employee.fullName || ''}`;

        // if this provider is a match, we don't need to check other providers
        if (fullNameProvider.toLowerCase ().match (text)) {
          return true;
        }
        if (service.serviceName.toLowerCase ().match (text)) {
          return true;
        }
      }

      return false;
    });
    // if no match, set empty array
    if (!filteredData || !filteredData.length) {
      this.setState (
        {data: []},
        prevCount != 0 ? this.onChangeFilterResultCount : undefined
      );
    } else if (filteredData.length === data.length) {
      // if the matched numbers are equal to the original data, keep it the same
      this.setState (
        {data: this.props.data},
        prevCount != this.props.data.length
          ? this.onChangeFilterResultCount
          : undefined
      );
    } else {
      // else, set the filtered data
      this.setState (
        {data: filteredData},
        prevCount != filteredData.length
          ? this.onChangeFilterResultCount
          : undefined
      );
    }
  };

  sortItems = (option, items) => {
    let sortedItems = [];

    if (option.value === 'FIRST_ARRIVED' || option.value === 'LAST_ARRIVED') {
      sortedItems = _.sortBy (items, item => item.enteredTime);

      if (option.value === 'LAST_ARRIVED') {
        sortedItems = _.reverse (sortedItems);
      }
    } else if (option.value === 'A_Z' || option.value === 'Z_A') {
      sortedItems = _.sortBy (items, item => item.client.fullName);

      if (option.value === 'Z_A') {
        sortedItems = _.reverse (sortedItems);
      }
    }

    return sortedItems;
  };

  renderItem = row => {
    const item: QueueItem = row.item;
    const index = row.index;

    const label = this.getLabelForItem (item);
    const groupLeaderName = this.getGroupLeaderName (item);
    const firstService = item.services[0] || {};
    const serviceName = (firstService.serviceName || '').toUpperCase ();
    const employee = !firstService.isFirstAvailable &&
      firstService.employee &&
      firstService.employee.fullName
      ? firstService.employee.fullName.toUpperCase ()
      : 'First Available';

    const isBookedByWeb = item.queueType === 3;

    const color = item.groupId ? this.props.groups[item.groupId].color : null;

    return (
      <SalonTouchableOpacity
        style={styles.itemContainer}
        onPress={() => this.handlePress (item)}
        key={item.id}
      >
        <View style={styles.itemSummary}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginRight: 20,
            }}
          >
            <Text
              style={styles.clientName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.client.name} {item.client.lastName}{' '}
            </Text>
            <ServiceIcons
              wrapperStyle={styles.wrapperStyle}
              badgeData={item.badgeData}
              color={color}
              item={item}
              groupLeaderName={groupLeaderName}
            />
          </View>

          <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <Text
              style={styles.serviceName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {serviceName}
              <Text style={{color: '#727A8F'}}> with</Text> {employee}
              {item.services.length > 1
                ? <Text style={{color: '#115ECD', fontFamily: 'Roboto-Medium'}}>
                    {' '}+{item.services.length - 1}
                  </Text>
                : null}
            </Text>
          </View>
          <QueueTimeNote item={item} type="short" />
        </View>
        <View style={styles.itemIcons}>
          {label}
        </View>

        <Icon name="chevronRight" style={styles.chevron} type="solid" />

      </SalonTouchableOpacity>
    );
  };
  showNotification = (item, type) => {
    this.setState ({
      notificationVisible: true,
      notificationType: type,
      notificationItem: item,
    });
  };
  onDismissNotification = () => {
    this.setState ({notificationVisible: false});
  };
  renderNotification = () => {
    const {
      notificationType,
      notificationItem,
      notificationVisible,
    } = this.state;
    let notificationColor, notificationButton, notificationText;
    switch (notificationType) {
      case 'service': {
        const client = notificationItem.client || {};
        notificationText = (
          <Text>
            Started service for
            {' '}
            <Text
              style={{fontFamily: 'OpenSans-Bold'}}
            >{`${client.name} ${client.lastName}`}</Text>
          </Text>
        );
        notificationColor = '#ccc';
        notificationButton = (
          <NotificationBannerButton
            title="OK"
            onPress={this.onDismissNotification}
          />
        );
        break;
      }
      case 'error': {
        const text = get (notificationItem, 'response.data.userMessage', '');
        if (!text) {
          return null;
        }
        notificationText = text || <Text>{text}</Text>;
        notificationColor = '#F50035';
        break;
      }
      default:
        return null;
    }

    return (
      <NotificationBanner
        backgroundColor={notificationColor}
        visible={notificationVisible}
        button={notificationButton}
        onDismiss={this.onDismissNotification}
      >
        <Text>{notificationText}</Text>
      </NotificationBanner>
    );
  };
  _keyExtractor = (item, index) => item.id;

  showEmailModal = () => {
    this.setState ({isEmailVisible: true});
  };

  hideEmailModal = () => {
    this.setState ({isEmailVisible: false, email: ''});
    this.checkShouldMerge ();
  };

  handleOk = email => {
    const isValidEmail = regexs.email.test (email);
    if (isValidEmail) {
      if (this.state.client.email === email) {
        this.checkShouldMerge ();
      } else {
        const client = {...this.state.client, email};
        Client.putClientEmail (client.id, email)
          .then (() => this.setState ({client}, this.hideEmailModal ()))
          .catch (ex => alert (ex));
      }
    } else {
      alert ('Please enter a valid Email');
    }
  };

  closeBusyModal = () => {
    this.setState ({modalBusyEmployee: null}, () =>
      this.props.setLoading (false)
    );
  };

  handleBusyModalOk = () => {
    const {itemsId} = this.state.modalBusyEmployee;
    this.setState ({modalBusyEmployee: null});
    this.props.finishService (itemsId, null).then (() => {
      this.startService ();
    });
  };

  render () {
    const {headerTitle, searchText} = this.props;
    const numResult = this.state.data.length;

    const {appointment} = this.state;
    const {client} = appointment || {email: ''};
    const fullName = client
      ? `${client.name || ''} ${client.middleName || ''} ${client.lastName || ''}`
      : '';

    const header = headerTitle
      ? <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text style={styles.headerCount}>
            {numResult} {numResult === 1 ? 'Result' : 'Results'}
          </Text>
        </View>
      : null;
    const appt = _.find (
      this.props.data,
      item => item.id === this.state.appointmentId
    );
    return (
      <View style={styles.container}>

        <SalonInputModal
          visible={this.state.isEmailVisible}
          title="Client Email"
          description={`Provide the email address for ${fullName} in order to email Upcoming Appointments`}
          onPressCancel={this.hideEmailModal}
          onPressOk={this.handleOk}
          value={this.state.email}
          isTextArea={false}
          placeholder="client@email.com"
        />

        {this.props.loading && <LoadingOverlay />}
        <FlatList
          style={{marginTop: 5}}
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={header}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />

        <QueueItemSummary
          {...this.props}
          isVisible={this.state.isVisible && !this.props.loading}
          client={appt && appt.client}
          services={appt && appt.services}
          onDonePress={this.hideDialog}
          showDialog={this.showDialog}
          onPressSummary={this.handlePressSummary}
          isWaiting={this.props.isWaiting}
          item={this.state.appointment}
          appointment={appt}
          hide={this.hideDialog}
        />
        {this.renderNotification ()}
        {this.state.modalBusyEmployee &&
          <SalonAlert
            visible={this.state.modalBusyEmployee}
            title={get (this.state.modalBusyEmployee, 'title', '')}
            description={get (this.state.modalBusyEmployee, 'text', '')}
            btnRightText={get (
              this.state.modalBusyEmployee,
              'buttonOkText',
              ''
            )}
            btnLeftText="Don't finish"
            onPressLeft={this.closeBusyModal}
            onPressRight={this.handleBusyModalOk}
          />}
      </View>
    );
  }
}

Queue.defaultProps = {};

Queue.propTypes = {
  clientsActions: PropTypes.shape ({
    getMergeableClients: PropTypes.func.isRequired,
  }).isRequired,
  clientsState: PropTypes.shape ({
    mergeableClients: PropTypes.any.isRequired,
  }).isRequired,
  serviceActions: PropTypes.shape ({
    setSelectedService: PropTypes.func.isRequired,
  }).isRequired,
  settingsActions: PropTypes.shape ({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
  loadQueueData: PropTypes.func.isRequired,
  checkInClient: PropTypes.func.isRequired,
  uncheckInClient: PropTypes.func.isRequired,
  noShow: PropTypes.func.isRequired,
  returned: PropTypes.func.isRequired,
  returnLater: PropTypes.func.isRequired,
  startService: PropTypes.func.isRequired,
  toWaiting: PropTypes.func.isRequired,
  undoFinishService: PropTypes.func.isRequired,
  finishService: PropTypes.func.isRequired,
  walkOut: PropTypes.func.isRequired,
  checkOut: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  settings: PropTypes.any.isRequired,
  searchClient: PropTypes.any.isRequired,
  searchProvider: PropTypes.any.isRequired,
  filterText: PropTypes.any.isRequired,
  isWaiting: PropTypes.any.isRequired,
  onChangeFilterResultCount: PropTypes.any.isRequired,
};

const mapStateToProps = state => ({
  settings: state.settingsReducer,
  groupedSettings: groupedSettingsSelector (state),
});

export default connect (mapStateToProps, actions) (Queue);
