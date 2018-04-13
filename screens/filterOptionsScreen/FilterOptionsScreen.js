import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import WordHighlighter from '../../components/wordHighlighter';
import HeaderLateral from '../../components/HeaderLateral';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonFlatPicker from '../../components/SalonFlatPicker';
import SalonAvatar from '../../components/SalonAvatar';

import SalonRoomList from './components/SalonRoomList';
import SalonResourceList from './components/SalonResourceList';

const TAB_PROVIDERS = 0;
const TAB_RESOURCES = 1;
const TAB_ROOMS = 2;
const TAB_DESK_STAFF = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBarContainer: {
    backgroundColor: '#F1F1F1',
  },
  row: {
    height: 43,
    paddingHorizontal: 16,
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    fontSize: 14,
    lineHeight: 44,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
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
});

export default class FilterOptionsScreen extends React.Component {
  static navigationOptions = rootProps => ({
    title: 'Filter Options',
    leftButton: (
      <HeaderLateral>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto' }}>
          Cancel
        </Text>
      </HeaderLateral>
    ),
    rightButton: (
      <HeaderLateral>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto-Medium' }}>
          Done
        </Text>
      </HeaderLateral>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      activeTab: TAB_PROVIDERS,
    };
  }

  componentWillMount() {
    this.props.providersActions.getProviders({
      filterRule: 'none',
      maxCount: 100,
      sortOrder: 'asc',
      sortField: 'fullName',
    });
  }

  onPressTab = (ev, index) => {
    this.setState({ activeTab: index });
  }

  onRefresh = () => {
    this.props.providersActions.getProviders({
      filterRule: 'none',
      maxCount: 100,
      sortOrder: 'asc',
      sortField: 'fullName',
    });
  }

  renderActiveTab = () => {
    switch (this.state.activeTab) {
      case TAB_PROVIDERS:
        return (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => this._handleOnChangeProvider('all')}
            >
              <Text style={styles.rowText}>View all providers</Text>
            </TouchableOpacity>
            {this.props.providersState.isLoading
              ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator />
                </View>
              ) : (
                <FlatList
                  data={this.props.providersState.currentData}
                  ItemSeparatorComponent={this.renderSeparator}
                  // renderItem={({ item }) => (
                  //   <View key={item.id} style={styles.row}>
                  //     <Text style={styles.rowText}>{item.fullName}</Text>
                  //   </View>
                  // )}
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
        );
      case TAB_RESOURCES:
        return (
          <SalonResourceList />
        );
      case TAB_ROOMS:
        return (
          <SalonRoomList />
        );
      case TAB_DESK_STAFF:
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Desk Staff Tab</Text>
          </View>
        );
      default:
        break;
    }

    return null;
  }

  renderItem = ({ item, index }) => (
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
        <WordHighlighter
          highlight={this.state.searchText}
          style={this.state.selectedProvider === item.id ? [styles.providerName, { color: '#1DBF12' }] : styles.providerName}
          highlightStyle={{ color: '#1DBF12' }}
        >
          {item.fullName}
        </WordHighlighter>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.selectedProvider === item.id && (
        <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
        )}
      </View>
    </TouchableOpacity>
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
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SalonSearchBar
            placeholderTextColor="#727A8F"
            iconsColor="#727A8F"
            fontColor="#727A8F"
            backgroundColor="rgba(142,142,147,0.24)"
          // backgroundColor="#F1F1F1"
            borderColor="transparent"
            placeHolderText="Start typing to search"
            onChangeText={this.onChangeText}
          />
        </View>
        <View style={{
            // height: 26,
            // flex: 1,
            // overflow: 'hidden',
            backgroundColor: '#F1F1F1',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#C0C1C6',
          }}
        >
          <SalonFlatPicker
            selectedIndex={this.state.activeTab}
            onItemPress={this.onPressTab}
            rootStyle={{
              flex: 0,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
            containerStyle={{ backgroundColor: 'white' }}
            selectedColor="#115ECD"
            unSelectedTextColor="#115ECD"
            dataSource={['Providers', 'Resources', 'Rooms', 'Desk Staff']}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {this.renderActiveTab()}
        </View>
      </View>
    );
  }

  _handleOnChangeProvider = (provider) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeProvider, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeProvider) { onChangeProvider(provider); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }
}
