// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import apiWrapper from '../../utilities/apiWrapper';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonAvatar from '../../components/SalonAvatar';
import ProviderList from '../../components/providerList';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
    backgroundColor: 'white',
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
    paddingTop: 34,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  letterListText: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Roboto-Regular',
    color: '#727A8F',
  },
});

class ProviderScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params ? navigation.state.params.defaultProps : {};
    const ignoreNav = navigation.state.params ? navigation.state.params.ignoreNav : false;

    const { leftButton } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { leftButton: <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigation.goBack(); }}>
      <Text style={{ fontSize: 14, color: '#fff' }}>Cancel</Text>
    </TouchableOpacity> };
    const { rightButton } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { rightButton: null };
    const { leftButtonOnPress } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { leftButtonOnPress: navigation.goBack };
    const { rightButtonOnPress } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { rightButtonOnPress: null };
    const { title } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { title: 'Providers' };
    const { subTitle } = navigation.state.params &&
    navigation.state.params.headerProps && !ignoreNav ? navigation.state.params.headerProps : { subTitle: '' };

    return {
      headerTitle: (
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      ),
      headerLeft: (
        leftButton
      ),
      headerRight: (null),
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

  static alphabetFilter = (list, letter) => this.list.filter(item => item.name.indexOf(letter) === 0);

  constructor(props) {
    super(props);
    this.state = {
      providers: [],
      refreshing: false,
    };
  }

  componentWillMount() {
    this.props.providersActions.getProviders({});
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

      const filtered = ProvidersScreen.flexFilter(this.props.providersState.providers, criteria);
      this.props.providersActions.setFilteredClients(filtered);
    } else {
      this.props.providersActions.setFilteredClients(this.props.providersState.providers);
    }

    this.props.navigation.setParams({
      searchText: this.props.salonSearchHeaderState.searchText,
    });
  }

  filterList = (searchText) => {
    this.filterProviders(searchText);
  }

  filterByLetter = (letter) => {
    const filtered = this.props.providersState.providers.filter(item => item.name.indexOf(letter) === 0);

    this.props.providersActions.setFilteredProviders(filtered);
    this.setState({ providers: this.props.providersState.filtered });
  }

  onRefresh = () => {
    console.log('refreshing');
  }

  renderItem = ({ item, index }) => {
    let fullName = item.name;
    fullName += item.middleName ? ` ${item.middleName}${item.lastName}` : ` ${item.lastName}`;

    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => this._handleOnChangeProvider(item)}
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
      </TouchableOpacity>
    );
  }

  render() {
    const { state } = this.props.navigation;
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
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.itemRow}
              key={Math.random()}
            >
              <View style={styles.inputRow}>
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={30}
                  borderWidth={1}
                  borderColor="transparent"
                  image={{ uri: 'https://qph.fs.quoracdn.net/main-qimg-60b27864c5d69bdce69e6413b9819214' }}
                />
                <Text style={styles.providerName}>First Available</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[styles.timeLeftText]}>21m</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }} />
            </TouchableOpacity>
            { this.props.providersState.isLoading ?
              (
                <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                  <ActivityIndicator size="small" color="rgba(0,0,0,.3)" />
                </View>
              )
              : (
                <FlatList
                  style={{ backgroundColor: 'white' }}
                  data={this.props.providersState.currentData}
                  renderItem={this.renderItem}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh}
                    />
                  }
                />
              )
            }

          </View>
          <View style={styles.letterListContainer}>
            {letters.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  this.filterByLetter(item);
                }}
              >
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
