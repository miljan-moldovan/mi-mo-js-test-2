// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonSearchHeader from '../../components/SalonSearchHeader';
import ServiceList from './components/serviceList';
import CategoryServicesList from './components/categoryServicesList';
import ServiceCategoryList from './components/serviceCategoryList';

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
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  backIcon: {
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'right',
  },
});


class ServicesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params && navigation.state.params.defaultProps ? navigation.state.params.defaultProps : {};
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
    this.setState({ refreshing: true });
    this.getServices();
  }

  getServices() {
    this.setState({ refreshing: true });

    this.props.servicesActions.setShowCategoryServices(false);
    this.props.servicesActions.getServices().then((response) => {
      if (response.data.error) {
        this.goBack();
      } else {
        const services = response.data.services;
        this.props.servicesActions.setServices(services);
        this.props.servicesActions.setFilteredServices(services);
        this.setState({ refreshing: false });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  state = {
    refreshing: false,
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
    this.props.navigation.setParams({ defaultProps: this.state.defaultHeaderProps, ignoreNav: false });
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

    if (dismissOnSelect) { this.goBack(); }
  }

  // onChangeService = () => {
  //   const { navigate } = this.props.navigation;
  //
  //   navigate('Clients', {
  //     ...this.props,
  //     headerProps: {
  //       title: 'Clients',
  //       subTitle: 'subtitulo',
  //       leftButtonOnPress: (navigation) => { navigation.goBack(); },
  //       leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
  //       rightButton: <Text style={styles.rightButtonText}>Add</Text>,
  //       rightButtonOnPress: (navigation) => { navigation.navigate('NewClientScreen'); },
  //     },
  //   });
  // }

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
  <TouchableOpacity
    style={{ flex: 1 }}
    onPress={() => { this.goBack(); }}
  >
    <FontAwesome style={styles.backIcon}>
      {Icons.angleLeft}
    </FontAwesome>
  </TouchableOpacity>,
    }, true);
    this.props.servicesActions.setShowCategoryServices(true);
    this.props.servicesActions.setCategoryServices(item.services);
  }

  render() {
    let onChangeService = null;
    const { state } = this.props.navigation;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeService) { onChangeService = this.handleOnChangeService; }

    // const onChangeService = this.onChangeService;

    return (
      <View style={styles.container}>
        <View style={styles.servicesList}>


          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.getNotes}
              />
          }
          >


            { (!this.props.servicesState.showCategoryServices
            && !this.props.salonSearchHeaderState.showFilter
            && this.props.servicesState.filtered.length > 0) &&
            <ServiceCategoryList
              handlePressServiceCategory={this.handlePressServiceCategory}
              serviceCategories={this.props.servicesState.filtered}
            />
          }

            { (!this.props.servicesState.showCategoryServices
            && this.props.salonSearchHeaderState.showFilter
            && this.props.servicesState.filtered.length > 0) &&
            <ServiceList
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.serviceListContainer}
              services={this.props.servicesState.filtered}
              onChangeService={onChangeService}
            />
          }

            { (this.props.servicesState.showCategoryServices
            && this.props.servicesState.filtered.length > 0) &&
            <CategoryServicesList
              onChangeService={onChangeService}
              categoryServices={this.props.servicesState.categoryServices}
            />
          }

          </ScrollView>
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
