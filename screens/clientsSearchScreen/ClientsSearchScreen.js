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
import ClientsSearchHeader from './components/ClientsSearchHeader';

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
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 0.09,
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

  componentWillMount() {
    this.props.navigation.setParams({
      onChangeText: searchText => this.filterClients(searchText),
      showHeader: !this.props.clientsSearchState.showFilter,
      showBar: this.props.clientsSearchState.showFilter,
      searchText: this.props.clientsSearchState.searchText,
    });
  }


  filterClients(searchText) {
    let showFilter = false;

    if (searchText && searchText.length > 0) {
      showFilter = true;

      this.props.clientsSearchActions.setShowFilter(showFilter);

      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'email', Values: [searchText.toLowerCase()] },
      ];

      const filtered = ClientsSearchScreen.flexFilter(this.props.clientsSearchState.clients, criteria);

      this.props.clientsSearchActions.setSearchText(searchText);
      this.props.clientsSearchActions.setFilteredClients(filtered);
    } else {
      this.props.clientsSearchActions.setShowFilter(showFilter);

      this.props.clientsSearchActions.setFilteredClients(this.props.clientsSearchState.clients);
      this.props.clientsSearchActions.setSearchText(searchText);
    }

    this.props.navigation.setParams({
      showHeader: !showFilter,
      showBar: showFilter,
      searchText: this.props.clientsSearchState.searchText,
    });
  }

  handleTypeChange=(ev, selectedIndex) => {
    this.props.clientsSearchActions.setSelectedFilter(selectedIndex);
  }

  render() {
    return (
      <View style={styles.container}>
        { !this.props.clientsSearchState.showFilter && <ClientsSearchHeader {...this.props} />}
        <View style={styles.clientsList}>


          { (this.props.clientsSearchState.clients.length > 0) &&
          <View style={[styles.topSearchBar, {
              paddingTop: !this.props.clientsSearchState.showFilter ? 0 : 15,
              backgroundColor: !this.props.clientsSearchState.showFilter ? '#F8F8F8' : '#115ECD',
            }]}
          >
            <SalonSearchBar
              placeHolderText="Search"
              marginVertical={!this.props.clientsSearchState.showFilter ? 0 : 30}
              placeholderTextColor={!this.props.clientsSearchState.showFilter ? '#727A8F' : '#FFFFFF'}
              showCancel={this.props.clientsSearchState.showFilter}
              searchIconPosition="left"
              iconsColor={!this.props.clientsSearchState.showFilter ? '#727A8F' : '#FFFFFF'}
              fontColor={!this.props.clientsSearchState.showFilter ? '#727A8F' : '#FFFFFF'}
              borderColor="transparent"
              backgroundColor={!this.props.clientsSearchState.showFilter ? 'rgba(142, 142, 147, 0.24)' : '#0C4699'}
              onChangeText={searchText => this.filterClients(searchText)}
            />
          </View>}

          { this.props.clientsSearchState.showFilter &&
          <View style={styles.filterBarContainer}>

            <View style={styles.filterBar}>
              <SalonFlatPicker
                dataSource={filterType}
                selectedColor="#FFFFFF"
                selectedTextColor="#115ECD"
                unSelectedTextColor="#FFFFFF"
                onItemPress={this.handleTypeChange}
                selectedIndex={this.props.clientsSearchState.selectedFilter}
              />

            </View>
          </View>
        }


          { (this.props.clientsSearchState.filtered.length > 0) &&

            <ClientList
              boldWords={this.props.clientsSearchState.searchText}
              style={styles.clientListContainer}
              clients={this.props.clientsSearchState.filtered}
              showSectionHeader={!this.props.clientsSearchState.showFilter}
              simpleListItem={this.props.clientsSearchState.showFilter}
              showLateralList={!this.props.clientsSearchState.showFilter}
              onPressItem={(client) => {
                  this.props.clientsSearchActions.setShowFilter(false);

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
