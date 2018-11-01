// @flow
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get, isFunction } from 'lodash';

import SelectableServiceList from '../../components/SelectableServiceList';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import ServiceList from './components/serviceList';
import CategoryServicesList from './components/categoryServicesList';
import ServiceCategoryList from './components/serviceCategoryList';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import styles from './styles';
import headerStyles from '../../constants/headerStyles';
import Colors from '../../constants/Colors';

class ServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params &&
      navigation.state.params.defaultProps ? navigation.state.params.defaultProps : {
        title: 'Services',
        subTitle: null,
        leftButtonOnPress: () => { navigation.goBack(); },
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      };
    const ignoreNav = navigation.state.params ? navigation.state.params.ignoreNav : false;
    const { leftButton } = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav ? navigation.state.params.headerProps : { leftButton: defaultProps.leftButton };
    const { rightButton } = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav ? navigation.state.params.headerProps : { rightButton: defaultProps.rightButton };
    const { leftButtonOnPress } = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav ? navigation.state.params.headerProps : {
        leftButtonOnPress: defaultProps.leftButtonOnPress,
      };
    const { rightButtonOnPress } = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav ? navigation.state.params.headerProps : {
        rightButtonOnPress: defaultProps.rightButtonOnPress,
      };
    const { title } = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav ? navigation.state.params.headerProps : { title: defaultProps.title };
    const { subTitle } = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav ? navigation.state.params.headerProps : { subTitle: defaultProps.subTitle };

    return {
      header: () => (
        <SafeAreaView style={{ backgroundColor: Colors.defaultBlue }}>
          <SalonSearchHeader
            title={title}
            subTitle={subTitle}
            leftButton={leftButton}
            leftButtonOnPress={() => { leftButtonOnPress(navigation); }}
            rightButton={rightButton}
            rightButtonOnPress={() => { rightButtonOnPress(navigation); }}
            hasFilter={false}
          // containerStyle={{
          //   paddingHorizontal: 20,
          // }}
          />
        </SafeAreaView>
      ),
    };
  };


  static flexFilter(list, info) {
    let matchesFilter = [];
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;
      for (let n = 0; n < info.length; n += 1) {
        if (item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count += 1;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i += 1) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }

  constructor(props) {
    super(props);
    this.clearSearch();
    const params = props.navigation.state.params || {};

    const selectedService = get(params, 'selectedService', null);
    props.servicesActions.setSelectedService(selectedService);
    this.state = {
      prevHeaderProps: {
      },
      headerProps: {
        title: 'Services',
        subTitle: null,
        leftButtonOnPress: () => { this.goBack(); },
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      },
      defaultHeaderProps: {
        title: 'Services',
        subTitle: null,
        leftButtonOnPress: () => { this.goBack(); },
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      },
      previousIgnoringNumber: props.salonSearchHeaderState.ignoredNumberOfLetters,
    };
    this.props.navigation.setParams({
      selectedService,
      ignoreNav: false,
      defaultProps: this.state.defaultHeaderProps,
    });
    this.props.salonSearchHeaderActions.setFilterAction(searchText => this.filterList(searchText));
    this.props.salonSearchHeaderActions
      .setIgnoredNumberOfLetters(0);
  }

  componentDidMount() {
    this.getServices();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.salonSearchHeaderState.showFilter &&
      !this.props.salonSearchHeaderState.showFilter) {
      this.props.servicesActions
        .setFilteredServices(this.props.servicesState.services);
    }
  }

  componentWillUnmount() {
    this.props.salonSearchHeaderActions
      .setIgnoredNumberOfLetters(this.state.previousIgnoringNumber);
  }

  setHeaderData(props, ignoreNav = false) {
    this.setState({ prevHeaderProps: this.state.headerProps });
    this.props.navigation.setParams({ defaultProps: props, ignoreNav });

    this.props.salonSearchHeaderActions.setFilterAction(searchText => this.filterList(searchText));
    this.setState({ headerProps: props });
  }

  get services() {
    const {
      servicesState: {
        services,
      },
      salonSearchHeaderState: {
        searchText,
      },
      quickQueueServices,
    } = this.props;


    if (this.mode === 'quickQueue') {
      let filtered = quickQueueServices;


      filtered = filtered.length > 0 ? filtered.filter(item => item.canBePerformed === true) : filtered;

      if (searchText && searchText.length > 0) {
        const criteria = [
          { Field: 'name', Values: [searchText.toLowerCase()] },
        ];

        filtered = ServicesScreen.flexFilter(filtered, criteria);
      }


      return filtered;
    }


    return this.props.servicesState.filtered.map(cat => ({
      ...cat,
      services: cat.services.filter(itm => !itm.isAddon && itm.canBePerformed),
    }));
  }

  getServices = () => {
    this.props.servicesActions.setShowCategoryServices(false);
    const params = this.props.navigation.state.params || {};
    const clientId = params.clientId || false;
    const employeeId = params.employeeId || false;
    const queueItem = params.queueItem || {};
    const service = params.service || {};


    // this.props.servicesActions.getServices(opts);

    const {
      servicesActions: {
        getServices,
        getQueueServiceEmployeeServices,
      },
    } = this.props;


    const opts = {};
    if (clientId) {
      opts.clientId = clientId;
    }
    if (employeeId) {
      opts.employeeId = employeeId;
    }


    switch (this.mode) {
      case 'quickQueue':
        getServices(opts);
        getQueueServiceEmployeeServices({ ...opts, id: queueItem.id, serviceEmployeeId: service.id });
        break;
      case 'services':
      default:
        getServices(opts);
        break;
    }
  }

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
    const onChangeProvider = get(params, 'onChangeProvider', null);
    const dismissOnSelect = get(params, 'dismissOnSelect', null);
    const queueList = get(params, 'queueList', false);
    const mode = get(params, 'mode', false);
    const hasCategories = get(params, 'hasCategories', true);

    return {
      mode,
      queueList,
      filterList,
      dismissOnSelect,
      selectedService,
      onChangeProvider,
      selectedProvider,
      showEstimatedTime,
      showFirstAvailable,
      checkProviderStatus,
      hasCategories,
    };
  }

  getServicesById = (ids) => {
    const { flatServices } = this.props;
    const results = [];
    const check = (service, index) => service.id === ids[index].id;
    for (let i = 0; i < ids.length; i += 1) {
      const service = flatServices.find(ser => check(ser, i));
      if (service) { results.push(service); }
    }
    return results;
  }

  handleOnChangeService = (service) => {
    const {
      navigation,
      servicesActions: { setSelectedService },
    } = this.props;
    const params = navigation.state.params || {};
    const onChangeService = get(params, 'onChangeService', false);
    const dismissOnSelect = get(params, 'dismissOnSelect', false);

    setSelectedService(service);
    if (isFunction(onChangeService)) {
      onChangeService(service);
      if (dismissOnSelect) {
        navigation.goBack();
      }
    }
  }

  goBack = () => {
    if (this.props.servicesState.showCategoryServices) {
      this.props.servicesActions.setFilteredServices(this.props.servicesState.services);
      this.props.servicesActions.setShowCategoryServices(false);
      this.setHeaderData(this.state.prevHeaderProps);
    } else {
      this.props.navigation.goBack();
    }
  }

  clearSearch = () => {
    this.props.salonSearchHeaderActions.setShowFilter(false);
    this.props.servicesActions.setShowCategoryServices(false);
  }

  filterServices = (searchText) => {
    const servicesCategories = JSON.parse(JSON.stringify(this.props.servicesState.services));


    if (searchText && searchText.length > 0) {
      this.setHeaderData(this.state.headerProps);

      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
      ];

      const filtered = [];


      for (let i = 0; i < servicesCategories.length; i += 1) {
        const servicesCategory = servicesCategories[i];
        servicesCategory.services = ServicesScreen.flexFilter(servicesCategory.services, criteria);
        if (servicesCategory.services.length > 0) {
          filtered.push(servicesCategory);
        }
      }

      this.props.servicesActions.setFilteredServices(filtered);
    } else {
      this.setHeaderData(this.state.defaultHeaderProps);
      this.props.servicesActions.setFilteredServices(servicesCategories);
    }

    this.props.navigation.setParams({
      searchText: this.props.salonSearchHeaderState.searchText,
    });
  }

  filterList = (searchText) => {
    this.props.servicesActions.setShowCategoryServices(false);
    this.filterServices(searchText);
  }

  handlePressServiceCategory = (item) => {
    const { navigation } = this.props;

    const walkInRoute = navigation.state.routeName === 'ModalServices';
    this.setHeaderData({
      title: walkInRoute ? 'Walk-in' : item.name,
      subTitle: walkInRoute ? 'step 2 of 3' : null,
      leftButton: (
        <SalonTouchableOpacity style={styles.leftButton} onPress={this.goBack}>
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
      rightButton: walkInRoute ? navigation.state.params.headerProps.rightButton : null,
      rightButtonOnPress: walkInRoute ? navigation.state.params.headerProps.rightButtonOnPress : null,
    }, true);

    this.props.servicesActions.setShowCategoryServices(true);
    this.props.servicesActions.setCategoryServices(item.services);
  }

  render() {
    const { servicesState } = this.props;
    const { hasCategories } = this;


    return servicesState.isLoading ? (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <ActivityIndicator />
      </View>
    ) : (
      <View style={styles.container}>
        <View style={styles.servicesList}>

          {(!hasCategories
              && this.services.length > 0) &&
              <SelectableServiceList
                services={this.services}
                selected={[this.props.servicesState.selectedService ? this.props.servicesState.selectedService.serviceId : null]}
                hidePrice
                returnFullObject
                onChangeSelected={this.handleOnChangeService}
              />
            }


          {hasCategories && (!servicesState.showCategoryServices
              && !this.props.salonSearchHeaderState.showFilter
              && this.services.length > 0) &&
              <ServiceCategoryList
                onRefresh={this.getServices}
                handlePressServiceCategory={this.handlePressServiceCategory}
                serviceCategories={this.services}
                serviceCategoriesLength={this.services.length}
              />
            }

          {hasCategories && (!servicesState.showCategoryServices
              && this.props.salonSearchHeaderState.showFilter
              && this.services.length > 0) &&
              <ServiceList
                {...this.props}
                onRefresh={this.getServices}
                boldWords={this.props.salonSearchHeaderState.searchText}
                style={styles.serviceListContainer}
                services={this.services}
                onChangeService={this.handleOnChangeService}
              />
            }

          {hasCategories && (servicesState.showCategoryServices
              && this.services.length > 0) &&
              <CategoryServicesList
                {...this.props}
                onRefresh={this.getServices}
                onChangeService={this.handleOnChangeService}
                categoryServices={servicesState.categoryServices}
              />
            }
        </View>
      </View>
    );
  }
}

ServicesScreen.propTypes = {
  salonSearchHeaderState: PropTypes.shape({
    showFilter: PropTypes.bool.isRequired,
    searchText: PropTypes.string,
    ignoredNumberOfLetters: PropTypes.number.isRequired,
  }).isRequired,
  flatServices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
  salonSearchHeaderActions: PropTypes.shape({
    setShowFilter: PropTypes.bool.isRequired,
    setFilterAction: PropTypes.bool.isRequired,
    setIgnoredNumberOfLetters: PropTypes.bool.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onChangeService: PropTypes.func,
        dismissOnSelect: PropTypes.bool,
      }),
    }),
  }),
  servicesActions: PropTypes.shape({
    setSelectedService: PropTypes.func.isRequired,
    setFilteredServices: PropTypes.func.isRequired,
    setCategoryServices: PropTypes.func.isRequired,
    setShowCategoryServices: PropTypes.func.isRequired,
    getServices: PropTypes.func.isRequired,
    getQueueServiceEmployeeServices: PropTypes.func.isRequired,
  }).isRequired,
  servicesState: PropTypes.shape({
    showCategoryServices: PropTypes.bool.isRequired,
    services: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
};

ServicesScreen.defaultProps = {
  navigation: null,
};

export default ServicesScreen;
