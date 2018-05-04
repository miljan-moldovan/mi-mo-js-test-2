// @flow
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import { Button } from 'native-base';
import { connect } from 'react-redux';
import * as actions from '../actions/login.js';
import SideMenuItem from '../components/SideMenuItem';

class ScorecardScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: props => (
      <SideMenuItem
        {...props}
        title="Scorecard"
        icon={require('../assets/images/sidemenu/icon_score.png')}
      />
    ),
  };
  state = {

  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')}
        />
        <Text style={styles.title}>Scorecard Screen placeholder</Text>
        <Button rounded bordered style={styles.loginButton} onPress={this.props.logout}>
          <Text style={styles.loginButtonText}>LOGOUT</Text>{ this.state.waitingLogin && <ActivityIndicator /> }
        </Button>
      </View>
    );
  }
}
export default connect(null, actions)(ScorecardScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    padding: 20,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',

  },
  loginButton: {
    width: 250,
    height: 65,
    marginTop: 17,
    marginBottom: 18,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'rgba(48,120,164,1)',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 2,
  },
});
