import * as React from 'react';
import {
  View,
  Text,
  RefreshControl,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get, filter, isFunction } from 'lodash';
import { NavigationScreenProp } from 'react-navigation';

import SelectableServiceList from '@/components/SelectableServiceList';
import SalonSearchHeader from '@/components/SalonSearchHeader';
import ServiceList from './components/serviceList';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import Colors from '@/constants/Colors';
import { ServicesActions } from '@/redux/actions/service';
import { SalonSearchHeaderActions } from '@/redux/reducers/searchHeader';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Maybe, ServiceCategories, Service, Provider } from '@/models';
import SalonFlatList from '@/components/common/SalonFlatList';
import { ServicesReducer } from '@/redux/reducers/service';
import SalonListItem from '@/components/common/SalonListItem';

import styles from './styles';

export interface ServicesScreenNavigationParams {
  mode: string;
  queueList: boolean;
  hasCategories: boolean;
  dismissOnSelect: boolean;
  showEstimatedTime: boolean;
  showFirstAvailable: boolean;
  checkProviderStatus: boolean;
  filterList: Maybe<any[]>;
  selectedService: Maybe<Service>;
  selectedProvider: Maybe<Provider>;
  onChangeService: (service: Service) => void;
  onChangeWithNavigation: (service: Service, navigation: NavigationScreenProp<any>) => void;
}

export interface ServicesScreenProps {
  navigation: NavigationScreenProp<ServicesScreenNavigationParams>;
  servicesActions: ServicesActions;
  salonSearchHeaderActions: SalonSearchHeaderActions;
  walkInState: any,
  servicesState: ServicesReducer,
  salonSearchHeaderState: any,
  flatServices: any,
  quickQueueServices: any,
}

export interface ServicesScreenState {
  previousIgnoringNumber: number;
  defaultHeaderProps: any;
  prevHeaderProps: any;
  headerProps: any;
  isRefreshing: boolean;
}

class ServicesScreen extends React.Component<ServicesScreenProps, ServicesScreenState> {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params &&
    navigation.state.params.defaultProps
      ? navigation.state.params.defaultProps
      : {
        title: 'Services',
        subTitle: null,
        leftButtonOnPress: () => {
          navigation.goBack();
        },
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      };
    const ignoreNav = navigation.state.params
      ? navigation.state.params.ignoreNav
      : false;
    const { leftButton } = navigation.state.params &&
    navigation.state.params.headerProps &&
    !ignoreNav
      ? navigation.state.params.headerProps
      : { leftButton: defaultProps.leftButton };
    const { rightButton } = navigation.state.params &&
    navigation.state.params.headerProps &&
    !ignoreNav
      ? navigation.state.params.headerProps
      : { rightButton: defaultProps.rightButton };
    const { leftButtonOnPress } = navigation.state.params &&
    navigation.state.params.headerProps &&
    !ignoreNav
      ? navigation.state.params.headerProps
      : {
        leftButtonOnPress: defaultProps.leftButtonOnPress,
      };
    const { rightButtonOnPress } = navigation.state.params &&
    navigation.state.params.headerProps &&
    !ignoreNav
      ? navigation.state.params.headerProps
      : {
        rightButtonOnPress: defaultProps.rightButtonOnPress,
      };
    const { title } = navigation.state.params &&
    navigation.state.params.headerProps &&
    !ignoreNav
      ? navigation.state.params.headerProps
      : { title: defaultProps.title };
    const { subTitle } = navigation.state.params &&
    navigation.state.params.headerProps &&
    !ignoreNav
      ? navigation.state.params.headerProps
      : { subTitle: defaultProps.subTitle };

