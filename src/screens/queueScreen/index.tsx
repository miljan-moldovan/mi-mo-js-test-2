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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {TabView, TabBar} from 'react-native-tab-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FontAwesome, {Icons} from 'react-native-fontawesome';

import createStyleSheet from './styles';
import * as actions from '../../redux/actions/queue';
import settingsActions from '../../redux/actions/settings';
import checkinActions from '../../redux/actions/checkin';
import serviceActions from '../../redux/actions/service';
import walkInActions from '../../redux/actions/walkIn';
import clientsActions from '../../redux/actions/clients';
import Queue from './queue';
import QueueHeader from './queueHeader';
import Icon from '../../components/UI/Icon';
import SalonModal from '../../components/SalonModal';
import SalonTextInput from '../../components/SalonTextInput';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Colors from '../../constants/Colors';

const walkoutImage = require ('../../assets/images/walkoutModal/icon_walkout.png');

const WAITING = '0';
const SERVICED = '1';
const SEARCH_CLIENTS = 'clients';
const SEARCH_PROVIDERS = 'providers';
const initialLayout = {
  height: 0,
  width: Dimensions.get ('window').width,
};


interface Props {
  settingsActions: any;
  navigation: any;
  actions: any;
  settings: any;
  serviceActions: any;
  waitingQueue: any;
  queueState: any;
  serviceQueue: any;
  queueLength: any;
  groups: any;
  loading: any;
  error: any;
}

interface State {
  styles: any;
  index: number;
  isWalkoutVisible: boolean;
  walkoutText: string;
  searchMode: boolean;
  searchText: string;
  searchType: string;
  searchWaitingCount: number;
  searchServiceCount:  number;
  newAppointment: {
    service: any,
    client: any,
    provider: any,
  },
  routes: any;
  colorAnimActive: any;
  colorAnimInactive: any;
  receiveQueueRetries: number;
}

class QueueScreen extends React.Component<Props, State> {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    const {
      shouldShow = false,
      searchMode,
      searchText,
      onChangeSearchMode,
      onChangeSearchText,
    } = params;
    return {
      header: (
        <SafeAreaView style={{backgroundColor: Colors.defaultBlue}}>
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
    };
  };


