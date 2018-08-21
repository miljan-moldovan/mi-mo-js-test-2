// @flow
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
} from 'react-native';

import { connect } from 'react-redux';
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
import Queue from './queue';
import QueueHeader from './components/QueueHeader';
import Icon from '../../components/UI/Icon';
import SalonModal from '../../components/SalonModal';
import SalonTextInput from '../../components/SalonTextInput';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

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
      searchMode, searchText, onChangeSearchMode, onChangeSearchText,
    } = params;
    return {
      header: (
        <QueueHeader
          navigation={navigation}
          onChangeSearchMode={onChangeSearchMode}
          onChangeSearchText={onChangeSearchText}
          searchMode={searchMode}
          searchText={searchText}
        />
      ),
    };
  };
  state = {
    refreshing: false,
    index: '0',
    isWalkoutVisible: false,
    walkoutText: '',
    searchMode: false,
    searchText: '',
    searchType: '',
    searchWaitingCount: 0,
    searchServiceCount: 0,
    routes: [
      { key: WAITING, title: 'Waiting' },
      { key: SERVICED, title: 'In Service' },
    ],
    newAppointment: {
      service: null,
      client: null,
      provider: null,
    },
    colorAnimActive: new Animated.Value(0),
    colorAnimInactive: new Animated.Value(0),
  }
  searchWaitingRef = null;
  searchServicingRef = null;

  constructor(props) {
    super(props);
    this.animateText();
  }

  componentWillMount() {
    this.props.actions.getQueueState();
    this.props.actions.receiveQueue();
    setInterval(this.props.actions.receiveQueue, 15000);
    setInterval(this.props.actions.getQueueState, 5000);
    this.props.settingsActions.getSettingsByName('SupressServiceForWalkIn');
    this.props.settingsActions.getSettingsByName('PrintToTicket');
    // this._refreshData();
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

  _refreshData = () => {
    this.props.actions.receiveQueue();
  }

  _onRefresh = () => {
    // this._refreshData();
    // this.setState({ refreshing: true });
    // // FIXME this._refreshData();
    // // emulate refresh call
    // setTimeout(() => this.setState({ refreshing: false }), 500);
  }

  _renderLabel = ({ position, navigationState }) => ({ route }) => {
    const focused = this.state.index.toString() === route.key.toString();

    const interpolateColorActive = this.state.colorAnimActive.interpolate({
      inputRange: [0, 200],
      outputRange: ['#FFFFFF', '#1963CE'],
    });

    const interpolateColorInactive = this.state.colorAnimInactive.interpolate({
      inputRange: [0, 200],
      outputRange: ['#1963CE', '#FFFFFF'],
    });

    return (
      <View style={styles.tabLabelContainer}>
        <View style={[styles.tabQueueCounter, focused ? null : { backgroundColor: '#0C4699' }]}>
          <Animated.Text style={[styles.tabQueueCounterText, { color: focused ? interpolateColorActive : interpolateColorInactive }]}>
            {route.key === WAITING ? this.props.waitingQueue.length : this.props.serviceQueue.length}
          </Animated.Text>
        </View>
        <Animated.Text style={{
          fontFamily: 'Roboto-Medium',
          fontSize: 12,
          color: focused ? interpolateColorActive : interpolateColorInactive,
        }}
        >
          {route.title}
        </Animated.Text>
      </View>
    );
  };
  // }
  _renderBar = (props) => {
    const { guestWaitMins } = this.props.queueState ? this.props.queueState : {};
    let waitTime = '-';
    if (guestWaitMins > 0) {
      waitTime = `${guestWaitMins}`;
    } else if (guestWaitMins === 0) {
      waitTime = '0';
    }

    return (
      <View>
        <TabBar
          {...props}
          tabStyle={[styles.tab, { width: initialLayout.width === 320 ? 100 : 120 }]}
          style={[styles.tabContainer,
            {
              width: initialLayout.width === 320 ? 200 : 240,
              marginLeft: initialLayout.width === 320 ? 10 : 12,
            }]}
          renderLabel={this._renderLabel(props)}
          indicatorStyle={styles.indicator}
          onTabPress={this.onTabPress}
        />
        <View style={styles.summaryBar}>
          <Text style={styles.summaryBarTextLeft}><Text style={styles.summaryBarTextLeftEm}>{this.props.queueLength}</Text> CLIENTS TODAY</Text>
          <Text style={styles.summaryBarTextRight}><Text style={styles.summaryBarTextRightEm}>{waitTime}m </Text> Est. Wait</Text>
        </View>
      </View>
    );
  }

  _renderScene = ({ route }) => {
    const {
      navigation, waitingQueue, serviceQueue, groups, loading,
    } = this.props;
    switch (route.key) {
      case WAITING:
        return (
          <Queue data={waitingQueue} groups={groups} navigation={navigation} loading={loading} isWaiting />
        );
      case SERVICED:
        return (
          <Queue data={serviceQueue} groups={groups} navigation={navigation} loading={loading} />
        );
      default:
        return route;
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

  _renderSearchResults = () => {
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
    const active = { backgroundColor: 'white' };
    const activeText = { color: '#115ECD' };

    return (
      <View style={[styles.container, { backgroundColor: '#f1f1f1' }]}>
        <KeyboardAwareScrollView>
          {!searchWaitingCount && !searchServiceCount ? (
            <View style={styles.searchEmpty}>
              <View style={styles.searchEmptyIconContainer}>
                {/* <FontAwesome style={styles.searchEmptyIcon}>{Icons.search}</FontAwesome> */}
                <Icon name="search" style={styles.searchEmptyIcon} color="#E3E4E5" />
              </View>
              <Text style={styles.searchEmptyText}>
                Results matching <Text style={{ color: 'black' }}>“{filterText}”</Text> were not found.
              </Text>
              <Text style={styles.searchEmptyTextSmall}>
                Check your spelling and try again or tap on one of the suggestions below
              </Text>
            </View>
          ) : null}
          <Queue
            isWaiting
            onChangeFilterResultCount={this.updateSearchWaitingCount}
            data={waitingQueue}
            headerTitle={searchWaitingCount || searchServiceCount ? 'Waiting' : undefined}
            {...p}
          />
          <Queue
            onChangeFilterResultCount={this.updateSearchServiceCount}
            data={serviceQueue}
            headerTitle={searchWaitingCount || searchServiceCount ? 'In Service' : undefined}
            {...p}
          />
        </KeyboardAwareScrollView>
        {/*  <View style={styles.searchTypeContainer}>

          <View style={styles.searchType}>
            <SalonTouchableOpacity
              style={[styles.searchClient, searchType === SEARCH_CLIENTS ? active : null]}
              onPress={this.handleSearchClients}
            >
              <Text style={[styles.searchTypeText, searchType === SEARCH_CLIENTS ? activeText : null]}>Client</Text>
            </SalonTouchableOpacity>
            <SalonTouchableOpacity
              style={[styles.searchProvider, searchType === SEARCH_PROVIDERS ? active : null]}
              onPress={this.handleSearchProviders}
            >
              <Text style={[styles.searchTypeText, searchType === SEARCH_PROVIDERS ? activeText : null]}>Provider</Text>
            </SalonTouchableOpacity>
          </View>
        </View> */}
      </View>
    );
  }

  _handleIndexChange = (index) => {
    this.setState({ index });
  };

  _handleWalkInPress = () => {
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
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 1 of 3',
        leftButton:
  <View style={styles.backContainer}>
    <FontAwesome style={styles.backIcon}>
      {Icons.angleLeft}
    </FontAwesome>
    <Text style={styles.leftButtonText}>
              Cancel
    </Text>
  </View>,
        leftButtonOnPress: (navigation) => {
          navigation.goBack();
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
        leftButton:
  <View style={styles.backContainer}>
    <FontAwesome style={styles.backIcon}>
      {Icons.angleLeft}
    </FontAwesome>
    <Text style={styles.leftButtonText}>
              Back
    </Text>
  </View>,
        leftButtonOnPress: (navigation) => { navigation.goBack(); },
      },
    });
  }

  handleChangeProvider = (provider) => {
    const { newAppointment } = this.state;
    newAppointment.provider = provider;
    this.setState({ newAppointment });
    this.props.navigation.navigate('WalkIn', { newAppointment });
  }

  handleChangeService = (service) => {
    const { newAppointment } = this.state;
    newAppointment.service = service;
    this.setState({ newAppointment });
    this.props.navigation.navigate('ModalProviders', {
      onChangeProvider: this.handleChangeProvider,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 3 of 3',
        leftButton:
  <View style={styles.backContainer}>
    <FontAwesome style={styles.backIcon}>
      {Icons.angleLeft}
    </FontAwesome>
    <Text style={styles.leftButtonText}>
              Back
    </Text>
  </View>,
      },
    });
  }

  _handleWalkOutPress = () => {
    this.setState({ isWalkoutVisible: true });
  }

  _closeWalkOut = () => {
    this.setState({ isWalkoutVisible: false });
  }

  _handleWalkOutTextChange = (ev) => {
    this.setState({ walkoutText: ev.nativeEvent.text });
  };

  onTabPress = ({ route }) => {
    this.setState({ index: route.key }, this.animateText);
  }

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

  render() {
    //
    //
    if (this.state.searchMode) { return this._renderSearchResults(); }


    return (
      <View style={styles.container}>
        <TabView
          style={{
            flex: 1,
            backgroundColor: '#115ECD',
            borderWidth: 0,
          }}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}

        // swipeEnabled={false}
        />
        {
          this.props.settings.data.SupressServiceForWalkIn ? null : (
            <SalonTouchableOpacity onPress={this._handleWalkInPress} style={styles.walkinButton}>
              <Text style={styles.walkinButtonText}>Walk-in</Text>
              <Icon style={styles.walkinButtonIcon} color="white" name="signIn" />
            </SalonTouchableOpacity>
          )
        }
        <SalonModal isVisible={this.state.isWalkoutVisible} closeModal={this._closeWalkOut}>
          {[
            <View key={Math.random().toString()} style={styles.walkoutContainer}>
              <View style={styles.walkoutImageContainer}>
                <Image style={styles.walkoutImage} source={require('../../assets/images/walkoutModal/icon_walkout.png')} />
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
                  onChange={this._handleWalkOutTextChange}
                />
              </View>
              <View style={styles.walkoutButtonContainer}>
                <SalonTouchableOpacity onPress={this._closeWalkOut} style={styles.walkoutButtonCancel}>
                  <Text style={styles.walkoutTextCancel}>Cancel</Text>
                </SalonTouchableOpacity>
                <SalonTouchableOpacity onPress={this._closeWalkOut} style={styles.walkoutButtonOk}>
                  <Text style={styles.walkoutTextOk}>Ok</Text>
                </SalonTouchableOpacity>
              </View>
            </View>,
          ]}
        </SalonModal>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  waitingQueue: state.queue.waitingQueue,
  queueState: state.queue.queueState,
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
});
export default connect(mapStateToProps, mapActionsToProps)(QueueScreen);
