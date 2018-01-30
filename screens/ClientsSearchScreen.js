// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';

import { connect } from 'react-redux';
import * as actions from '../actions/clientsSearch';
import SideMenuItem from '../components/SideMenuItem';
import ClientList from '../components/clientList';
import WordHighlighter from '../components/wordHighlighter';

const mockDataClients = require('../mockData/clients.json');


const styles = StyleSheet.create({
  highlightStyle: {
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  walkinBar: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  walkinBarIconContainer: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  walkinBarIcon: {
    height: 25,
    width: 21,
  },
  walkinBarRound: {
    backgroundColor: '#67A3C7',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 28,
    height: 59,
    width: 59,
  },
  walkinBarData: {
    marginLeft: 20,
    flex: 1.5,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  walkinBarText: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
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
    fontFamily: 'OpenSans-Regular',
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
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  backText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
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
    fontFamily: 'OpenSans-Bold',
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
  seachBar: {
    flexDirection: 'row',
    flex: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  topSearchBar: {
    flex: 0.13,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1 / 2,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
});


class ClientsSearchScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Clients"
        icon={require('../assets/images/sidemenu/icon_appoint_menu.png')}
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = { clients: mockDataClients, searchText: '', showWalkIn: false };
  }

  state = {

  }

  componentWillMount() {
    this.props.navigation.setParams({
      onChangeText: searchText => this.filterClients(searchText),
    });
    this.setState({ filteredClients: this.state.clients });
  }

  filterClients(searchText) {
    if (searchText.length === 0) {
      this.setState({ filteredClients: this.state.clients, searchText, showWalkIn: false });
    } else {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'email', Values: [searchText.toLowerCase()] },
      ];
      const filtered = this.flexFilter(this.state.clients, criteria);

      const filterWalkin = this.flexFilter([{ name: 'Walkin', email: 'Walkin' }], criteria);

      this.setState({ filteredClients: filtered, searchText, showWalkIn: filterWalkin.length > 0 });
    }
  }

  flexFilter(list, info) {
    let matchesFilter,
      matches = [];

    matchesFilter = function (item) {
      let count = 0;
      for (let n = 0; n < info.length; n++) {
        if (item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count++;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i++) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.clientsList}>
          { (this.state.filteredClients.length > 0 || this.state.showWalkIn) &&
            <View style={styles.topSearchBar}>
              <Text style={styles.topSearchBarText}>TOP SEARCH MATCHES</Text>
            </View>}
          {this.state.showWalkIn &&
            <View style={styles.walkinBar}>
              <View style={styles.walkinBarIconContainer}>
                <View style={styles.walkinBarRound}>
                  <Image
                    style={styles.walkinBarIcon}
                    source={require('../assets/images/clientsSearch/icon_walkin.png')}
                  />
                </View>
              </View>

              <View style={styles.walkinBarData}>

                <TouchableHighlight
                  style={styles.newClientButton}
                  underlayColor="transparent"
                  onPress={() => {}}
                >

                  <WordHighlighter
                    highlight={this.state.searchText}
                    highlightStyle={styles.highlightStyle}
                    style={styles.walkinBarText}
                  >Walkin
                  </WordHighlighter>

                </TouchableHighlight>

              </View>
            </View>
           }

          { (this.state.filteredClients.length > 0 || !this.state.showWalkIn) &&

          <ClientList
            boldWords={this.state.searchText}
            clients={this.state.filteredClients}
            style={styles.clientListContainer}
          />

           }

        </View>

      </View>
    );
  }
}
export default connect(null, actions)(ClientsSearchScreen);
