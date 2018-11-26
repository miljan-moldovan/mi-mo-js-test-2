import React from 'react';
import {Header} from 'react-navigation';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {get} from 'lodash';

import AppointmentDetails from './components/appointmentDetails';
import ClientFormulas from '../clientInfoScreen/components/clientFormulas';
import ClientNotes from '../clientInfoScreen/components/clientNotes';
import ClientInfoButton from '../../components/ClientInfoButton';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';
import LoadingOverlay from '../../components/LoadingOverlay';

import styles from './styles';
import SalonHeader from '../../components/SalonHeader';

const initialLayout = {
  height: 0,
  width: Dimensions.get ('window').width,
};

export default class AppointmentDetailsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};
    const client = get (params, 'client', null);
    const title = `${get (client, 'name', '')} ${get (client, 'lastName', '')}`;
    const infoButtonStyle = {fontSize: 18, color: 'white'};
    return {
      header: (
        <SalonHeader
          title={title}
          headerLeft={
            <SalonTouchableOpacity
              style={{paddingLeft: 10}}
              onPress={() => {
                if (params.loadQueueData) {
                  params.loadQueueData ();
                }

                navigation.goBack ();
              }}
            >
              <Icon name="angleLeft" size={35} color="white" type="regular" />
            </SalonTouchableOpacity>
          }
          headerRight={
            <ClientInfoButton
              client={client}
              navigation={navigation}
              onDonePress={() => {}}
              buttonStyle={styles.rightButton}
              apptBook={false}
              iconStyle={infoButtonStyle}
            />
          }
        />
      ),
    };
  };

  constructor (props) {
    super (props);
    props.navigation.setParams ({
      client: get (this.params, 'appointment.client', null),
      handleSave: this.handleSave,
      handleRightClick: this.goToClientInfo,
    });
    this.state = {
      index: 0,
      routes: [
        {key: '0', title: 'Appt. Details', icon: 'penAlt'},
        {key: '1', title: 'Notes', icon: 'fileText'},
        {key: '2', title: 'Formulas', icon: 'eyedropper'},
      ],
    };
  }

  componentDidMount () {
    this.props.queueDetailActions.setAppointment (
      get (this.params.appointment, 'id', null)
    );
  }

  onChangeClient = client => this.props.navigation.setParams ({client});

  get params () {
    const params = get (this.props.navigation, 'state.params', {});
    const client = get (params, 'client', null);
    const appointment = get (params, 'appointment', null);
    return {appointment, client};
  }

  goToClientInfo = () => {
    this.props.navigation.navigate ('ClientInfo', {
      client: get (this.params.appointment, 'client', null),
      apptBook: false,
    });
  };

  handleIndexChange = index => this.setState ({index});

  handleSave = () => alert ('saving');

  renderLabel = ({position, navigationState}) => ({route, index}) => (
    <Text
      style={
        this.state.index === index
          ? [styles.tabLabelText, styles.tabLabelActive]
          : styles.tabLabelText
      }
    >
      <Icon
        style={[
          styles.tabIcon,
          {color: this.state.index === index ? '#1DBF12' : '#C0C1C6'},
        ]}
        name={route.icon}
        size={12}
        type="solid"
      />
      {` ${route.title}`}
    </Text>
  );

  renderHeader = props => (
    <TabBar
      {...props}
      tabStyle={[styles.tabLabel, {backgroundColor: 'transparent'}]}
      style={{
        backgroundColor: 'transparent',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C0C1C6',
      }}
      renderLabel={this.renderLabel (props)}
      indicatorStyle={{backgroundColor: '#1DBF12', height: 2}}
    />
  );

  renderScene = SceneMap ({
    0: () => (
      <AppointmentDetails
        navigation={this.props.navigation}
        isWaiting={this.props.navigation.state.params.isWaiting}
        onChangeClient={this.onChangeClient}
        onPressSummary={this.props.navigation.state.params.onPressSummary}
        {...this.props}
      />
    ),
    1: () => (
      <ClientNotes
        {...this.props}
        client={get (this.params, 'appointment.client', null)}
        navigation={this.props.navigation}
        editionMode={this.state.editionMode}
      />
    ),
    2: () => (
      <ClientFormulas
        {...this.props}
        client={get (this.params, 'appointment.client', null)}
        navigation={this.props.navigation}
      />
    ),
  });

  render () {
    const {isLoading} = this.state;
    const tabViewStyle = {flex: 1};
    const client = get (this.params, 'appointment.client', null);
    return (
      <View style={styles.container}>
        {isLoading && <LoadingOverlay />}
        {client && client.id > 1
          ? <TabView
              style={tabViewStyle}
              navigationState={this.state}
              renderScene={this.renderScene}
              renderTabBar={this.renderHeader}
              onIndexChange={this.handleIndexChange}
              initialLayout={initialLayout}
              swipeEnabled={false}
              useNativeDriver
            />
          : <AppointmentDetails
              navigation={this.props.navigation}
              isWaiting={this.props.navigation.state.params.isWaiting}
              onChangeClient={this.onChangeClient}
              onPressSummary={this.props.navigation.state.params.onPressSummary}
              {...this.props}
            />}
      </View>
    );
  }
}
