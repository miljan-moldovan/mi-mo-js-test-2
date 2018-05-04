// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
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
    this.getServices();
  }

  getServices = (callback) => {
    this.props.servicesActions.setShowCategoryServices(false);

    const employeeId = this.props.navigation.state.params ? this.props.navigation.state.params.employeeId : null;

    const params = employeeId ? { query: { employeeId } } : {};

    this.props.servicesActions.getServices(params).then((response) => {
      if (response.data.error) {
        this.goBack();
      } else {
        const services = response.data.services;
        this.props.servicesActions.setServices(services);
        this.props.servicesActions.setFilteredServices(services);
        if (callback) {
          callback();
        }
      }
    }).catch((error) => {
    });
  }

  state = {
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
  }

  componentWillMount() {
    const selectedService = this.props.navigation.state.params ? this.props.navigation.state.params.selectedService : null;

    this.props.servicesActions.setSelectedService(selectedService);

    this.props.navigation.setParams({ defaultProps: this.state.defaultHeaderProps, ignoreNav: false, selectedService });
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
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeService, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeService) { onChangeService(service); }

    if (dismissOnSelect) { this.props.navigation.goBack(); }
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

  onPressItem = (item) => {
    this.props.salonSearchHeaderActions.setSearchText(item);
    this.filterServices(item);
    this.props.salonSearchHeaderActions.setShowFilter(false);
  }

  filterList = (searchText) => {
    this.props.servicesActions.setShowCategoryServices(false);
    this.filterServices(searchText);
  }

  handlePressServiceCategory = (item) => {
    this.setHeaderData({
      title: item.name,
      subTitle: null,
      leftButton:
  <SalonTouchableOpacity style={styles.leftButton} onPress={() => { this.goBack(); }}>
    <View style={styles.leftButtonContainer}>
      <Text style={styles.leftButtonText}>
        <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
      </Text>
    </View>
  </SalonTouchableOpacity>,
    }, true);
    this.props.servicesActions.setShowCategoryServices(true);
    this.props.servicesActions.setCategoryServices(item.services);
  }

  render() {
    let onChangeService = null;
    const { state } = this.props.navigation;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeService) { onChangeService = this.handleOnChangeService; }

    return (
      <View style={styles.container}>
        <View style={styles.servicesList}>
          { (!this.props.servicesState.showCategoryServices
            && !this.props.salonSearchHeaderState.showFilter
            && this.props.servicesState.filtered.length > 0) &&
            <ServiceCategoryList
              onRefresh={this.getServices}
              handlePressServiceCategory={this.handlePressServiceCategory}
              serviceCategories={this.props.servicesState.filtered}
            />
          }

          { (!this.props.servicesState.showCategoryServices
            && this.props.salonSearchHeaderState.showFilter
            && this.props.servicesState.filtered.length > 0) &&
            <ServiceList
              {...this.props}
              onRefresh={this.getServices}
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.serviceListContainer}
              services={this.props.servicesState.filtered}
              onChangeService={onChangeService}
            />
          }

          { (this.props.servicesState.showCategoryServices
            && this.props.servicesState.filtered.length > 0) &&
            <CategoryServicesList
              {...this.props}
              onRefresh={this.getServices}
              onChangeService={onChangeService}
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
