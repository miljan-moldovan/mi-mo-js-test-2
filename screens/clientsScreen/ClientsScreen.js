// @flow
import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import ClientList from './components/clientList';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import Icon from '../../components/UI/Icon';
import styles from './styles';
import BarsActionSheet from '../../components/BarsActionSheet';
import Colors from '../../constants/Colors';

const query = {
  fromAllStores: false,
  'nameFilter.FilterRule': 3,
  'nameFilter.SortOrder': 1,
};

class ClientsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isModal = get(navigation.state.params, 'isModal', false);
    const headerProps = get(navigation.state.params, 'headerProps', {});
    const stateProps = get(navigation.state.params, 'defaultProps', {});
    const hideAddButton = get(navigation.state.params, 'hideAddButton', false);
    const defaultProps = {
      title: 'Clients',
      subTitle: null,
      leftButtonOnPress: () => { navigation.goBack(); },
      leftButton: navigation.state.routeName === 'ClientsMain'
        ? <Text style={styles.leftButtonText}>Cancel</Text> : null,
      rightButton: hideAddButton ? null : <Text style={styles.rightButtonText}>Add Client</Text>,
      rightButtonOnPress: () => { navigation.navigate(isModal ? 'ModalNewClient' : 'NewClient', { onChangeClient: navigation.state.params.onChangeClient }); },
    };
    const mergedProps = {
      ...defaultProps,
      ...stateProps,
      ...headerProps,
    };
    const {
      rightButton,
      rightButtonOnPress,
      title,
      subTitle,
    } = mergedProps;

    let {
      leftButton,
      leftButtonOnPress,
    } = mergedProps;

    const clearSearch = navigation.state.params &&
      navigation.state.params.clearSearch ? navigation.state.params.clearSearch : null;

    if (!leftButton) {
      leftButton = (
        <Icon
          name="bars"
          type="solid"
          color="white"
          size={19}
        />
      );

      leftButtonOnPress = defaultProps.defaultLeftButtonOnPress;
    }
    const { routeName } = navigation.state;
    return {
      header: () => (
        <SafeAreaView style={{ backgroundColor: Colors.defaultBlue }}>
          <SalonSearchHeader
            clearSearch={clearSearch}
            title={title}
            subTitle={subTitle}
            leftButton={
              routeName === 'ClientsMain' || routeName === 'ClientsStack'
                ? null : leftButton
            }
            leftButtonOnPress={() => {
              if (clearSearch) {
                clearSearch();
              }
              leftButtonOnPress(navigation);
            }}
            rightButton={navigation.state.params && navigation.state.params.hideAddButton ? null : rightButton}
            rightButtonOnPress={() => {
              rightButtonOnPress(navigation);
            }}
            hasFilter
            containerStyle={styles.headerContainer}
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
    this.props.navigation.setParams({
      defaultProps: this.state.headerProps,
      clearSearch: this.clearSearch,
      ignoreNav: false,
    });

    this.props.salonSearchHeaderActions.setShowFilter(false);

    this.props.salonSearchHeaderActions.setFilterAction(this.filterClients);
  }

  state = {
    headerProps: {
      title: 'Clients',
      subTitle: null,
      defaultLeftButtonOnPress: () => { this.handleLeftButton(); },
      rightButtonOnPress: () => { this.props.navigation.navigate(this.props.navigation.state.params.isModal ? 'ModalNewClient' : 'NewClient', { onChangeClient: this._handleOnChangeClient }); },
    },
  }

  componentDidUpdate(prevProps) {
    const { salonSearchHeaderState } = prevProps;
    if (this.props.salonSearchHeaderState.selectedFilter !==
      salonSearchHeaderState.selectedFilter) {
      if (salonSearchHeaderState.searchText && salonSearchHeaderState.searchText.length > 0) {
        const params = {
          ...query,
          'nameFilter.FilterValue': salonSearchHeaderState.searchText,
          fromAllStores: !!salonSearchHeaderState.selectedFilter,
        };
        this.props.clientsActions.getClients(params);
      }
    }
  }

  getSuggestionsList = (clients) => {
    let suggestions = [];

    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      if (suggestions.indexOf(client.name) === -1 && client.name) {
        suggestions.push(client.name);
      } else if (suggestions.indexOf(client.lastName) === -1 && client.lastName) {
        suggestions.push(client.lastName);
      }
    }

    suggestions = suggestions.sort((a, b) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      return 0;
    });

    return suggestions;
  }

  handleLeftButton = () => {
    if (this.BarsActionSheet) {
      this.BarsActionSheet.show();
    }
  }

  clearSearch = () => {
    this.props.clientsActions.setClients([]);
  };

  _handleOnChangeClient = (client) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }

    const { onChangeClient, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeClient) {
      onChangeClient(client);
    }
    if (dismissOnSelect) {
      this.props.salonSearchHeaderActions.setShowFilter(false);
      this.props.navigation.goBack();
    }
  };

  filterClients = (searchText) => {
    if (searchText && searchText.length > 0) {
      const params = {
        ...query,
        'nameFilter.FilterValue': searchText,
        fromAllStores: !!this.props.salonSearchHeaderState.selectedFilter,
      };
      this.props.clientsActions.getClients(params);
    }
  };

  filterSuggestions = (searchText) => {
    if (searchText && searchText.length > 0) {
      const filtered = [];
      for (let i = 0; i < this.props.clientsState.suggestionsList.length; i += 1) {
        const item = this.props.clientsState.suggestionsList[i];

        if (item.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          filtered.push(item);
        }
      }

      this.props.clientsActions.setFilteredSuggestions(filtered);
    } else {
      this.props.clientsActions.setFilteredSuggestions(this.props.clientsState.suggestionsList);
    }
  };

  filterList = (searchText) => {
    if (!this.props.salonSearchHeaderState.showFilter) {
      this.filterClients(searchText);
    } else {
      this.filterSuggestions(searchText);
    }
  };

  fetchMore = () => {
    const {
      total,
      showing,
      salonSearchHeaderState: {
        searchText,
      },
    } = this.props;
    if (total > showing && searchText && searchText.length > 0) {
      const params = {
        ...query,
        'nameFilter.FilterValue': searchText,
        'nameFilter.Skip': showing,
        fromAllStores: !!this.props.salonSearchHeaderState.selectedFilter,
      };
      this.props.clientsActions.getMoreClients(params);
    }
  }

  render() {
    let onChangeClient = null;
    const { state } = this.props.navigation;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeClient) {
      onChangeClient = this._handleOnChangeClient;
    }

    return (
      <View style={styles.container}>
        <BarsActionSheet
          ref={item => this.BarsActionSheet = item}
          onLogout={this.props.auth.logout}
          navigation={this.props.navigation}
          onChangeStore={this.props.storeActions.reselectMainStore}
        />
        <View style={styles.clientsList}>
          <ClientList
            isWalkin={get(this.props.navigation.state, 'params.isWalkin', false)}
            isLoadingMore={this.props.isLoadingMore}
            fetchMore={this.fetchMore}
            navigate={this.props.navigation.navigate}
            boldWords={this.props.salonSearchHeaderState.searchText}
            style={styles.clientListContainer}
            clients={this.props.clientsSectionDataSource}
            onChangeClient={onChangeClient}
            refreshing={this.props.salonSearchHeaderState.isLoading}
            isLoading={this.props.clientsState.isLoading}
            hideAddButton={this.props.navigation.state.params ? this.props.navigation.state.params.hideAddButton : true}
          />
        </View>
      </View>
    );
  }
}

ClientsScreen.propTypes = {
  isLoadingMore: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  showing: PropTypes.number.isRequired,
  clientsActions: PropTypes.shape({
    getClients: PropTypes.func,
    getMoreClients: PropTypes.func,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onChangeClient: PropTypes.func,
        dismissOnSelect: PropTypes.bool,
      }),
    }),
  }),
  storeActions: PropTypes.shape({
    reselectMainStore: PropTypes.func.isRequired,
  }).isRequired,
};

ClientsScreen.defaultProps = {
  navigation: null,
};

export default ClientsScreen;
