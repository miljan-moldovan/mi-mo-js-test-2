import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { get } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import getEmployeePhotoSource from '../../utilities/helpers/getEmployeePhotoSource';
import WordHighlighter from '../../components/wordHighlighter';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonFlatPicker from '../../components/SalonFlatPicker';
import SalonAvatar from '../../components/SalonAvatar';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import OthersTab from './components/OthersTab';
import DeskStaffTab from './components/DeskStaffTab';
import { InputButton, DefaultAvatar } from '../../components/formHelpers';
import SalonHeader from '../../components/SalonHeader';
import styles from './style';

const TAB_PROVIDERS = 0;
const TAB_DESK_STAFF = 1;
const TAB_OTHERS = 2;

const ViewAllProviders = ({
  icon, onPress, isSelected, separator,
}) => (
  <React.Fragment>
    <InputButton
      icon={icon}
      style={styles.viewAllButton}
      onPress={onPress}
      label="View all providers"
      labelStyle={isSelected ? [styles.rowText, styles.boldText] : styles.rowText}
    />
    {separator}
  </React.Fragment>
);

export default class FilterOptionsScreen extends React.Component<any, any> {
  static navigationOptions = rootProps => ({
    header: (
      <SalonHeader
        title="Filter Options"
        headerLeft={
          <SalonTouchableOpacity
            style={styles.styleForTouchable}
            wait={3000}
            onPress={() => rootProps.navigation.state.params.handleReset()}
          >
            <Text style={styles.textHeader}>
              Back
            </Text>
          </SalonTouchableOpacity>
        }
      />
    ),
  });

  constructor(props) {
    super(props);

    const {
      selectedFilter,
    } = this.props.apptScreenState;
    let activeTab = TAB_PROVIDERS;
    switch (selectedFilter) {
      case 'deskStaff':
        activeTab = TAB_DESK_STAFF;
        break;
      case 'rooms':
      case 'resources':
        activeTab = TAB_OTHERS;
        break;
      case 'providers':
      default:
        break;
    }
    this.state = {
      activeTab,
      searchText: '',
    };

    this.props.navigation.setParams({ handleReset: this.handleReset });
  }

  componentWillMount() {
    this.props.servicesActions.getServices();
    this.onRefresh();
  }

  onPressTab = (ev, index) => {
    this.setState({ activeTab: index });
  };

  onRefresh = () => {
    this.props.providersActions.getProviders({
      filterRule: 3,
      maxCount: 100,
      sortOrder: 1,
      sortField: 'FirstName,LastName',
    });
  };

  handleReset = () => {
    this.handleChangeProvider('all');
  };

  handleChangeProvider = (provider) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeFilter, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeFilter) { onChangeFilter('providers', provider); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  };

  handleChangeDeskStaff = (provider) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeFilter, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeFilter) { onChangeFilter('deskStaff', provider); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  };

  handleChangeOther = (filter) => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeFilter, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeFilter) { onChangeFilter(filter); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  };

  filterProviders = (searchText) => {
    this.setState({ searchText });

    const matches = this.props.providersState.providers.filter(item =>
      item.fullName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);

    this.props.providersActions.setFilteredProviders(matches);
  };

  renderActiveTab = () => {
    const { selectedFilter, selectedProvider } = this.props.apptScreenState;
    const changeFilter = () => this.handleChangeProvider('all');
    const isViewAllSelected = selectedFilter === 'providers';
    const icon = isViewAllSelected && selectedProvider === 'all'
      ? <FontAwesome style={styles.greenColor}>{Icons.checkCircle}</FontAwesome> : null;
    switch (this.state.activeTab) {
      case TAB_PROVIDERS:
        return (
          <View style={styles.container}>
            <ViewAllProviders
              icon={icon}
              onPress={changeFilter}
              separator={this.renderSeparator()}
              isSelected={isViewAllSelected}
            />
            {
              this.props.providersState.isLoading
                ? (
                  <View style={styles.fullSizeCenter}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <FlatList
                    data={this.props.providersState.currentData}
                    ItemSeparatorComponent={this.renderSeparator}
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
      case TAB_DESK_STAFF:
        return (
          <DeskStaffTab
            selectedFilter={selectedFilter}
            selectedProvider={selectedProvider}
            searchText={this.state.searchText}
            onRefresh={this.onRefresh}
            isLoading={this.props.providersState.isLoading}
            data={this.props.providersState.currentDeskStaffData}
            handleSelect={this.handleChangeDeskStaff}
          />
        );
      case TAB_OTHERS:
        return (
          <OthersTab
            selectedFilter={selectedFilter}
            handleSelect={this.handleChangeOther}
            showResources={this.props.showResources}
          />
        );
      default:
        break;
    }

    return null;
  };

  renderItem = ({ item, index }) => {
    const { selectedFilter, selectedProvider } = this.props.apptScreenState;
    const isViewAllSelected = selectedFilter === 'providers' && selectedProvider === 'all';
    const isSelected = (selectedFilter === 'providers' || selectedFilter === 'deskStaff')
      && get(selectedProvider, 'id', null) === item.id;
    const onPress = () => this.handleChangeProvider(item);
    return (
      <SalonTouchableOpacity
        style={styles.itemRow}
        onPress={onPress}
        key={item.id}
      >
        <View style={styles.inputRow}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={30}
            borderWidth={1}
            borderColor="transparent"
            image={getEmployeePhotoSource(item)}
            defaultComponent={
              <DefaultAvatar
                provider={item}
              />
            }
          />
          <WordHighlighter
            highlight={this.state.searchText}
            style={isSelected || isViewAllSelected ? [styles.providerName, styles.boldText] : styles.providerName}
            highlightStyle={styles.greenColor}
          >
            {item.fullName}
          </WordHighlighter>
        </View>
        {
          isSelected &&
          <FontAwesome style={styles.greenColor}>{Icons.checkCircle}</FontAwesome>
        }
      </SalonTouchableOpacity>
    );
  };

  renderSeparator = () => <View style={styles.styleSeparator}/>;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SalonSearchBar
            placeholderTextColor="#727A8F"
            iconsColor="#727A8F"
            fontColor="#727A8F"
            backgroundColor="rgba(142,142,147,0.24)"
            borderColor="transparent"
            placeHolderText="Start typing to search"
            onChangeText={(text) => {
              this.filterProviders(text);
            }}
          />
        </View>
        <View style={styles.containerForFlatPicker}>
          <SalonFlatPicker
            selectedIndex={this.state.activeTab}
            onItemPress={this.onPressTab}
            rootStyle={styles.rootStyle}
            containerStyle={{ backgroundColor: 'white' }}
            selectedColor="#115ECD"
            unSelectedTextColor="#115ECD"
            dataSource={['Providers', 'Desk Staff', 'Others']}
          />
        </View>
        <View style={styles.containerForTab}>
          {this.renderActiveTab()}
        </View>
      </View>
    );
  }
}
