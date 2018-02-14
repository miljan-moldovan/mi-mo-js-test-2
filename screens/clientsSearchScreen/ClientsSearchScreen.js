// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import SideMenuItem from '../../components/SideMenuItem';
import ClientList from '../../components/clientList';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonFlatPicker from '../../components/SalonFlatPicker';

const mockDataClients = require('../../mockData/clients.json');

const filterType = ['This store', 'All stores'];

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
    // marginTop: 20,
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
  topSearchBar: {
    flex: 0.1,
    flexDirection: 'column',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  filterBarContainer: {
    backgroundColor: '#F8F8F8',
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


class ClientsSearchScreen extends React.Component {
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

    this.props.clientsSearchActions.setClients(mockDataClients);
    this.props.clientsSearchActions.setFilteredClients(mockDataClients);
    this.props.clientsSearchActions.setSearchText('');
    this.props.clientsSearchActions.setSelectedFilter(0);
  }

  filterClients(searchText) {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'email', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientsSearchScreen.flexFilter(this.props.clientsSearchState.clients, criteria);

      this.props.clientsSearchActions.setSearchText(searchText);
      this.props.clientsSearchActions.setFilteredClients(filtered);
    } else {
      this.props.clientsSearchActions.setFilteredClients(this.props.clientsSearchState.clients);
      this.props.clientsSearchActions.setSearchText(searchText);
    }
  }

  handleTypeChange=(ev, selectedIndex) => {
    this.props.clientsSearchActions.setSelectedFilter(selectedIndex);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.clientsList}>
          { (this.props.clientsSearchState.clients.length > 0) &&
            <View style={styles.topSearchBar}>
              <SalonSearchBar
                placeHolderText="Search"
                placeholderTextColor="#727A8F"
                searchIconPosition="left"
                iconsColor="#727A8F"
                fontColor="#727A8F"
                borderColor="transparent"
                backgroundColor="rgba(142, 142, 147, 0.24)"
                onChangeText={searchText => this.filterClients(searchText)}
              />
            </View>}
          <View style={styles.filterBarContainer}>

            <View style={styles.filterBar}>
              <SalonFlatPicker
                dataSource={filterType}
                selectedColor="#115ECD"
                selectedTextColor="#FFFFFF"
                unSelectedTextColor="#115ECD"
                onItemPress={this.handleTypeChange}
                selectedIndex={this.props.clientsSearchState.selectedFilter}
              />

            </View>
          </View>

          { (this.props.clientsSearchState.filtered.length > 0) &&

            <ClientList
              boldWords={this.props.clientsSearchState.searchText}
              style={styles.clientListContainer}
              clients={this.props.clientsSearchState.filtered}
              showLateralList
              onPressItem={(client) => {
                  const { navigate } = this.props.navigation;
                  const { params } = this.props.navigation.state;

                  this.props.walkInActions.selectedClient(client);

                  navigate('WalkIn');
              }}
            />

           }

        </View>

      </View>
    );
  }
}
export default ClientsSearchScreen;
