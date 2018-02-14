// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import SideMenuItem from '../../components/SideMenuItem';
import ClientList from '../../components/clientList';
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
    backgroundColor: '#115ECD',
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

    this.props.clientsActions.setClients(mockDataClients);
    this.props.clientsActions.setFilteredClients(mockDataClients);
    this.props.clientsActions.setSearchText('');
    this.props.clientsActions.setSelectedFilter(0);
  }


  componentWillMount() {
    this.props.navigation.setParams({
      onChangeText: searchText => this.filterClients(searchText),
    });
  }

  filterClients(searchText) {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'email', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientsScreen.flexFilter(this.props.clientsState.clients, criteria);

      this.props.clientsActions.setSearchText(searchText);
      this.props.clientsActions.setFilteredClients(filtered);
    } else {
      this.props.clientsActions.setFilteredClients(this.props.clientsState.clients);
      this.props.clientsActions.setSearchText(searchText);
    }
  }

  handleTypeChange=(ev, selectedIndex) => {
    this.props.clientsActions.setSelectedFilter(selectedIndex);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.clientsList}>
          <View style={styles.filterBarContainer}>

            <View style={styles.filterBar}>
              <SalonFlatPicker
                dataSource={filterType}
                selectedColor="#FFFFFF"
                selectedTextColor="#115ECD"
                unSelectedTextColor="#FFFFFF"
                onItemPress={this.handleTypeChange}
                selectedIndex={this.props.clientsState.selectedFilter}
              />

            </View>
          </View>

          { (this.props.clientsState.filtered.length > 0) &&

            <ClientList
              boldWords={this.props.clientsState.searchText}
              style={styles.clientListContainer}
              clients={this.props.clientsState.filtered}
              showLateralList
              onPressItem={(client) => {
                  const { navigate } = this.props.navigation;
                  const { params } = this.props.navigation.state;

                  this.props.walkInActions.selectClient(client);

                  navigate('WalkIn');
              }}
            />

           }

        </View>

      </View>
    );
  }
}
export default ClientsScreen;
