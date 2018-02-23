import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import AppoinmentNotes from './components/appointmentNotes';
import AppointmentFormulas from './components/appointmentFormulas';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
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
    color: '#115ECD',
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 14,
    paddingBottom: 8,
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
  static navigationOptions = {
    headerTitle: (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: 'white' }}>Rod Stewart</Text>
      </View>
    ),
    headerLeft: (
      <Text style={{ fontSize: 14, color: '#fff' }}>
        <FontAwesome style={{ fontSize: 30, color: '#fff' }}>{Icons.angleLeft}</FontAwesome>
      </Text>
    ),
    headerRight: (
      <Text style={{ fontSize: 14, color: '#fff' }}>
        <FontAwesome style={{ fontSize: 18, color: '#fff' }}>{Icons.infoCircle}</FontAwesome>
      </Text>
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: '0', title: 'Appt. Details', icon: 'pencil' },
        { key: '1', title: 'Notes', icon: 'file' },
        { key: '2', title: 'Formulas', icon: 'eyedropper' },
      ],
    };
  }

  handleIndexChange = index => this.setState({ index });

  renderLabel = ({ position, navigationState }) => ({ route, index }) => (
    <Text style={styles.tabLabel}>
      <FontAwesome style={styles.tabIcon}>{Icons[route.icon]}</FontAwesome>
      {` ${route.title}`}
    </Text>
  );

  renderHeader = props => (
    <TabBar
      {...props}
      tabStyle={{ backgroundColor: 'transparent' }}
      style={{ backgroundColor: 'transparent' }}
      renderLabel={this.renderLabel(props)}
      indicatorStyle={{ backgroundColor: '#115ECD', height: 4 }}
    />
  );

  renderScene = SceneMap({
    0: () => <AppoinmentNotes navigation={this.props.navigation} />,
    1: () => <AppoinmentNotes navigation={this.props.navigation} />,
    2: () => <AppointmentFormulas navigation={this.props.navigation} />,
  });

  render() {
    return (
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
