import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import ClientAttributes from './components/ClientAttributes';
import ClientNotes from './components/ClientNotes';
import ClientHistory from './components/ClientHistory';
import ClientCards from './components/ClientCards';
import ClientBalances from './components/ClientBalances';
import ClientFormulas from './components/ClientFormulas';
import ClientDetails from './components/ClientDetails';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class ClientDescriptionScreen extends Component {
  state = {
    index: 0,
    routes: [
      { key: '0', title: 'Details' },
      { key: '1', title: 'Notes' },
      { key: '2', title: 'Formulas' },
      { key: '3', title: 'Attributes' },
      { key: '4', title: 'CARDS ON FILE' },
      { key: '5', title: 'HISTORY' },
      { key: '8', title: 'BALANCES' },
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
      indicatorStyle={{ backgroundColor: '#80BBDF', height: 6 }}
    />
  );

  _renderScene = SceneMap({
    0: ClientDetails,
    1: ClientNotes,
    2: ClientFormulas,
    3: ClientAttributes,
    4: ClientCards,
    5: ClientHistory,
    8: ClientBalances,
  });

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../../assets/images/login/blue.png')}
        />
        <TabViewAnimated
          style={{ flex: 1, marginTop: 100 }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80BBDF',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
  },
  tabLabel: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    paddingBottom: 6,
  },
  textWalkInBtn: {
    color: '#fff',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 5,
  },
});
