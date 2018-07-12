// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonSearchHeader from '../../components/SalonSearchHeader';
import ServiceList from './components/serviceList';
import CategoryServicesList from './components/categoryServicesList';
import ServiceCategoryList from './components/serviceCategoryList';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  serviceListContainer: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  servicesList: {
    flex: 9,
    backgroundColor: 'white',
  },
  backIcon: {
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  leftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


class ServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params && navigation.state.params.defaultProps ? navigation.state.params.defaultProps : {
      title: 'Services',
      subTitle: null,
      leftButtonOnPress: () => { navigation.goBack(); },
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
    };

    const ignoreNav = navigation.state.params ? navigation.state.params.ignoreNav : false;
    const { leftButton } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { leftButton: defaultProps.leftButton };
    const { rightButton } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { rightButton: defaultProps.rightButton };
    const { leftButtonOnPress } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { leftButtonOnPress: defaultProps.leftButtonOnPress };
    const { rightButtonOnPress } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { rightButtonOnPress: defaultProps.rightButtonOnPress };
    const { title } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { title: defaultProps.title };
    const { subTitle } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { subTitle: defaultProps.subTitle };

    return {
      header: props => (<SalonSearchHeader
        title={title}
        subTitle={subTitle}
        leftButton={leftButton}
        leftButtonOnPress={() => { leftButtonOnPress(navigation); }}
        rightButton={rightButton}
        rightButtonOnPress={() => { rightButtonOnPress(navigation); }}
        hasFilter={false}
        containerStyle={{
          paddingHorizontal: 20,
        }}
      />),
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
    const params = this.props.navigation.state.params || {};
    const action = params.action || 'services';
    const selectedService = params.selectedService || null;
    const selectedAddons = params.selectedAddons || [];
    const selectedRecommendeds = params.selectedRecommendeds || [];
    const selectedRequired = params.selectedRequired || null;

    switch (action) {
      case 'addons':
        this.selectAddonServices();
        break;
      case 'recommended':
        this.selectRecommendedServices();
        break;
      case 'required':
        this.selectRequiredService();
        break;
      default:
        break;
    }

    this.getServices();
    this.props.servicesActions.setSelectedService(selectedService);

    this.state = {
      hasViewedAddons: false,
      hasViewedRecommended: false,
      hasViewedRequired: false,
      selectedAddons,
      selectedRecommendeds,
      selectedRequired,
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
    };
    this.props.navigation.setParams({
      selectedService,
      ignoreNav: false,
      defaultProps: this.state.defaultHeaderProps,
    });
  }

  getServices = () => {
    this.props.servicesActions.setShowCategoryServices(false);
    const params = this.props.navigation.state.params || {};
    const clientId = params.clientId || false;
    const employeeId = params.employeeId || false;
    const filterByProvider = params.filterByProvider || false;

    const opts = {
      query: {},
    };
    if (clientId) {
      opts.query.clientId = clientId;
    }
    if (employeeId) {
      opts.query.employeeId = employeeId;
    }

    this.props.servicesActions.getServices(opts, filterByProvider);
  }

  setHeaderData(props, ignoreNav = false) {
    this.setState({ prevHeaderProps: this.state.headerProps });
    this.props.navigation.setParams({ defaultProps: props, ignoreNav });

    this.props.salonSearchHeaderActions.setFilterAction(searchText => this.filterList(searchText));
    this.setState({ headerProps: props });
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

  handleOnChangeService = (service) => {
    // const params = this.props.navigation.state.params || {};
    // const {
    //   onChangeService = false,
    //   dismissOnSelect = false,
    //   selectExtraServices = false,
    // } = params;

    // if (selectExtraServices && !this.shouldSelectExtras()) {
    //   if (onChangeService) {
    //     onChangeService(service);
    //   }
    //   if (dismissOnSelect) {
    //     this.props.navigation.goBack();
    //   }
    // }
    this.props.servicesActions.setSelectedService(service);
    this.setState({
      isLoading: true,
      selectedService: service,
    }, () => {
      this.selectRequiredService()
        .selectRecommendedServices()
        .selectAddonServices()
        .shouldPerformOnChange();
    });
  }

  shouldPerformOnChange = () => {
    const params = this.props.navigation.state.params || {};
    const {
      onChangeService = false,
      dismissOnSelect = false,
      selectExtraServices = false,
    } = params;
    const {
      hasViewedAddons,
      hasViewedRecommended,
      hasViewedRequired,
      selectedAddons,
      selectedRequired,
      selectedRecommendeds,
    } = this.state;
    const { selectedService } = this.props.servicesState;

    if (onChangeService && !this.shouldSelectExtras()) {
      onChangeService(selectExtraServices ? {
        service: selectedService,
        addons: selectedAddons,
        recommended: selectedRecommendeds,
        required: selectedRequired,
      } : selectedService);

      if (dismissOnSelect) {
        this.props.navigation.goBack();
      }
    }

    return this;
  }

  shouldSelectExtras = () => {
    const { selectedService } = this.props.servicesState;
    const {
      addons = [],
      requiredServices = [],
      recommendedServices = [],
    } = selectedService || {};
    const {
      hasViewedAddons,
      hasViewedRequired,
      hasViewedRecommended,
    } = this.state;

    if (!hasViewedAddons && addons.length > 0) {
      return true;// this.selectAddonServices().shouldSelectExtras();
    }
    if (!hasViewedRecommended && recommendedServices.length > 0) {
      return true;// this.selectRecommendedServices().shouldSelectExtras();
    }
    if (!hasViewedRequired && requiredServices.length > 0) {
      return true;// this.selectRequiredService().shouldSelectExtras();
    }

    return false;
  }

  selectRequiredService = () => {
    const { selectedService } = this.props.servicesState;
    if (selectedService && selectedService.requiredServices.length > 0) {
      this.props.navigation.navigate('RequiredServices', {
        serviceTitle: selectedService.name,
        services: selectedService.requiredServices,
        onSave: selectedRequired => this.setState({
          selectedRequired,
          hasViewedRequired: true,
        }, this.shouldPerformOnChange),
      });
    }

    return this;
  }

  selectAddonServices = () => {
    const { selectedService } = this.props.servicesState;
    // debugger//eslint-disable-line
    if (selectedService && selectedService.addons.length > 0) {
      this.props.navigation.navigate('AddonServices', {
        serviceTitle: selectedService.name,
        services: selectedService.addons,
        onSave: selectedAddons => this.setState({
          selectedAddons,
          hasViewedAddons: true,
        }, this.shouldPerformOnChange),
      });
    }
    return this;
  }

  selectRecommendedServices = () => {
    const { selectedService } = this.props.servicesState;
    if (selectedService && selectedService.recommendedServices.length > 0) {
      this.props.navigation.navigate('RecommendedServices', {
        serviceTitle: selectedService.name,
        services: selectedService.recommendedServices,
        onSave: selectedRecommendeds => this.setState({
          selectedRecommendeds,
          hasViewedRecommended: true,
        }, this.shouldPerformOnChange),
      });
    }
    return this;
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
    this.setHeaderData({
      title: item.name,
      subTitle: null,
      leftButton: (
        <SalonTouchableOpacity style={styles.leftButton} onPress={() => { this.goBack(); }}>
          <View style={styles.leftButtonContainer}>
            <Text style={styles.leftButtonText}>
              <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
    }, true);
    this.props.servicesActions.setShowCategoryServices(true);
    this.props.servicesActions.setCategoryServices(item.services);
  }

  render() {
    let onChangeService = null;
    const { state } = this.props.navigation;
    const { servicesState } = this.props;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeService) { onChangeService = this.handleOnChangeService; }

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
          {(!this.props.servicesState.showCategoryServices
            && !this.props.salonSearchHeaderState.showFilter
            && this.props.servicesState.filtered.length > 0) &&
            <ServiceCategoryList
              onRefresh={this.getServices}
              handlePressServiceCategory={this.handlePressServiceCategory}
              serviceCategories={this.props.servicesState.filtered}
            />
          }

          {(!this.props.servicesState.showCategoryServices
            && this.props.salonSearchHeaderState.showFilter
            && this.props.servicesState.filtered.length > 0) &&
            <ServiceList
              {...this.props}
              onRefresh={this.getServices}
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.serviceListContainer}
              services={this.props.servicesState.filtered}
              onChangeService={this.handleOnChangeService}
            />
          }

          {(this.props.servicesState.showCategoryServices
            && this.props.servicesState.filtered.length > 0) &&
            <CategoryServicesList
              {...this.props}
              onRefresh={this.getServices}
              onChangeService={this.handleOnChangeService}
              categoryServices={this.props.servicesState.categoryServices}
            />
          }
        </View>
      </View>
    );
  }
}

ServicesScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onChangeService: PropTypes.func,
        dismissOnSelect: PropTypes.bool,
      }),
    }),
  }),
};

ServicesScreen.defaultProps = {
  navigation: null,
};

export default ServicesScreen;
