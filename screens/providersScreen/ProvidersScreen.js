// @flow

import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get } from 'lodash';
import { getEmployeePhoto } from '../../utilities/apiWrapper';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonAvatar from '../../components/SalonAvatar';
import WordHighlighter from '../../components/wordHighlighter';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';


const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
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
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#C0C1C6',
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
    paddingTop: 77,
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
  headerSubTitle: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
});

class ProviderScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params && navigation.state.params.defaultProps ? navigation.state.params.defaultProps : {
      title: 'Providers',
      subTitle: null,
      leftButtonOnPress: () => { navigation.goBack(); },
      leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
    };

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
    let customLeftButton = false;
    if (navigation.state.params) {
      if (navigation.state.params.headerProps && navigation.state.params.headerProps.leftButtonOnPress) {
        customLeftButton = true;
      }
    }

    return {
      headerTitle: (
        <View style={{
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Text style={styles.headerTitle}>{title}</Text>
          { subTitle ? <Text style={styles.headerSubTitle}>{subTitle}</Text> : null }
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={customLeftButton ? () => leftButtonOnPress(navigation) : leftButtonOnPress}>
          { leftButton }
        </SalonTouchableOpacity>
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
    const params = this.props.navigation.state.params || {};
    this.state = {
      selectedProvider: get(params, 'selectedProvider', null),
      filterByService: get(params, 'filterByService', false),
      filterList: get(params, 'filterList', false),
      refreshing: false,
      headerProps: {
        title: 'Providers',
        subTitle: null,
        leftButtonOnPress: () => { this.props.navigation.goBack(); },
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      },
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ defaultProps: this.state.headerProps });

    this.onRefresh();
  }

  // state = {
  // headerProps: {
  //   title: 'Providers',
  //   subTitle: null,
  //   leftButtonOnPress: () => { this.props.navigation.goBack(); },
  //   leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
  // },
  // }

  getFirstItemForLetter = (letter) => {
    const { currentData } = this.props.providersState;
    for (let i = 0; i < currentData.length; i += 1) {
      if (currentData[i].fullName.indexOf(letter) === 0) {
        return i;
      }
    }

    return false;
  }

  scrollToIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index });
  }

  _handleOnChangeProvider = (provider) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }

    this.props.providersActions.setSelectedProvider(provider);

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

      const filtered = ProviderScreen.flexFilter(this.props.providersState.providers, criteria);
      this.props.providersActions.setFilteredProviders(filtered);
    } else {
      this.props.providersActions.setFilteredProviders(this.props.providersState.providers);
    }

    this.props.navigation.setParams({
      searchText: this.props.salonSearchHeaderState.searchText,
    });
  }

  filterList = (searchText) => {
    this.filterProviders(searchText);
    this.setState({ searchText });
  }

  filterByLetter = (letter) => {
    const filtered = this.props.providersState.providers.filter(item => item.name.indexOf(letter) === 0);

    this.props.providersActions.setFilteredProviders(filtered);
    this.setState({ providers: this.props.providersState.filtered });
  }

  onRefresh = () => {
    const { filterByService, filterList } = this.state;
    this.props.providersActions.getProviders(
      {
        filterRule: 'none',
        maxCount: 100,
        sortOrder: 'asc',
        sortField: 'fullName',
      },
      filterByService,
      filterList,
    );
  }

  renderItem = ({ item, index }) => (
    <SalonTouchableOpacity
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
          image={{ uri: getEmployeePhoto(item.id) }}
        />
        <WordHighlighter
          highlight={this.state.searchText}
          style={this.state.selectedProvider === item.id ? [styles.providerName, { color: '#1DBF12' }] : styles.providerName}
          highlightStyle={{ color: '#1DBF12' }}
        >
          {item.fullName}
        </WordHighlighter>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={[styles.timeLeftText]}>21m</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.selectedProvider === item.id && (
        <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
        )}
      </View>
    </SalonTouchableOpacity>
  );

  renderSeparator = () => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        width: '100%',
        backgroundColor: '#C0C1C6',
      }}
    />
  );

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
            this.filterList(text);
          }}
          // filterList={(searchText) => {
          //   debugger//eslint-disable-line
          // }}
        />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <SalonTouchableOpacity
              onPress={() => this._handleOnChangeProvider({
                id: 0,
                isFirstAvailable: true,
                name: 'First',
                lastName: 'Available',

               })}
              style={styles.itemRow}
              key={Math.random()}
            >
              <View style={styles.inputRow}>
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={30}
                  borderWidth={1}
                  borderColor="transparent"
                  image={{ uri: getEmployeePhoto(0) }}
                />
                <Text style={styles.providerName}>First Available</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[styles.timeLeftText]}>21m</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }} />
            </SalonTouchableOpacity>
            {this.renderSeparator()}
            { this.props.providersState.isLoading ?
              (
                <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                  <ActivityIndicator />
                </View>
              )
              : (
                <FlatList
                  style={{ backgroundColor: 'white' }}
                  data={this.props.providersState.currentData}
                  renderItem={this.renderItem}
                  ItemSeparatorComponent={this.renderSeparator}
                  ref={(ref) => { this.flatListRef = ref; }}
                  getItemLayout={(data, index) => (
                    { length: 43, offset: (43 + StyleSheet.hairlineWidth) * index, index }
                  )}
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
              <SalonTouchableOpacity
                key={item}
                onPress={() => {
                  this.scrollToIndex(this.getFirstItemForLetter(item));
                }}
              >
                <Text style={styles.letterListText}>{item}</Text>
              </SalonTouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    );
  }
}
export default ProviderScreen;
