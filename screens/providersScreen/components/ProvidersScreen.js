// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';

import { connect } from 'react-redux';
import apiWrapper from '../../../utilities/apiWrapper';

import SalonSearchBar from '../../../components/SalonSearchBar';
import SideMenuItem from '../../../components/SideMenuItem';
import SalonAvatar from '../../../components/SalonAvatar';
import ProviderList from '../../../components/providerList';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Icon from '../../../components/UI/Icon';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const mockDataProviders = require('../../../mockData/providers.json');

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    paddingTop: 14,
    fontFamily: 'Roboto-Medium',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column',
  },
  itemRow: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C0C1C6',
  },
  inputRow: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  providerName: {
    fontSize: 14,
    marginLeft: 7,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  timeLeftText: {
    fontSize: 11,
    textAlign: 'right',
    fontFamily: 'Roboto-Light',
    color: '#0C4699',
  },
  letterListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  letterListText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Roboto-Regular',
    color: '#727A8F',
  },
});

const iconAppointMenu = require('../../../assets/images/sidemenu/icon_appoint_menu.png');

class ProviderScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.headerTitle}>Providers</Text>
      </View>
    ),
    headerLeft: (
      <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigation.goBack(); }}>
        <Text style={{ fontSize: 14, color: '#fff' }}>Cancel</Text>
      </TouchableOpacity>
    ),
    headerRight: (null),
  });

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
    this.state = {
      loading: true,
      providers: [],
    };
  }

  componentWillMount() {
    apiWrapper.doRequest('getEmployees', {})
      .then((providers) => {
        this.setState({ providers, loading: false });
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  _handleOnChangeProvider = (provider) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeProvider, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeProvider) { onChangeProvider(provider); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }

  filterProviders = (searchText) => {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
        { Field: 'lastName', Values: [searchText.toLowerCase()] },
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

  filterList = (searchText) => {
    this.filterProviders(searchText);
  }

  renderItem = ({ item, index }) => {
    let fullName = item.name;
    fullName += item.middleName ? ` ${item.middleName}${item.lastName}` : ` ${item.lastName}`;

    return (
      <View
        style={styles.itemRow}
        key={index}
      >
        <View style={styles.inputRow}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={30}
            borderWidth={1}
            borderColor="transparent"
            image={{ uri: 'https://qph.fs.quoracdn.net/main-qimg-60b27864c5d69bdce69e6413b9819214' }}
          />
          <Text style={styles.providerName}>{fullName}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={[styles.timeLeftText]}>21m</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {index === 3 && (
          <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
          )}
        </View>
      </View>
    );
  }

  render() {
    const { state } = this.props.navigation;
    if (this.state.loading) {
      return (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator size="small" color="rgba(0,0,0,.3)" />
        </View>
      );
    }
    let onChangeProvider = null;
    // make sure we only pass a callback to the component if we have one for the screen
    if (state.params && state.params.onChangeProvider) {
      onChangeProvider = this._handleOnChangeProvider;
    }

    return (
      <View style={styles.container}>
        <SalonSearchBar
          backgroundColor="#d9d9da"
          fontColor="#727A8F"
          iconsColor="#727A8F"
          placeholderTextColor="#727A8F"
          placeHolderText="Search"
          borderColor="transparent"
          containerStyle={{
            paddingTop: 3,
            paddingBottom: 3.1,
            paddingHorizontal: 8,
          }}
          onChangeText={(text) => {
            console.log('das text', text);
          }}
          // filterList={searchText => this.filterList(searchText)}
        />
        <View style={{ flexDirection: 'row' }}>
          <FlatList
            style={{ backgroundColor: 'white' }}
            data={this.state.providers}
            renderItem={this.renderItem}
          />
          <View style={styles.letterListContainer}>
            {letters.map(item => (
              <TouchableOpacity key={Math.random()} onPress={item => alert(`pressed ${item}`)}>
                <Text style={styles.letterListText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }
}
export default ProviderScreen;