    return {
      header: () => (
        <SalonSearchHeader
          title={title}
          subTitle={subTitle}
          leftButton={leftButton}
          leftButtonOnPress={() => {
            leftButtonOnPress(navigation);
          }}
          rightButton={rightButton}
          rightButtonOnPress={() => {
            rightButtonOnPress(navigation);
          }}
          hasFilter={false}
        />
      ),
    };
  };

  static flexFilter(list, value) {
    return list.filter(item => item.name.toLowerCase().indexOf(value) !== -1);
  }

  constructor(props) {
    super(props);
    this.clearSearch();
    const params = props.navigation.state.params || {};

    const selectedService = get(params, 'selectedService', null);
    props.servicesActions.setSelectedService(selectedService);
    this.state = {
      prevHeaderProps: {},
      headerProps: {
        title: 'Services',
        subTitle: null,
        leftButtonOnPress: () => {
          this.goBack();
        },
        leftButton: <Text style={styles.leftButtonText}> Cancel </Text>,
      },
      defaultHeaderProps: {
        title: 'Services',
        subTitle: null,
        leftButtonOnPress: () => {
          this.goBack();
        },
        leftButton: <Text style={styles.leftButtonText}> Cancel </Text>,
      },
      previousIgnoringNumber: props.salonSearchHeaderState
        .ignoredNumberOfLetters,
      isRefreshing: false,
    };
    this.props.navigation.setParams({
      selectedService,
      ignoreNav: false,
      defaultProps: this.state.defaultHeaderProps,
    });
    this.props.salonSearchHeaderActions.setFilterAction(searchText =>
      this.filterList(searchText),
    );
    this.props.salonSearchHeaderActions.setIgnoredNumberOfLetters(0);
  }

  componentDidMount() {
    this.getServices();
  }

  componentWillReceiveProps(nextProps: ServicesScreenProps) {
    if (
      !nextProps.servicesState.isLoading && this.props.servicesState.isLoading
    ) {
      this.setState({ isRefreshing: false });
    } else if (
      nextProps.servicesState.isLoading && !this.props.servicesState.isLoading
    ) {
      this.setState({ isRefreshing: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.salonSearchHeaderState.showFilter &&
      !this.props.salonSearchHeaderState.showFilter
    ) {
      this.props.servicesActions.setFilteredServices(
        this.props.servicesState.services,
      );
    }
  }

  componentWillUnmount() {
    this.props.salonSearchHeaderActions.setIgnoredNumberOfLetters(
      this.state.previousIgnoringNumber,
    );
  }

  setHeaderData(props, ignoreNav = false) {
    this.setState({ prevHeaderProps: this.state.headerProps });
    this.props.navigation.setParams({ defaultProps: props, ignoreNav });

    this.props.salonSearchHeaderActions.setFilterAction(searchText =>
      this.filterList(searchText),
    );
    this.setState({ headerProps: props });
  }

  get services() {
    const {
      servicesState: { services },
      salonSearchHeaderState: { searchText },
      quickQueueServices,
    } = this.props;

    if (this.mode === 'quickQueue') {
      let filtered = quickQueueServices;

      filtered = filtered.length > 0
        ? filtered.filter(item => item.canBePerformed === true)
        : filtered;

      if (searchText && searchText.length > 0) {

        filtered = ServicesScreen.flexFilter(filtered, searchText.toLowerCase());
      }

      return filtered;
    }

    return this.props.servicesState.filtered.map(cat => ({
      ...cat,
      services: cat.services
        ? cat.services.filter(itm => !itm.isAddon && itm.canBePerformed)
        : [],
    }));
  }

  getServices = () => {
    this.props.servicesActions.setShowCategoryServices(false);
    const params = this.props.navigation.state.params || {};
    const clientId = params.clientId || false;
    const employee = params.selectedEmployee || {};
    const queueItem = params.queueItem || {};
    const service = params.service || {};
    const {
      servicesActions: { getServices, getQueueServiceEmployeeServices },
    } = this.props;
    const opts: any = {};
    if (clientId) {
      opts.clientId = clientId;
    }
    if (employee.id) {
      opts.employeeId = employee.id;
    }

    switch (this.mode) {
      case 'quickQueue':
        getServices(opts);
        getQueueServiceEmployeeServices({
          ...opts,
          id: queueItem.id,
          serviceEmployeeId: service.id,
        });
        break;
      case 'services':
      default:
        getServices(opts);
        break;
    }
  };

  get mode() {
    if (this.params.queueList) {
      return 'queue';
    }
    return this.params.mode || 'services';
  }

  get hasCategories() {
    return 'hasCategories' in this.params ? this.params.hasCategories : true;
  }

  get params() {
    const { navigation: { state } } = this.props;
    const params = state.params || {};
    const showFirstAvailable = get(params, 'showFirstAvailable', true);
    const checkProviderStatus = get(params, 'checkProviderStatus', false);
    const showEstimatedTime = get(params, 'showEstimatedTime', true);
    const selectedService = get(params, 'selectedService', null);
    const filterList = get(params, 'filterList', false);
    const selectedProvider = get(params, 'selectedProvider', null);
    const onChangeService = get(params, 'onChangeService', null);
    const onChangeWithNavigation = get(params, 'onChangeWithNavigation', null);
    const dismissOnSelect = get(params, 'dismissOnSelect', null);
    const queueList = get(params, 'queueList', false);
    const mode = get(params, 'mode', false);
    const hasCategories = get(params, 'hasCategories', true);
    return {
      mode,
      queueList,
      filterList,
      hasCategories,
      dismissOnSelect,
      selectedService,
      onChangeService,
      selectedProvider,
      showEstimatedTime,
      showFirstAvailable,
      checkProviderStatus,
      onChangeWithNavigation,
    } as ServicesScreenNavigationParams;
  }

  handleOnChangeService = service => {
    const { navigation, servicesActions: { setSelectedService } } = this.props;
    const {
      onChangeService,
      dismissOnSelect,
      onChangeWithNavigation,
    } = this.params;

    setSelectedService(service);
    if (isFunction(onChangeWithNavigation)) {
      onChangeWithNavigation(service, navigation);
    } else if (isFunction(onChangeService)) {
      onChangeService(service);
      if (dismissOnSelect) {
        navigation.goBack();
      }
    }
  };

  goBack = () => {
    if (this.props.servicesState.showCategoryServices) {
      this.props.servicesActions.setFilteredServices(
        this.props.servicesState.services,
      );
      this.props.servicesActions.setShowCategoryServices(false);
      this.setHeaderData(this.state.prevHeaderProps);
    } else {
      this.props.navigation.goBack();
    }
  };

  clearSearch = () => {
    this.props.salonSearchHeaderActions.setShowFilter(false);
    this.props.servicesActions.setShowCategoryServices(false);
  };

  filterServices = searchText => {
    const servicesCategories = this.props.servicesState.services;

    if (searchText && searchText.length > 0) {

      const filtered = [];

      servicesCategories.forEach(item => {
        const filteredService = ServicesScreen.flexFilter(item.services, searchText.toLowerCase());
        if (filteredService.length) {
          const newItem = { ...item };
          newItem.services = filteredService;
          filtered.push(newItem);
        }
      });

      this.props.servicesActions.setFilteredServices(filtered);
    } else {
      this.setHeaderData(this.state.defaultHeaderProps);
      this.props.servicesActions.setFilteredServices(servicesCategories);
    }

    this.props.navigation.setParams({
      searchText: this.props.salonSearchHeaderState.searchText,
    });
  };

  filterList = searchText => {
    if (this.props.servicesState.showCategoryServices) {
      this.props.servicesActions.setShowCategoryServices(false);
    }
    this.filterServices(searchText);
  };

  handlePressServiceCategory = item => {
    const { navigation } = this.props;
    const walkInRoute = get(navigation, 'state.routeName', '') === 'ModalServices';
    this.setHeaderData(
      {
        title: walkInRoute ? 'Walk-in' : item.name,
        subTitle: walkInRoute ? 'step 2 of 3' : null,
        leftButton: (
          <SalonTouchableOpacity
            style={styles.leftButton}
            onPress={this.goBack}
          >
            <View style={styles.leftButtonContainer}>
              <FontAwesome style={styles.backIcon}>
                {Icons.angleLeft}
              </FontAwesome>
              <Text style={styles.leftButtonText}>
                {walkInRoute && item.name}
              </Text>
            </View>
          </SalonTouchableOpacity>
        ),
        leftButtonOnPress: this.goBack,
        rightButton: walkInRoute
          ? navigation.state.params.headerProps.rightButton
          : null,
        rightButtonOnPress: walkInRoute
          ? navigation.state.params.headerProps.rightButtonOnPress
          : null,
      },
      true,
    );
    this.props.servicesActions.setShowCategoryServices(true);
    this.props.servicesActions.setCategoryServices(item.services);
  };

  renderCategoryItem = ({ item }) => {
    const {
      servicesState: { selectedService },
    } = this.props;
    const selectedCategory = selectedService
      ? filter(this.services, {
        services: [{ id: selectedService.id }],
      })[0]
      : {};
    const isSelected = (selectedCategory && selectedCategory.id) === item.id;
    const textStyle = isSelected ? { color: Colors.selectedGreen } : {};
    const icons = isSelected ? [
      {
        name: 'checkCircle',
        type: 'solid',
        color: Colors.selectedGreen,
      }, {
        name: 'angleRight',
        type: 'light',
        color: Colors.defaultGrey,
        size: 20,
      },
    ] : [{
      name: 'angleRight',
      type: 'light',
      color: Colors.defaultGrey,
      size: 20,
    }];
    const onPress = () => this.handlePressServiceCategory(item);
    return (
      <SalonListItem
        text={item.name}
        icons={icons}
        textStyle={textStyle}
        onPress={onPress}
      />
    );
  };

  renderServiceItem = ({ item }) => {
    const {
      servicesState: { selectedService },
    } = this.props;
    const isSelected = selectedService && selectedService.id === item.id;
    const textStyle = isSelected ? { color: Colors.selectedGreen } : {};
    const icons = isSelected ? [
      {
        name: 'checkCircle',
        type: 'solid',
        color: Colors.selectedGreen,
      },
    ] : [];
    const onPress = () => this.handleOnChangeService(item);
    return (
      <SalonListItem
        text={item.name}
        icons={icons}
        textStyle={textStyle}
        onPress={onPress}
      />
    );
  };

  render() {
    const { servicesState } = this.props;
    const { hasCategories, state: { isRefreshing } } = this;
    return (
      <View style={styles.container}>
        {
          servicesState.isLoading &&
          <LoadingOverlay />
        }
        <View style={styles.servicesList}>
          {
            !hasCategories &&
            this.services.length > 0 &&
            <SelectableServiceList
              services={this.services}
              selected={[
                this.props.servicesState.selectedService
                  ? this.props.servicesState.selectedService.id
                  : null,
              ]}
              hidePrice
              returnFullObject
              onChangeSelected={this.handleOnChangeService}
            />
          }

          {
            hasCategories && (
              !servicesState.showCategoryServices &&
              !this.props.salonSearchHeaderState.showFilter &&
              this.services.length > 0
            ) &&
            <SalonFlatList
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.getServices}
                />
              }
              data={this.services}
              extraData={this.props}
              renderItem={this.renderCategoryItem}
            />
          }
          {
            hasCategories && (
              !servicesState.showCategoryServices &&
              this.props.salonSearchHeaderState.showFilter &&
              this.services.length > 0
            ) &&
            <ServiceList
              {...this.props}
              onRefresh={this.getServices}
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.serviceListContainer}
              services={this.services}
              onChangeService={this.handleOnChangeService}
            />
          }
          {
            hasCategories && (
              servicesState.showCategoryServices &&
              this.services.length > 0
            ) &&
            <SalonFlatList
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.getServices}
                />
              }
              data={servicesState.categoryServices}
              extraData={this.props}
              renderItem={this.renderServiceItem}
            />
          }
        </View>
      </View>
    );
  }
}

export default ServicesScreen;
