import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import AppointmentDetails from './components/appointmentDetails';
import AppoinmentNotes from './components/appointmentNotes';
import AppointmentFormulas from './components/appointmentFormulas';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import Icon from '../../components/UI/Icon';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    height: 39.5,
    // paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    color: '#4D5067',
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    lineHeight: 14,
  },
  tabLabelActive: {
    color: '#1DBF12',
  },
  tabIcon: {
    marginRight: 5,

  },
  textWalkInBtn: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 5,
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class AppointmentDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = 'New Appointment';
    if (params && params.item) {
      title = `${params.item.client.name} ${params.item.client.lastName}`;
    }
    return ({
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.leftButton} onPress={() => { navigation.goBack(); }}>
          <View style={styles.leftButtonContainer}>
            <Text style={styles.leftButtonText}>
              <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
            </Text>
          </View>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity style={styles.rightButton} onPress={() => alert('Not Implemented')}>
          <View style={styles.rightButtonContainer}>
            <FontAwesome style={{ fontSize: 18, color: '#fff' }}>{Icons.infoCircle}</FontAwesome>
          </View>
        </SalonTouchableOpacity>
      ),
    });
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.state = {
      index: 0,
      loading: true,
      appointment: params && params.item ? params.item : null,
      formulas: [],
      notes: [],
      routes: [
        { key: '0', title: 'Appt. Details', icon: 'penAlt' },
        { key: '1', title: 'Notes', icon: 'fileText' },
        { key: '2', title: 'Formulas', icon: 'eyedropper' },
      ],
    };

    this.props.appointmentDetailsActions.setAppointment(this.state.appointment);
  }

  componentWillMount() {
    // apiWrapper.doRequest('clientFormulas', { path: { id: 306 } })
    //   .then((res) => {
    //     debugger//eslint-disable-line
    //     const { notes, formulas } = res;
    //     this.setState({ loading: false, notes, formulas });
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //   });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  handleIndexChange = index => this.setState({ index });

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
    0: () => <AppointmentDetails onPressSummary={this.props.navigation.state.params.onPressSummary} isWaiting={this.props.navigation.state.params.isWaiting} appointment={this.state.appointment} navigation={this.props.navigation} />,
    1: () => <AppoinmentNotes notes={this.state.notes} appointment={this.state.appointment} navigation={this.props.navigation} />,
    2: () => <AppointmentFormulas formulas={this.state.formulas} appointment={this.state.appointment} navigation={this.props.navigation} />,
  });


  render() {
    const { loading } = this.state;

    return loading ?
      (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#0000FF" />
        </View>
      )
      : (
        <View style={styles.container}>
          <TabViewAnimated
            style={{ flex: 1 }}
            navigationState={this.state}
            renderScene={this.renderScene}
            renderHeader={this.renderHeader}
            onIndexChange={this.handleIndexChange}
            initialLayout={initialLayout}
            swipeEnabled={false}
            useNativeDriver
          />
        </View>
      );
  }
}
