// @flow
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux';
import * as actions from '../actions/login.js';

class SideMenu extends React.Component {
  state = {

  }

  render() {
    console.log('SideMenu render');
    console.log(this.props);
    console.log(this.props.navigation);
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Image style={styles.headerBackground} source={require('../assets/images/sidemenu/background_top.png')} />
          <View style={styles.profilePicture} />
          <Text style={styles.headerTitle}>KELLY MANAGER</Text>
        </View>
        <ScrollView style={{ marginBottom: 80 }}>
          <DrawerItems {...this.props} />
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <View style={styles.footerButtonInner}>
              <Image style={styles.footerButtonIcon} source={require('../assets/images/sidemenu/icon_help.png')} />
              <Text style={styles.footerButtonText}>
                Support
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerButton, { marginLeft: 1 }]}>
            <View style={styles.footerButtonInner}>
              <Image style={styles.footerButtonIcon} source={require('../assets/images/sidemenu/icon_help.png')} />
              <Text style={styles.footerButtonText}>
                Settings
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('login-map 1');
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, actions)(SideMenu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  header: {
    height: 130,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    borderBottomWidth: 1.7,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  profilePicture: {
    height: 58,
    width: 58,
    borderRadius: 29,
    borderColor: 'white',
    borderWidth: 1,
    marginLeft: 17,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 12,
    backgroundColor: 'transparent',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: 130,
    resizeMode: 'cover',
    backgroundColor: 'yellow',
  },
  footer: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(16,34,47,1)',
  },
  footerButton: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(243,244,244,1)',
  },
  footerButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonIcon: {
    width: 26,
    height: 26,
  },
  footerButtonText: {
    color: 'rgba(17,31,42,1)',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    marginLeft: 9,
    backgroundColor: 'transparent',
  },
});
