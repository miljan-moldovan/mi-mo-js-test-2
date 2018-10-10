import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get, includes, isArray } from 'lodash';
import PropTypes from 'prop-types';
import { getEmployeePhotoSource } from '../../utilities/helpers/getEmployeePhotoSource';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonAvatar from '../../components/SalonAvatar';
import WordHighlighter from '../../components/wordHighlighter';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import { DefaultAvatar } from '../../components/formHelpers';
import LoadingOverlay from '../../components/LoadingOverlay';
import groupedSettingsSelector from '../../redux/selectors/settingsSelector';

import Colors from '../../constants/Colors';
import styles from './styles';

const FirstAvailableRow = (props) => {
  const firstAvProvider = {
    id: 0,
    isFirstAvailable: true,
    name: 'First',
    lastName: 'Available',
  };
  const onPress = () => props.onPress(firstAvProvider);
  return (
    <SalonTouchableOpacity
      onPress={onPress}
      style={styles.itemRow}
      key="firstAvailableRow"
    >
      <View style={styles.inputRow}>
        <DefaultAvatar
          size={22}
          fontSize={9}
          provider={firstAvProvider}
        />
        <Text style={styles.providerName}>First Available</Text>
      </View>
    </SalonTouchableOpacity>
  );
};

class ProviderScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const defaultProps = navigation.state.params && navigation.state.params.defaultProps
      ? navigation.state.params.defaultProps : {
        title: 'Providers',
        subTitle: null,
        leftButtonOnPress: navigation.goBack,
        leftButton: <Text style={styles.leftButtonText}>Cancel</Text>,
      };

    const ignoreNav = navigation.state.params ? navigation.state.params.ignoreNav : false;
    const { leftButton } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav
      ? navigation.state.params.headerProps : { leftButton: defaultProps.leftButton };
    const { rightButton } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav
      ? navigation.state.params.headerProps : { rightButton: defaultProps.rightButton };
    const { leftButtonOnPress } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav
      ? navigation.state.params.headerProps : { leftButtonOnPress: defaultProps.leftButtonOnPress };
    const { rightButtonOnPress } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav
      ? navigation.state.params.headerProps
      : { rightButtonOnPress: defaultProps.rightButtonOnPress };

    const { title } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav
      ? navigation.state.params.headerProps : { title: defaultProps.title };
    const { subTitle } = navigation.state.params &&
      navigation.state.params.headerProps && !ignoreNav
      ? navigation.state.params.headerProps : { subTitle: defaultProps.subTitle };
    let customLeftButton = false;
    if (navigation.state.params) {
      if (
        navigation.state.params.headerProps && navigation.state.params.headerProps.leftButtonOnPress
      ) {
        customLeftButton = true;
      }
    }
    const headerLeftOnPress = customLeftButton
      ? () => leftButtonOnPress(navigation) : leftButtonOnPress;
    return {
      headerTitle: (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subTitle ? <Text style={styles.headerSubTitle}>{subTitle}</Text> : null}
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.leftHeaderButton} onPress={headerLeftOnPress}>
          {leftButton}
        </SalonTouchableOpacity>
      ),
      headerRight: null,
    };
  };

  constructor(props) {
    super(props);
    if (this.params.selectedService) {
      props.providersActions.setSelectedService(this.params.selectedService);
    }
    if (this.params.selectedProvider) {
      props.providersActions.setSelectedProvider(this.params.selectedProvider);
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
  }

  componentDidMount() {
    this.props.navigation.setParams({ defaultProps: this.state.headerProps });
    this.onRefresh();
  }

  onChangeSearchText = searchText => this.setState({ searchText });

  onRefresh = () => {
    const { filterList, selectedService, queueItem } = this.params;
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
        getQueueEmployees(req);
        break;
      case 'quickQueue':
        getQuickQueueEmployees({ ...req, queueItemId: queueItem.id });
        break;
      case 'receptionists':
        getReceptionists({
          ...req,
          sortField: 'Name,LastName',
        });
        break;
      case 'employees':
      default:
        getProviders(req, selectedService, []);
        break;
    }
  }

  get currentData() {
    const {
      providersState: {
        employees,
        providers,
        currentData: allProviders,
      },
      queueList,
      receptionistList,
      quickQueueEmployees,
    } = this.props;
    const { searchText } = this.state;
    const { filterList } = this.params;
    // if (this.props.navigation.state.routeName !== 'ModalProviders') {
    //   return currentData;
    // }


    let currentData = [];
    switch (this.mode) {
      case 'queue':
        currentData = queueList;
        break;
      case 'quickQueue':
        currentData = quickQueueEmployees;
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
    return (
      (isArray(filterList) && filterList.length > 0) ||
      searchText.length > 0
    ) ? currentData.filter((employee) => {
        const isProviderFoundByName = [employee.name, employee.lastName, employee.middleName]
          .filter(item => !!item)
          .map(item => item.toLowerCase())
          .some(item => item.indexOf(searchText.toLowerCase()) >= 0);


        if (isArray(filterList) && filterList.length > 0 && !includes(filterList, employee.id)) {
          return false;
        }
        return isProviderFoundByName || employee.code === searchText;
      }) : currentData;
  }

  get mode() {
    if (this.params.queueList) {
      return 'queue';
    }
    return this.params.mode || 'employees';
  }

  get params() {
    const { navigation: { state } } = this.props;
    const params = state.params || {};
    const showFirstAvailable = get(params, 'showFirstAvailable', true);
    const checkProviderStatus = get(params, 'checkProviderStatus', false);
    const showEstimatedTime = get(params, 'showEstimatedTime', true);
    const selectedService = get(params, 'selectedService', null);
    const queueItem = get(params, 'queueItem', null);
    const filterList = get(params, 'filterList', false);
    const selectedProvider = get(params, 'selectedProvider', null);
    const onChangeProvider = get(params, 'onChangeProvider', null);
    const dismissOnSelect = get(params, 'dismissOnSelect', null);
    const queueList = get(params, 'queueList', false);
    const mode = get(params, 'mode', false);
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
    };
  }

  getItemLayout = (data, index) => (
    { length: 43, offset: (43 + StyleSheet.hairlineWidth) * index, index }
  )

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

  handleOnChangeProvider = async (provider) => {
    const {
      dismissOnSelect,
      onChangeProvider,
    } = this.params;
    const {
      providersActions,
      navigation: { goBack },
    } = this.props;
    providersActions.setSelectedProvider(provider);
    onChangeProvider(provider);
    if (dismissOnSelect) { goBack(); }
  }

  renderItem = ({ item, index }) => {
    const {
      selectedProvider,
      showEstimatedTime,
    } = this.params;
    const { searchText } = this.state;
    const image = getEmployeePhotoSource(item);


    const highlightStyle = selectedProvider === item.id
      ? [styles.providerName, styles.selectedGreen] : styles.providerName;
    return (
      <SalonTouchableOpacity
        style={styles.itemRow}
        onPress={() => this.handleOnChangeProvider(item)}
        key={index}
      >
        <View style={styles.inputRow}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={22}
            borderWidth={1}
            borderColor="transparent"
            image={image}
            defaultComponent={(
              <DefaultAvatar
                size={22}
                fontSize={9}
                provider={item}
              />
            )}
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
        <View style={styles.selectedIconContainer}>
          {
            selectedProvider === item.id &&
            <FontAwesome style={styles.selectedGreen}>{Icons.checkCircle}</FontAwesome>
          }
        </View>
      </SalonTouchableOpacity>
    );
  };

  renderSeparator = () => <View style={styles.listItemSeparator} />

  render() {
    const { showFirstAvailable } = this.params;
    return (
      <View style={styles.container}>
        {
          this.props.providersState.isLoading &&
          <LoadingOverlay />
        }
        <SalonSearchBar
          backgroundColor={Colors.searchBarBackground}
          fontColor={Colors.defaultGrey}
          iconsColor={Colors.defaultGrey}
          placeholderTextColor={Colors.defaultGrey}
          placeHolderText="Search"
          borderColor="transparent"
          containerStyle={styles.searchBarContainer}
          onChangeText={this.onChangeSearchText}
        />

        <View style={styles.flexRow}>
          <View style={styles.fullSizeColumn}>
            {
              showFirstAvailable &&
              <React.Fragment>
                <FirstAvailableRow onPress={this.handleOnChangeProvider} />
                {this.renderSeparator()}
              </React.Fragment>
            }
            <FlatList
              style={styles.whiteBackground}
              data={this.currentData}
              renderItem={this.renderItem}
              getItemLayout={this.getItemLayout}
              ref={(ref) => { this.flatListRef = ref; }}
              ItemSeparatorComponent={this.renderSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
ProviderScreen.propTypes = {
  queueList: PropTypes.node.isRequired,
  quickQueueEmployees: PropTypes.array.isRequired,
  receptionistList: PropTypes.array.isRequired,
  providersState: PropTypes.shape({
    employees: PropTypes.array,
    providers: PropTypes.array,
    currentData: PropTypes.array,
    receptionists: PropTypes.array,
    queueEmployees: PropTypes.array,
  }).isRequired,
  providersActions: PropTypes.shape({
    getProviders: PropTypes.func,
    getReceptionists: PropTypes.func,
    getQueueEmployees: PropTypes.func,
    getQuickQueueEmployees: PropTypes.func,
    setSelectedService: PropTypes.func,
    setSelectedProvider: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  groupedSettings: groupedSettingsSelector(state),
});

export default connect(mapStateToProps, null)(ProviderScreen);
