import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get } from 'lodash';

import AppointmentDetails from './components/AppointmentDetails';
import ClientFormulas from '../clientInfoScreen/components/clientFormulas';
import ClientNotes from '../clientInfoScreen/components/clientNotes';
import ClientInfoButton from '../../components/ClientInfoButton';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';
import LoadingOverlay from '../../components/LoadingOverlay';
import { Employees } from '../../utilities/apiWrapper';
import styles from './styles';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class AppointmentDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { appointment = null, handleSave = (() => {}) } = params;
    const client = get(appointment, 'client', null);
    const title = `${get(client, 'name', '')} ${get(client, 'lastName', '')}`;
    const saveButtonStyle = { marginLeft: 10 };
    return ({
      title,
      headerLeft: (
        <SalonTouchableOpacity onPress={navigation.goBack}>
          <Icon
            name="angleLeft"
            size={35}
            color="white"
            type="regular"
          />
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <React.Fragment>
          <ClientInfoButton
            client={client}
            navigation={navigation}
            onDonePress={() => { }}
            buttonStyle={styles.rightButton}
            apptBook={false}
            iconStyle={{ fontSize: 18, color: 'white' }}
          />
          <SalonTouchableOpacity
            onPress={handleSave}
            style={saveButtonStyle}
          >
            <Text style={{ fontSize: 14, lineHeight: 22, color: 'white' }}>Done</Text>
          </SalonTouchableOpacity>
        </React.Fragment>
      ),
    });
  };

  state = {
    index: 0,
    routes: [
      { key: '0', title: 'Appt. Details', icon: 'penAlt' },
      { key: '1', title: 'Notes', icon: 'fileText' },
      { key: '2', title: 'Formulas', icon: 'eyedropper' },
    ],
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleSave: this.handleSave,
      handleRightClick: this.goToClientInfo,
    });
    this.props.queueDetailActions.setAppointment(get(this.params.appointment, 'id', null));
  }

  get params() {
    const { appointment = null } = this.props.navigation.state.params || {};
    return { appointment };
  }

  goToClientInfo = () => {
    this.props.navigation.navigate('ClientInfo', { client: get(this.params.appointment, 'client', null), apptBook: false });
  };

  handleIndexChange = index => this.setState({ index });

  handleSave = () => alert('saving')

  renderLabel = ({ position, navigationState }) => ({ route, index }) => (

    <Text
      style={
        this.state.index === index
          ? [styles.tabLabelText, styles.tabLabelActive]
          : styles.tabLabelText
      }
    >
      <Icon
        style={[styles.tabIcon, { color: this.state.index === index ? '#1DBF12' : '#C0C1C6' }]}
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
      tabStyle={[styles.tabLabel, { backgroundColor: 'transparent' }]}
      style={{ backgroundColor: 'transparent', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#C0C1C6' }}
      renderLabel={this.renderLabel(props)}
      indicatorStyle={{ backgroundColor: '#1DBF12', height: 2 }}
    />
  );

  renderScene = SceneMap({
    0: () => (
      <AppointmentDetails
        navigation={this.props.navigation}
        isWaiting={this.props.navigation.state.params.isWaiting}
        onPressSummary={this.props.navigation.state.params.onPressSummary}
      />
    ),
    1: () => (
      // <ClientNotes
      //   {...this.props}
      //   client={get(this.params, 'client', null)}
      //   navigation={this.props.navigation}
      //   editionMode={this.state.editionMode}
      // />
      null
    ),
    2: () => (
      // <ClientFormulas
      //   {...this.props}
      //   client={get(this.params, 'client', null)}
      //   navigation={this.props.navigation}
      // />
      null
    ),
  });

  render() {
    const { isLoading } = this.state;
    const tabViewStyle = { flex: 1 };
    return (
      <View style={styles.container}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <TabView
          style={tabViewStyle}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderHeader}
          onIndexChange={this.handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
          useNativeDriver
        />
      </View>
    );
  }
}