  constructor(props: Props) {
    super (props);
    this.animateText ();

    this.setState({
      styles: createStyleSheet(),
      index:0,
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
        {key: WAITING, title: 'Waiting'},
        {key: SERVICED, title: 'In Service'},
      ],
      colorAnimActive: new Animated.Value (0),
      colorAnimInactive: new Animated.Value (0),
      receiveQueueRetries: 0,
  
    });
  }


  componentWillMount () {
    this.loadQueueData ();

    // this.props.actions.getQueueEmployees();
    this.props.settingsActions.getSettings ();
  }

  componentDidMount () {
    this.props.navigation.setParams ({
      onChangeSearchMode: this.onChangeSearchMode,
      onChangeSearchText: this.onChangeSearchText,
      searchMode: this.state.searchMode,
      searchText: this.state.searchText,
    });
  }

  onChangeSearchMode = searchMode => {
    this.setState (
      {
        searchMode,
        searchType: searchMode ? SEARCH_CLIENTS : '',
        searchText: '',
      },
      () => this.props.navigation.setParams ({searchMode, searchText: ''})
    );
  };
  onChangeSearchText = searchText => {
    this.setState ({searchText}, () =>
      this.props.navigation.setParams ({searchText})
    );
  };

  onTabPress = ({route}) => {
    this.setState ({index: route.key}, this.animateText);
  };

  loadQueueData = (showError = false) => {
    this.props.actions.getQueueState ();
    this.props.actions.receiveQueue (this.receiveQueueFinished, showError);
  };

  receiveQueueFinished = (result, error) => {
    if (!result && error) {
      setTimeout (() => {
        const showError = this.state.receiveQueueRetries > 1;
        this.loadQueueData (showError);
        this.setState ({
          receiveQueueRetries: this.state.receiveQueueRetries + 1,
        });
      }, 300);
    } else {
      this.setState ({receiveQueueRetries: 0});
    }
  };

  handleSearchClients = () => {
    this.setState ({searchType: SEARCH_CLIENTS});
  };
  handleSearchProviders = () => {
    this.setState ({searchType: SEARCH_PROVIDERS});
  };

  updateSearchWaitingCount = searchWaitingCount =>
    this.setState ({searchWaitingCount});
  updateSearchServiceCount = searchServiceCount =>
    this.setState ({searchServiceCount});

  handleIndexChange = index => {
    this.setState ({index});
  };

  handleWalkInPress = () => {
    const {navigate} = this.props.navigation;
    this.setState ({
      newAppointment: {
        client: null,
        service: null,
        provider: null,
      },
    });
    navigate ('ModalClients', {
      onChangeClient: this.handleChangeClient,
      transition: 'SlideFromBottom',
      isModal: true,
      isWalkin: true,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 1 of 3',
        leftButton: (
          <View style={this.state.styles.backContainer}>
            <FontAwesome style={this.state.styles.backIcon}>{Icons.angleLeft}</FontAwesome>
            <Text style={this.state.styles.leftButtonText}>Cancel</Text>
          </View>
        ),
        leftButtonOnPress: navigation => {
          navigation.goBack ();
          this.loadQueueData ();
        },
      },
    });
  };

  handleChangeClient = client => {
    const {newAppointment} = this.state;
    newAppointment.client = client;
    this.setState ({newAppointment});
    this.props.navigation.navigate ('ModalServices', {
      onChangeService: this.handleChangeService,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 2 of 3',
        leftButton: (
          <View style={this.state.styles.backContainer}>
            <FontAwesome style={this.state.styles.backIcon}>{Icons.angleLeft}</FontAwesome>
            <Text style={this.state.styles.leftButtonText}>Back</Text>
          </View>
        ),
        leftButtonOnPress: navigation => {
          navigation.goBack ();
        },
        rightButton: (
          <View style={this.state.styles.rightContainer}>
            <Text style={this.state.styles.leftButtonText}>Cancel</Text>
          </View>
        ),
        rightButtonOnPress: navigation => {
          navigation.navigate ('Main');
        },
      },
    });
  };

  handleChangeProvider = provider => {
    const {newAppointment} = this.state;
    newAppointment.provider = provider;
    this.setState ({newAppointment});
    this.props.navigation.navigate ('ModalWalkIn', {
      newAppointment,
      loadQueueData: this.loadQueueData,
    });
  };

  handleChangeService = service => {
    const {newAppointment} = this.state;
    newAppointment.service = service;
    this.setState ({newAppointment});

    this.props.serviceActions.setSelectedService ({id: service.id});
    this.props.navigation.navigate ('ModalProviders', {
      queueList: true,
      selectedService: service,
      checkProviderStatus: true,
      onChangeProvider: this.handleChangeProvider,
      headerProps: {
        title: 'Walk-in',
        subTitle: 'step 3 of 3',
        leftButton: (
          <View style={this.state.styles.backContainer}>
            <FontAwesome style={this.state.styles.backIcon}>{Icons.angleLeft}</FontAwesome>
            <Text style={this.state.styles.leftButtonText}>Back</Text>
          </View>
        ),
        leftButtonOnPress: navigation => {
          navigation.goBack ();
        },
      },
    });
  };

  handleWalkOutPress = () => {
    this.setState ({isWalkoutVisible: true});
  };

  closeWalkOut = () => {
    this.setState ({isWalkoutVisible: false});
  };

  handleWalkOutTextChange = ev => {
    this.setState ({walkoutText: ev.nativeEvent.text});
  };

  animateText = () => {
    Animated.loop (
      Animated.timing (this.state.colorAnimActive, {
        toValue: 200,
        duration: 2000,
      }),
      {iterations: 1}
    ).start ();

    Animated.loop (
      Animated.timing (this.state.colorAnimInactive, {
        toValue: 200,
        duration: 2000,
      }),
      {iterations: 1}
    ).start ();
  };

  searchWaitingRef = null;
  searchServicingRef = null;

  renderLabel = (props: any) => ({route}) => {
    const focused = this.state.index.toString () === route.key.toString ();

    const interpolateColorActive = this.state.colorAnimActive.interpolate ({
      inputRange: [0, 200],
      outputRange: ['#FFFFFF', '#1963CE'],
    });

    const interpolateColorInactive = this.state.colorAnimInactive.interpolate ({
      inputRange: [0, 200],
      outputRange: ['#1963CE', '#FFFFFF'],
    });
    const colorStyle = {
      color: focused ? interpolateColorActive : interpolateColorInactive,
    };
    return (
      <View style={this.state.styles.tabLabelContainer}>
        <View
          style={[
            this.state.styles.tabQueueCounter,
            focused ? null : {backgroundColor: '#0C4699'},
          ]}
        >
          <Animated.Text style={[this.state.styles.tabQueueCounterText, colorStyle]}>
            {route.key === WAITING
              ? this.props.waitingQueue.length
              : this.props.serviceQueue.length}
          </Animated.Text>
        </View>
        <Animated.Text style={[this.state.styles.animatedText, colorStyle]}>
          {route.title}
        </Animated.Text>
      </View>
    );
  };

  renderBar = props => {
    const {guestWaitMins} = this.props.queueState ? this.props.queueState : {guestWaitMins : 0};
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
    const tabStyle = {width: initialLayout.width === 320 ? 100 : 120};
    return (
      <View>
        <TabBar
          {...props}
          tabStyle={[this.state.styles.tab, tabStyle]}
          style={[this.state.styles.tabContainer, containerStyle]}
          renderLabel={this.renderLabel (props)}
          indicatorStyle={this.state.styles.indicator}
          onTabPress={this.onTabPress}
        />
        <View style={this.state.styles.summaryBar}>
          <Text style={this.state.styles.summaryBarTextLeft}>
            <Text style={this.state.styles.summaryBarTextLeftEm}>
              {this.props.queueLength}
            </Text>
            {' '}
            CLIENTS TODAY
          </Text>
          <Text style={this.state.styles.summaryBarTextRight}>
            <Text style={this.state.styles.summaryBarTextRightEm}>{`${waitTime}m`}</Text>
            {' '}
            Est. Wait
          </Text>
        </View>
      </View>
    );
  };

  renderScene = ({route}) => {
    const {
      navigation,
      waitingQueue,
      serviceQueue,
      groups,
      loading,
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
  };

  renderSearchResults = () => {
    const {
      navigation,
      waitingQueue,
      serviceQueue,
      groups,
      loading,
    } = this.props;
    const {
      searchType,
      searchWaitingCount,
      searchServiceCount,
      searchText: filterText,
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
      <View style={[this.state.styles.container, {backgroundColor: '#f1f1f1'}]}>
        <KeyboardAwareScrollView>
          {!searchWaitingCount && !searchServiceCount
            ? <View style={this.state.styles.searchEmpty}>
                <View style={this.state.styles.searchEmptyIconContainer}>
                  <Icon
                    name="search"
                    style={this.state.styles.searchEmptyIcon}
                    color="#E3E4E5"
                  />
                </View>
                <Text style={this.state.styles.searchEmptyText}>
                  Results matching
                  <Text style={this.state.styles.notFoundText}>“{filterText}”</Text>
                  {' '}
                  were not found.
                </Text>
                <Text style={this.state.styles.searchEmptyTextSmall}>
                  Check your spelling and try again or tap on one of the suggestions below
                </Text>
              </View>
            : null}
          <Queue
            isWaiting
            {...this.props}
            onChangeFilterResultCount={this.updateSearchWaitingCount}
            data={waitingQueue}
            loadQueueData={this.loadQueueData}
            headerTitle={
              searchWaitingCount || searchServiceCount ? 'Waiting' : undefined
            }
            {...p}
          />
          <Queue
            {...this.props}
            onChangeFilterResultCount={this.updateSearchServiceCount}
            data={serviceQueue}
            loadQueueData={this.loadQueueData}
            headerTitle={
              searchWaitingCount || searchServiceCount
                ? 'In Service'
                : undefined
            }
            {...p}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  };

  render () {
    if (this.state.searchMode) {
      return this.renderSearchResults ();
    }

    return (
      <View style={this.state.styles.container}>
        <TabView
          style={this.state.styles.tabViewStyle}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderBar}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
        />
        {this.props.settings.data.SupressServiceForWalkIn
          ? null
          : <SalonTouchableOpacity
              onPress={this.handleWalkInPress}
              style={this.state.styles.walkinButton}
            >
              <Text style={this.state.styles.walkinButtonText}>Walk-in</Text>
              <Icon
                style={this.state.styles.walkinButtonIcon}
                color="white"
                name="signIn"
              />
            </SalonTouchableOpacity>}
        <SalonModal
          isVisible={this.state.isWalkoutVisible}
          closeModal={this.closeWalkOut}
        >
          <View style={this.state.styles.walkoutContainer}>
            <View style={this.state.styles.walkoutImageContainer}>
              <Image style={this.state.styles.walkoutImage} source={walkoutImage} />
            </View>
            <Text style={this.state.styles.walkoutText}>
              Walk-out reason:
              <Text style={this.state.styles.walkoutTextBold}>Other</Text>
            </Text>
            <View style={this.state.styles.walkoutTextContainer}>
              <SalonTextInput
                multiline
                placeholder="Please insert other reasons"
                placeholderColor="#0A274A"
                style={this.state.styles.walkoutInput}
                placeholderStyle={this.state.styles.walkoutPlaceholder}
                text={this.state.walkoutText}
                onChange={this.handleWalkOutTextChange}
              />
            </View>
            <View style={this.state.styles.walkoutButtonContainer}>
              <SalonTouchableOpacity
                onPress={this.closeWalkOut}
                style={this.state.styles.walkoutButtonCancel}
              >
                <Text style={this.state.styles.walkoutTextCancel}>Cancel</Text>
              </SalonTouchableOpacity>
              <SalonTouchableOpacity
                onPress={this.closeWalkOut}
                style={this.state.styles.walkoutButtonOk}
              >
                <Text style={this.state.styles.walkoutTextOk}>Ok</Text>
              </SalonTouchableOpacity>
            </View>
          </View>
        </SalonModal>
      </View>
    );
  }
}

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
  actions: bindActionCreators ({...actions as any}, dispatch),
  settingsActions: bindActionCreators ({...settingsActions}, dispatch),
  walkInActions: bindActionCreators ({...walkInActions}, dispatch),
  checkinActions: bindActionCreators ({...checkinActions}, dispatch),
  serviceActions: bindActionCreators ({...serviceActions}, dispatch),
  clientsActions: bindActionCreators ({...clientsActions}, dispatch),
});
export default connect (mapStateToProps, mapActionsToProps) (QueueScreen);
