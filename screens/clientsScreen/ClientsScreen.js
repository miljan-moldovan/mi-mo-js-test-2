// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import SideMenuItem from '../../components/SideMenuItem';
import ClientList from '../../components/clientList';
import SalonSearchHeader from '../../components/SalonSearchHeader';
import ClientSuggestions from './components/ClientSuggestions';
import ClientsHeader from './components/ClientsHeader';


const mockDataClients = require('../../mockData/clients.json');

const styles = StyleSheet.create({
  highlightStyle: {
    color: '#000',
    fontFamily: 'Roboto',
    fontWeight: '700',
  },
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  phoneToolBar: {
    flex: 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  clientsHeader: {
    flex: 1.6,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    flexDirection: 'column',
  },
  clientsList: {
    flex: 9,
    backgroundColor: 'white',
  },
  clientList: {

  },
  clientsHeaderTopSection: {
    flex: 1,
    flexDirection: 'row',
  },
  backIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonCoontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  backText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  newClientContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newClient: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
  },
  backIcon: {
    marginTop: 20,
    width: 15,
    height: 15,
  },
  clientsBarBottomSection: {
    flex: 1,
    flexDirection: 'row',
  },
});


class ClientsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Clients"
        icon={require('../../assets/images/sidemenu/icon_appoint_menu.png')}
      />
    ),
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

    this.props.salonSearchHeaderActions.setHeader(<ClientsHeader {...props} />);

    if (this.props.navigation.state && this.props.navigation.state.params) {
      if (this.props.navigation.state.params.header) {
        this.props.salonSearchHeaderActions.setHeader(this.props.navigation.state.params.header);
      }
    }

    this.props.clientsActions.setClients(mockDataClients);
    this.props.clientsActions.setFilteredClients(mockDataClients);
    const suggestionList = this.getSuggestionsList(mockDataClients);
    this.props.clientsActions.setSuggestionsList(suggestionList);
    this.props.clientsActions.setFilteredSuggestions(suggestionList);
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

        <SalonSearchHeader
          filterList={searchText => this.filterList(searchText)}
        />

        <View style={styles.clientsList}>
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
