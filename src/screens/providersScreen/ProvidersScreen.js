import * as React from 'react';
import {View, Text, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {get, includes, isFunction, isArray, map, filter, find} from 'lodash';
import PropTypes from 'prop-types';
import {
  getEmployeePhotoSource,
} from '../../utilities/helpers/getEmployeePhotoSource';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonAvatar from '../../components/SalonAvatar';
import WordHighlighter from '../../components/wordHighlighter';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {DefaultAvatar, InputDivider} from '../../components/formHelpers';
import LoadingOverlay from '../../components/LoadingOverlay';

import Colors from '../../constants/Colors';
import styles from './styles';
import SalonHeader from '../../components/SalonHeader';
import SalonListItem from '@/components/common/SalonListItem';
import SalonFlatList from '@/components/common/SalonFlatList';

const FirstAvailableRow = props => {
  const firstAvProvider = {
    id: 0,
    isFirstAvailable: true,
    name: 'First',
    lastName: 'Available',
  };
  const style = {paddingLeft: 16};
  const onPress = () => props.onPress (firstAvProvider);
  return (
    <SalonTouchableOpacity
      onPress={onPress}
      style={style}
      key="firstAvailableRow"
    >
      <View style={styles.inputRow}>
        <DefaultAvatar size={22} fontSize={9} provider={firstAvProvider} />
        <Text style={styles.providerName}>First Available</Text>
      </View>
    </SalonTouchableOpacity>
  );
};

class ProviderScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const defaultProps = navigation.state.params &&
      navigation.state.params.defaultProps
      ? navigation.state.params.defaultProps
      : {
          title: 'Providers',
          subTitle: null,
          leftButtonOnPress: navigation.goBack,
          leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
        };

    const ignoreNav = navigation.state.params
      ? navigation.state.params.ignoreNav
      : false;
    const {leftButton} = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav
      ? navigation.state.params.headerProps
      : {leftButton: defaultProps.leftButton};
    const {rightButton} = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav
      ? navigation.state.params.headerProps
      : {rightButton: defaultProps.rightButton};
    const {leftButtonOnPress} = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav
      ? navigation.state.params.headerProps
      : {leftButtonOnPress: defaultProps.leftButtonOnPress};
    const {rightButtonOnPress} = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav
      ? navigation.state.params.headerProps
      : {rightButtonOnPress: defaultProps.rightButtonOnPress};

    const {title} = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav
      ? navigation.state.params.headerProps
      : {title: defaultProps.title};
    const {subTitle} = navigation.state.params &&
      navigation.state.params.headerProps &&
      !ignoreNav
      ? navigation.state.params.headerProps
      : {subTitle: defaultProps.subTitle};
    let customLeftButton = false;
    if (navigation.state.params) {
      if (
        navigation.state.params.headerProps &&
        navigation.state.params.headerProps.leftButtonOnPress
      ) {
        customLeftButton = true;
      }
    }
    const headerLeftOnPress = customLeftButton
      ? () => leftButtonOnPress (navigation)
      : leftButtonOnPress;
    return {
      header: (
        <SalonHeader
          title={title}
          subTitle={subTitle || null}
          headerLeft={
            <SalonTouchableOpacity
              style={styles.leftHeaderButton}
              onPress={headerLeftOnPress}
            >
              {leftButton}
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor (props) {
    super (props);
    if (this.params.selectedService) {
      props.providersActions.setSelectedService (this.params.selectedService);
    }
    if (this.params.selectedProvider) {
      props.providersActions.setSelectedProvider (this.params.selectedProvider);
    }
    this.state = {
      refreshing: false,
      searchText: '',
      headerProps: {
        title: 'Providers',
        subTitle: null,
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
        leftButtonOnPress: props.navigation.goBack,
      },
    };

    this.props.settingsActions.getSettings ();
  }

  componentDidMount () {
    this.props.navigation.setParams ({defaultProps: this.state.headerProps});
    this.onRefresh ();
  }

  onChangeSearchText = searchText => this.setState ({searchText});

  onRefresh = () => {
    const {selectedService, queueItem} = this.params;
    const {
      providersActions: {
        getProviders,
        getReceptionists,
        getQueueEmployees,
        getQuickQueueEmployees,
      },
    } = this.props;

    const req = {
      filterRule: 3,
      maxCount: 1000,
      sortOrder: 1,
      sortField: 'FirstName,LastName',
    };

    switch (this.mode) {
      case 'queue':
        getQueueEmployees (req);
        break;
      case 'quickQueue':
        getQueueEmployees (req);
        getQuickQueueEmployees ({...req, queueItemId: queueItem.id});
        break;
      case 'receptionists':
        getReceptionists ({
          ...req,
          sortField: 'Name,LastName',
        });
        break;
      case 'employees':
      default:
        getProviders (req, selectedService);
        break;
    }
  };

  get currentData () {
    const {
      providersState: {employees, providers, currentData: allProviders},
      queueList,
      receptionistList,
      quickQueueEmployees,
    } = this.props;
    const {searchText} = this.state;
    const {filterList} = this.params;
    // if (this.props.navigation.state.routeName !== 'ModalProviders') {
    //   return currentData;
    // }

    let currentData = [];
    switch (this.mode) {
      case 'queue':
        currentData = queueList;
        break;
      case 'quickQueue':
        let filtereQueueList = queueList;

        const {settings} = this.props.settingsState;
        let ShowOnlyClockedInEmployeesInClientQueue = find (settings, {
          settingName: 'ShowOnlyClockedInEmployeesInClientQueue',
        });
        ShowOnlyClockedInEmployeesInClientQueue = ShowOnlyClockedInEmployeesInClientQueue
          ? ShowOnlyClockedInEmployeesInClientQueue.settingValue
          : false;

        if (ShowOnlyClockedInEmployeesInClientQueue) {
          filtereQueueList = filtereQueueList.length > 0
            ? filtereQueueList.filter (item => item.state.isClockedIn === true)
            : filtereQueueList;

          const filteredIds = map (filtereQueueList, 'id');
          currentData = filter (quickQueueEmployees, p =>
            includes (filteredIds, p.id)
          );
        } else {
          currentData = quickQueueEmployees;
        }

        break;
      case 'receptionists':
        currentData = receptionistList;
        break;
      case 'providers':
        currentData = providers;
        break;
      case 'employees':
      default:
        currentData = allProviders;
        break;
    }
    if (isArray (filterList) && filterList.length > 0) {
      currentData = currentData.filter (itm => includes (filterList, itm.id));
    }
    return searchText.length > 0
      ? currentData.filter (employee => {
          const isProviderFoundByName = [
            employee.name,
            employee.lastName,
            employee.middleName,
          ]
            .filter (item => !!item)
            .map (item => item.toLowerCase ())
            .some (item => item.indexOf (searchText.toLowerCase ()) >= 0);
          return isProviderFoundByName || employee.code === searchText;
        })
      : currentData;
  }

  get mode () {
    if (this.params.queueList) {
      return 'queue';
    }
    return this.params.mode || 'employees';
  }

  get params () {
    const {navigation: {state}} = this.props;
    const params = state.params || {};
    const showFirstAvailable = get (params, 'showFirstAvailable', true);
    const checkProviderStatus = get (params, 'checkProviderStatus', false);
    const showEstimatedTime = get (params, 'showEstimatedTime', true);
    const selectedService = get (params, 'selectedService', null);
    const queueItem = get (params, 'queueItem', null);
    const filterList = get (params, 'filterList', false);
    const selectedProvider = get (params, 'selectedProvider', null);
    const onChangeProvider = get (params, 'onChangeProvider', null);
    const onChangeWithNavigation = get (params, 'onChangeWithNavigation', null);
    const dismissOnSelect = get (params, 'dismissOnSelect', null);
    const queueList = get (params, 'queueList', false);
    const mode = get (params, 'mode', false);
    return {
      mode,
      queueList,
      filterList,
      dismissOnSelect,
      selectedService,
      queueItem,
      onChangeProvider,
      selectedProvider,
      showEstimatedTime,
      showFirstAvailable,
      checkProviderStatus,
      onChangeWithNavigation,
    };
  }

  getItemLayout = (data, index) => ({
    length: 43,
    offset: (43 + StyleSheet.hairlineWidth) * index,
    index,
  });

  getFirstItemForLetter = letter => {
    const {currentData} = this.props.providersState;
    for (let i = 0; i < currentData.length; i += 1) {
      if (currentData[i].fullName.indexOf (letter) === 0) {
        return i;
      }
    }
    return false;
  };

  scrollToIndex = index => {
    this.flatListRef.scrollToIndex ({animated: true, index});
  };

  handleOnChangeProvider = async provider => {
    const {
      dismissOnSelect,
      onChangeProvider,
      onChangeWithNavigation,
    } = this.params;
    const {providersActions, navigation} = this.props;
    providersActions.setSelectedProvider (provider);
    if (isFunction (onChangeWithNavigation)) {
      onChangeWithNavigation (provider, navigation);
    } else if (isFunction (onChangeProvider)) {
      onChangeProvider (provider);
      if (dismissOnSelect) {
        navigation.goBack ();
      }
    }
  };

  renderItem = ({item, index}) => {
    const {selectedProvider, showEstimatedTime} = this.params;
    const {searchText} = this.state;
    const image = getEmployeePhotoSource (item);

    const checked =
      selectedProvider &&
      (selectedProvider.id === item.id ||
        get (selectedProvider, 'fullName', '').toLowerCase () ===
          get (item, 'fullName', '').toLowerCase ());

    const highlightStyle = checked
      ? [styles.providerName, styles.selectedGreen]
      : styles.providerName;
    const icons = checked
      ? [
          {
            name: 'checkCircle',
            type: 'solid',
            color: Colors.selectedGreen,
          },
        ]
      : [];
    const onPress = () => this.handleOnChangeProvider (item);
    return (
      <SalonListItem
        key={`provider_${item.id}`}
        icons={icons}
        onPress={onPress}
      >
        <View style={styles.inputRow}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={22}
            borderWidth={1}
            borderColor="transparent"
            image={image}
            defaultComponent={
              <DefaultAvatar size={22} fontSize={9} provider={item} />
            }
          />
          <WordHighlighter
            highlight={searchText}
            style={highlightStyle}
            highlightStyle={styles.selectedGreen}
          >
            {item.fullName}
          </WordHighlighter>
        </View>
        <View style={styles.estimatedTimeContainer}>
          {
            // showEstimatedTime &&
            // <Text style={styles.timeLeftText}>21m</Text> // TODO: Add estimated time text
          }
        </View>
      </SalonListItem>
    );
  };

  renderSeparator = () => <InputDivider />;

  render () {
    const {showFirstAvailable} = this.params;
    return (
      <View style={styles.container}>
        {this.props.providersState.isLoading && <LoadingOverlay />}
        <SalonSearchBar
          backgroundColor={Colors.searchBarBackground}
          fontColor={Colors.defaultGrey}
          iconsColor={Colors.defaultGrey}
          placeholderTextColor={Colors.defaultGrey}
          containerColor={Colors.lightGrey}
          placeHolderText="Search"
          borderColor="transparent"
          containerStyle={styles.searchBarContainer}
          onChangeText={this.onChangeSearchText}
        />

        {showFirstAvailable &&
          <React.Fragment>
            <FirstAvailableRow onPress={this.handleOnChangeProvider} />
            <InputDivider fullWidth={!this.currentData.length} />
          </React.Fragment>}
        <SalonFlatList
          data={this.currentData}
          renderItem={this.renderItem}
          getItemLayout={this.getItemLayout}
          ref={ref => {
            this.flatListRef = ref;
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}
ProviderScreen.propTypes = {
  queueList: PropTypes.node.isRequired,
  quickQueueEmployees: PropTypes.array.isRequired,
  receptionistList: PropTypes.array.isRequired,
  providersState: PropTypes.shape ({
    employees: PropTypes.array,
    providers: PropTypes.array,
    currentData: PropTypes.array,
    receptionists: PropTypes.array,
    queueEmployees: PropTypes.array,
  }).isRequired,
  providersActions: PropTypes.shape ({
    getProviders: PropTypes.func,
    getReceptionists: PropTypes.func,
    getQueueEmployees: PropTypes.func,
    getQuickQueueEmployees: PropTypes.func,
    setSelectedService: PropTypes.func,
    setSelectedProvider: PropTypes.func,
  }).isRequired,
};
export default ProviderScreen;
