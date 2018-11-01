// @flow
import React from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { bindActionCreators } from 'redux';
import { TabView, TabBar } from 'react-native-tab-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import styles from './styles';
import * as actions from '../../actions/queue';
import settingsActions from '../../actions/settings';
import checkinActions from '../../actions/checkin';
import serviceActions from '../../actions/service';
import walkInActions from '../../actions/walkIn';
import clientsActions from '../../actions/clients';
import Queue from './queue';
import QueueHeader from './queueHeader';
import Icon from '../../components/UI/Icon';
import SalonModal from '../../components/SalonModal';
import SalonTextInput from '../../components/SalonTextInput';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Colors from '../../constants/Colors';

const walkoutImage = require('../../assets/images/walkoutModal/icon_walkout.png');

const WAITING = '0';
const SERVICED = '1';
const SEARCH_CLIENTS = 'clients';
const SEARCH_PROVIDERS = 'providers';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class QueueScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const {
      shouldShow = false, searchMode, searchText, onChangeSearchMode, onChangeSearchText,
    } = params;
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: Colors.defaultBlue }}>
          <QueueHeader
            navigation={navigation}
            onChangeSearchMode={onChangeSearchMode}
            onChangeSearchText={onChangeSearchText}
            searchMode={searchMode}
            searchText={searchText}
          />
        </SafeAreaView>
      ),
      tabBarVisible: true,
      gesturesEnabled: false,
    };
  }

  constructor(props) {
    super(props);
    this.animateText();
  }

  state = {
    index: '0',
    isWalkoutVisible: false,
    walkoutText: '',
    searchMode: false,
    searchText: '',
    searchType: '',
    searchWaitingCount: 0,
    searchServiceCount: 0,
    newAppointment: {
      service: null,
      client: null,
      provider: null,
    },
    routes: [
      { key: WAITING, title: 'Waiting' },
      { key: SERVICED, title: 'In Service' },
    ],
    colorAnimActive: new Animated.Value(0),
    colorAnimInactive: new Animated.Value(0),
    receiveQueueRetries: 0,
  }

  componentWillMount() {
    this.loadQueueData();

    // this.props.actions.getQueueEmployees();
    this.props.settingsActions.getSettings();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onChangeSearchMode: this.onChangeSearchMode,
      onChangeSearchText: this.onChangeSearchText,
      searchMode: this.state.searchMode,
      searchText: this.state.searchText,
    });
  }

  onChangeSearchMode = (searchMode) => {
    this.setState({ searchMode, searchType: searchMode ? SEARCH_CLIENTS : '', searchText: '' }, () => this.props.navigation.setParams({ searchMode, searchText: '' }));
  }
  onChangeSearchText = (searchText) => {
    this.setState({ searchText }, () => this.props.navigation.setParams({ searchText }));
  }

  onTabPress = ({ route }) => {
    this.setState({ index: route.key }, this.animateText);
  }

  loadQueueData = (showError = false) => {
    this.props.actions.getQueueState();
    this.props.actions.receiveQueue(this.receiveQueueFinished, showError);
  }


  receiveQueueFinished = (result, error) => {
    if (!result && error) {
      setTimeout(() => {
        const showError = this.state.receiveQueueRetries > 1;
        this.loadQueueData(showError, showError);
        this.setState({ receiveQueueRetries: this.state.receiveQueueRetries + 1 });
      }, 300);
    } else {
      this.setState({ receiveQueueRetries: 0 });
    }
  }

  handleSearchClients = () => {
    this.setState({ searchType: SEARCH_CLIENTS });
  }
  handleSearchProviders = () => {
    this.setState({ searchType: SEARCH_PROVIDERS });
  }

  updateSearchWaitingCount = searchWaitingCount => this.setState({ searchWaitingCount });
  updateSearchServiceCount = searchServiceCount => this.setState({ searchServiceCount });

  handleIndexChange = (index) => {
    this.setState({ index });
  };

  handleWalkInPress = () => {
    const { navigate } = this.props.navigation;
    this.setState({
      newAppointment: {
        client: null,
        service: null,
        provider: null,
      },
    });
    navigate('ModalClients', {
      onChangeClient: this.handleChangeClient,
      transition: 'SlideFromBottom',
      isModal: true,
      isWalkin: true,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 1 of 3',
        leftButton: (
          <View style={styles.backContainer}>
            <FontAwesome style={styles.backIcon}>{Icons.angleLeft}</FontAwesome>
            <Text style={styles.leftButtonText}>Cancel</Text>
          </View>
        ),
        leftButtonOnPress: (navigation) => {
          navigation.goBack();
          this.loadQueueData();
        },
      },
    });
  }

  handleChangeClient = (client) => {
    const { newAppointment } = this.state;
    newAppointment.client = client;
    this.setState({ newAppointment });
    this.props.navigation.navigate('ModalServices', {
      onChangeService: this.handleChangeService,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 2 of 3',
        leftButton: (
          <View style={styles.backContainer}>
            <FontAwesome style={styles.backIcon}>{Icons.angleLeft}</FontAwesome>
            <Text style={styles.leftButtonText}>Back</Text>
          </View>
        ),
        leftButtonOnPress: (navigation) => { navigation.goBack(); },
        rightButton: (
          <View style={styles.rightContainer}>
            <Text style={styles.leftButtonText}>Cancel</Text>
          </View>
        ),
        rightButtonOnPress: (navigation) => { navigation.navigate('Main'); },
      },
    });
  }

  handleChangeProvider = (provider) => {
    const { newAppointment } = this.state;
    newAppointment.provider = provider;
    this.setState({ newAppointment });
    this.props.navigation.navigate('ModalWalkIn', { newAppointment, loadQueueData: this.loadQueueData });
  }

  handleChangeService = (service) => {
    const { newAppointment } = this.state;
    newAppointment.service = service;
    this.setState({ newAppointment });

    this.props.serviceActions.setSelectedService({ id: service.id });
    this.props.navigation.navigate('ModalProviders', {
      queueList: true,
      selectedService: service,
      checkProviderStatus: true,
      onChangeProvider: this.handleChangeProvider,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 3 of 3',
        leftButton: (
          <View style={styles.backContainer}>
            <FontAwesome style={styles.backIcon}>{Icons.angleLeft}</FontAwesome>
            <Text style={styles.leftButtonText}>Back</Text>
          </View>
        ),
        leftButtonOnPress: (navigation) => { navigation.goBack(); },
      },
    });
  }

  handleWalkOutPress = () => {
    this.setState({ isWalkoutVisible: true });
  }

  closeWalkOut = () => {
    this.setState({ isWalkoutVisible: false });
  }

  handleWalkOutTextChange = (ev) => {
    this.setState({ walkoutText: ev.nativeEvent.text });
  };

  animateText = () => {
    Animated.loop(Animated.timing(this.state.colorAnimActive, {
      toValue: 200,
      duration: 2000,
    }), { iterations: 1 }).start();

    Animated.loop(Animated.timing(this.state.colorAnimInactive, {
      toValue: 200,
      duration: 2000,
    }), { iterations: 1 }).start();
  }


  searchWaitingRef = null;
  searchServicingRef = null;


  renderLabel = () => ({ route }) => {
    const focused = this.state.index.toString() === route.key.toString();

    const interpolateColorActive = this.state.colorAnimActive.interpolate({
      inputRange: [0, 200],
      outputRange: ['#FFFFFF', '#1963CE'],
    });

    const interpolateColorInactive = this.state.colorAnimInactive.interpolate({
      inputRange: [0, 200],
      outputRange: ['#1963CE', '#FFFFFF'],
    });
    const colorStyle = { color: focused ? interpolateColorActive : interpolateColorInactive };
    return (
      <View style={styles.tabLabelContainer}>
        <View style={[styles.tabQueueCounter, focused ? null : { backgroundColor: '#0C4699' }]}>
          <Animated.Text style={[styles.tabQueueCounterText, colorStyle]}>
            {route.key === WAITING ?
              this.props.waitingQueue.length : this.props.serviceQueue.length}
          </Animated.Text>
        </View>
        <Animated.Text style={[styles.animatedText, colorStyle]}>
          {route.title}
        </Animated.Text>
      </View>
    );
  };


  renderBar = (props) => {
    const { guestWaitMins } = this.props.queueState ? this.props.queueState : {};
    let waitTime = '-';
    if (guestWaitMins > 0) {
      waitTime = `${guestWaitMins}`;
    } else if (guestWaitMins === 0) {
      waitTime = '0';
    }
    const containerStyle = {
      width: initialLayout.width === 320 ? 200 : 240,
      marginLeft: initialLayout.width === 320 ? 10 : 12,
    };
    const tabStyle = { width: initialLayout.width === 320 ? 100 : 120 };
    return (
      <View>
        <TabBar
          {...props}
          tabStyle={[styles.tab, tabStyle]}
          style={[styles.tabContainer, containerStyle]}
          renderLabel={this.renderLabel(props)}
          indicatorStyle={styles.indicator}
          onTabPress={this.onTabPress}
        />
        <View style={styles.summaryBar}>
          <Text style={styles.summaryBarTextLeft}>
            <Text style={styles.summaryBarTextLeftEm}>{this.props.queueLength}</Text> CLIENTS TODAY
          </Text>
          <Text style={styles.summaryBarTextRight}>
            <Text style={styles.summaryBarTextRightEm}>{`${waitTime}m`}</Text> Est. Wait
          </Text>
        </View>
      </View>
    );
  }

  renderScene = ({ route }) => {
    const {
      navigation, waitingQueue, serviceQueue, groups, loading,
    } = this.props;
    switch (route.key) {
      case WAITING:
        return (
          <Queue
            {...this.props}
            data={waitingQueue}
            serviceQueue={serviceQueue}
            groups={groups}
            navigation={navigation}
            loading={loading}
            isWaiting
            loadQueueData={this.loadQueueData}
            error={this.props.error}
          />
        );
      case SERVICED:
        return (
          <Queue
            {...this.props}
            data={serviceQueue}
            groups={groups}
            navigation={navigation}
            loading={loading}
            loadQueueData={this.loadQueueData}
            error={this.props.error}
          />

        );
      default:
        return route;
    }
  }

  renderSearchResults = () => {
    const {
      navigation, waitingQueue, serviceQueue, groups, loading,
    } = this.props;
    const {
      searchType, searchWaitingCount, searchServiceCount, searchText: filterText,
    } = this.state;
    const p = {
      groups,
      navigation,
      loading,
      filterText,
      searchClient: searchType === SEARCH_CLIENTS,
      searchProvider: searchType === SEARCH_PROVIDERS,
    };

    return (
      <View style={[styles.container, { backgroundColor: '#f1f1f1' }]}>
        <KeyboardAwareScrollView>
          {!searchWaitingCount && !searchServiceCount ? (
            <View style={styles.searchEmpty}>
              <View style={styles.searchEmptyIconContainer}>
                <Icon name="search" style={styles.searchEmptyIcon} color="#E3E4E5" />
              </View>
              <Text style={styles.searchEmptyText}>
                Results matching
                <Text style={styles.notFoundText}>“{filterText}”</Text> were not found.
              </Text>
              <Text style={styles.searchEmptyTextSmall}>
                Check your spelling and try again or tap on one of the suggestions below
              </Text>
            </View>
          ) : null}
          <Queue
            isWaiting
            {...this.props}
            onChangeFilterResultCount={this.updateSearchWaitingCount}
            data={waitingQueue}
            loadQueueData={this.loadQueueData}
            headerTitle={searchWaitingCount || searchServiceCount ? 'Waiting' : undefined}
            {...p}
          />
          <Queue
            {...this.props}
            onChangeFilterResultCount={this.updateSearchServiceCount}
            data={serviceQueue}
            loadQueueData={this.loadQueueData}
            headerTitle={searchWaitingCount || searchServiceCount ? 'In Service' : undefined}
            {...p}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }

  render() {
    if (this.state.searchMode) { return this.renderSearchResults(); }

    return (
      <View style={styles.container}>
        <TabView
          style={styles.tabViewStyle}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderBar}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
        />
        {
          this.props.settings.data.SupressServiceForWalkIn ? null : (
            <SalonTouchableOpacity onPress={this.handleWalkInPress} style={styles.walkinButton}>
              <Text style={styles.walkinButtonText}>Walk-in</Text>
              <Icon style={styles.walkinButtonIcon} color="white" name="signIn" />
            </SalonTouchableOpacity>
          )
        }
        <SalonModal isVisible={this.state.isWalkoutVisible} closeModal={this.closeWalkOut}>
          <View style={styles.walkoutContainer}>
            <View style={styles.walkoutImageContainer}>
              <Image style={styles.walkoutImage} source={walkoutImage} />
            </View>
            <Text style={styles.walkoutText}>Walk-out reason:
              <Text style={styles.walkoutTextBold}>Other</Text>
            </Text>
            <View style={styles.walkoutTextContainer}>
              <SalonTextInput
                multiline
                placeholder="Please insert other reasons"
                placeholderColor="#0A274A"
                style={styles.walkoutInput}
                placeholderStyle={styles.walkoutPlaceholder}
                text={this.state.walkoutText}
                onChange={this.handleWalkOutTextChange}
              />
            </View>
            <View style={styles.walkoutButtonContainer}>
              <SalonTouchableOpacity
                onPress={this.closeWalkOut}
                style={styles.walkoutButtonCancel}
              >
                <Text style={styles.walkoutTextCancel}>Cancel</Text>
              </SalonTouchableOpacity>
              <SalonTouchableOpacity
                onPress={this.closeWalkOut}
                style={styles.walkoutButtonOk}
              >
                <Text style={styles.walkoutTextOk}>Ok</Text>
              </SalonTouchableOpacity>
            </View>
          </View>
        </SalonModal>
      </View>
    );
  }
}

