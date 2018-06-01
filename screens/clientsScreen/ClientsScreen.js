// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import SideMenuItem from '../../components/SideMenuItem';
import ClientList from './components/clientList';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import ClientSuggestions from './components/ClientSuggestions';
import Icon from '../../components/UI/Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  clientListContainer: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'column',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Roboto',
    padding: 20,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  clientsHeader: {
    flex: 1.6,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    flexDirection: 'column',
  },
  clientsList: {
    flex: 9,
    backgroundColor: '#F8F8F8',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    textAlign: 'right',
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
  searchClients: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchClientsTitle: {
    color: '#727A8F',
    fontSize: 13,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  searchClientsText: {
    color: '#727A8F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  searchIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingTop: 5,
    paddingRight: 0,
  },
});

class ClientsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params && navigation.state.params.defaultProps ? navigation.state.params.defaultProps : {
      title: 'Clients',
      subTitle: null,
      leftButtonOnPress: () => { navigation.goBack(); },
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      rightButton: <Text style={styles.rightButtonText}>Add</Text>,
      rightButtonOnPress: () => { navigation.navigate('NewClientScreen'); },
    };
    const ignoreNav = navigation.state.params && navigation.state.params.ignoreNav ? navigation.state.params.ignoreNav : false;
    console.log('client: ', navigation.state.params);
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
        hasFilter
        containerStyle={{
          paddingHorizontal: 20,
        }}
      />),
      drawerLabel: props => (
        <SideMenuItem
          {...props}
          title="Clients"
          icon={require('../../assets/images/sidemenu/icon_appoint_menu.png')}
        />
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

  componentWillMount() {
    this.props.salonSearchHeaderActions.setShowFilter(false);
    this.props.navigation.setParams({ defaultProps: this.state.defaultHeaderProps, ignoreNav: false });
  }

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ defaultProps: this.state.headerProps, ignoreNav: false });

    this.props.salonSearchHeaderActions.setShowFilter(false);

    this.props.clientsActions.getClients().then((response) => {
      if (response.data.error) {
        // this.props.navigation.goBack();
      } else {
        const { clients } = response.data;
        this.props.clientsActions.setClients(clients);
        this.props.clientsActions.setFilteredClients(clients);
        const suggestionList = this.getSuggestionsList(clients);
        this.props.clientsActions.setSuggestionsList(suggestionList);
        this.props.clientsActions.setFilteredSuggestions(suggestionList);
      }
    });
  }

  state = {
    headerProps: {
      title: 'Clients',
      subTitle: null,
      leftButtonOnPress: () => { this.props.navigation.goBack(); },
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      rightButton: <Text style={styles.rightButtonText}>Add</Text>,
      rightButtonOnPress: () => { this.props.navigation.navigate('NewClientScreen'); },
    },
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

  _handleOnChangeClient = (client) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeClient, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeClient) { onChangeClient(client); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }

  filterClients = (searchText) => {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'lastName', Values: [searchText.toLowerCase()] },
        { Field: 'email', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientsScreen.flexFilter(this.props.clientsState.clients, criteria);
      this.props.clientsActions.setFilteredClients(filtered);
    } else {
      this.props.clientsActions.setFilteredClients(this.props.clientsState.clients);
    }

    this.props.navigation.setParams({
      searchText: this.props.salonSearchHeaderState.searchText,
    });
  }

  onPressItem = (item) => {
    this.props.salonSearchHeaderActions.setSearchText(item);
    this.filterClients(item);
    this.props.salonSearchHeaderActions.setShowFilter(false);
  }


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
  }

  filterList = (searchText) => {
    if (!this.props.salonSearchHeaderState.showFilter) {
      this.filterClients(searchText);
    } else {
      this.filterSuggestions(searchText);
    }
  }

  render() {
    let onChangeClient = null;
    const { state } = this.props.navigation;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeClient) { onChangeClient = this._handleOnChangeClient; }

    return (
      <View style={styles.container}>
        <View style={styles.clientsList}>

          {false && this.props.clientsState.filtered.length === 0 &&

            <View style={styles.searchClients}>
              <Icon name="circle" size={100} color="#C0C1C6" type="solid" />
              <View style={styles.searchIconContainer}>
                <Icon
                  style={styles.subIcon}
                  name="search"
                  size={50}
                  color="#C0C1C6"
                  type="solid"
                />
              </View>

              <Text style={styles.searchClientsTitle}>Search for clients above.</Text>
              <Text style={styles.searchClientsText}>Type name, code, phone number or email</Text>
            </View>
          }

          { (!this.props.salonSearchHeaderState.showFilter && this.props.clientsState.filtered.length > 0) &&
            <ClientList
              boldWords={this.props.salonSearchHeaderState.searchText}
              style={styles.clientListContainer}
              clients={this.props.clientsState.filtered}
              onChangeClient={onChangeClient}
            />
           }

          { (this.props.salonSearchHeaderState.showFilter && this.props.clientsState.filtered.length > 0) &&
          <ClientSuggestions
            {...this.props}
            onPressItem={this.onPressItem}
            list={this.props.clientsState.suggestionsList}
          />
            }

        </View>

      </View>
    );
  }
}

ClientsScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onChangeClient: PropTypes.func,
        dismissOnSelect: PropTypes.bool,
      }),
    }),
  }),
};

ClientsScreen.defaultProps = {
  navigation: null,
};

export default ClientsScreen;
