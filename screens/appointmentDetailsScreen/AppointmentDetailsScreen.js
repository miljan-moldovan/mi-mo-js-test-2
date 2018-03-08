import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import AppointmentDetails from './components/appointmentDetails';
import AppoinmentNotes from './components/appointmentNotes';
import AppointmentFormulas from './components/appointmentFormulas';

import apiWrapper from '../../utilities/apiWrapper';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    paddingTop: 14,
    fontFamily: 'Roboto-Medium',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
  },
  tabLabel: {
    height: 38,
    // paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    color: '#4D5067',
    fontFamily: 'Roboto',
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
});

export default class AppointmentDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let title = 'New Appointment';
    if (params && params.appointment) {
      title = `${params.appointment.client.name} ${params.appointment.client.lastName}`;
    }
    return ({
      headerTitle: (
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity onPress={() => { navigation.navigate('Queue'); }}>
          <Text style={{ fontSize: 14, color: '#fff' }}>
            <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
          </Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <Text style={{ fontSize: 14, color: '#fff' }}>
          <FontAwesome style={{ fontSize: 18, color: '#fff' }}>{Icons.infoCircle}</FontAwesome>
        </Text>
      ),
    });
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;

    this.state = {
      index: 0,
      loading: true,
      appointment: params && params.appointment ? params.appointment : null,
      formulas: [],
      notes: [],
      routes: [
        { key: '0', title: 'Appt. Details', icon: 'pencil' },
        { key: '1', title: 'Notes', icon: 'file' },
        { key: '2', title: 'Formulas', icon: 'eyedropper' },
      ],
    };
  }

  componentDidMount() {
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
      <FontAwesome style={styles.tabIcon}>{Icons[route.icon]}</FontAwesome>
      {` ${route.title}`}
    </Text>

  );

  renderHeader = props => (
    <TabBar
      {...props}
      tabStyle={[styles.tabLabel, { backgroundColor: 'transparent' }]}
      style={{ backgroundColor: 'transparent' }}
      renderLabel={this.renderLabel(props)}
      indicatorStyle={{ backgroundColor: '#1DBF12', height: 2 }}
    />
  );

  renderScene = SceneMap({
    0: () => <AppointmentDetails appointment={this.state.appointment} navigation={this.props.navigation} />,
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
          />
        </View>
      );
  }
}
