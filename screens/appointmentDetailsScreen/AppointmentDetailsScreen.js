import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

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
  state = {
    index: 0,
    routes: [
      { key: '0', title: 'Appt. Details' },
      { key: '1', title: 'Notes' },
      { key: '2', title: 'Formulas' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderLabel = ({ position, navigationState }) => ({ route, index }) => (
    <Text style={styles.tabLabel}>
      {route.title}
    </Text>
  );

  _renderHeader = props => (
    <TabBar
      {...props}
      tabStyle={{ backgroundColor: 'transparent' }}
      style={{ backgroundColor: 'transparent' }}
      renderLabel={this._renderLabel(props)}
      indicatorStyle={{ backgroundColor: '#115ECD', height: 4 }}
    />
  );

  _renderScene = SceneMap({
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
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
          swipeEnabled={false}
        />
      </View>
    );
  }
}