QueueScreen.defaultProps = {

};

QueueScreen.propTypes = {
  actions: PropTypes.shape({
    getBlockTimesReasons: PropTypes.func.isRequired,
    receiveQueue: PropTypes.any.isRequired,
    getQueueState: PropTypes.any.isRequired,
    getQueueEmployees: PropTypes.any.isRequired,
  }).isRequired,
  settingsActions: PropTypes.shape({
    getSettingsByName: PropTypes.func.isRequired,
  }).isRequired,
  clientsActions: PropTypes.shape({
    getMergeableClients: PropTypes.func.isRequired,
  }).isRequired,
  settings: PropTypes.any.isRequired,
  queueState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  groups: PropTypes.any.isRequired,
  loading: PropTypes.any.isRequired,
  waitingQueue: PropTypes.any.isRequired,
  serviceQueue: PropTypes.any.isRequired,
  queueLength: PropTypes.any.isRequired,
};

const mapStateToProps = state => ({
  waitingQueue: state.queue.waitingQueue,
  queueState: state.queue.queueState,
  clientsState: state.clientsReducer,
  serviceQueue: state.queue.serviceQueue,
  groups: state.queue.groups,
  error: state.queue.error,
  queueLength: state.queue.queueLength,
  loading: state.queue.loading,
  walkInState: state.walkInReducer.walkInState,
  settings: state.settingsReducer,
});
const mapActionsToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch),
  settingsActions: bindActionCreators({ ...settingsActions }, dispatch),
  walkInActions: bindActionCreators({ ...walkInActions }, dispatch),
  checkinActions: bindActionCreators({ ...checkinActions }, dispatch),
  serviceActions: bindActionCreators({ ...serviceActions }, dispatch),
  clientsActions: bindActionCreators({ ...clientsActions }, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(QueueScreen);
