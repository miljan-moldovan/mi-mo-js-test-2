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
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { Form, Item, Input, Button, Label } from 'native-base';
import { Fingerprint } from 'expo';
import { connect } from 'react-redux';
import * as actions from '../actions/login.js';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    loaded: false,
    waitingLogin: false,
    hasFingerprint: false,
    fingerprintModalVisible: false,
    fingerprintRequestAndroidVisible: false
  }
  async componentWillMount() {
    // check if device has a fingerprint sensor.
    const hasFingerprintHardware = await Fingerprint.hasHardwareAsync();
    let hasFingerprint = false;
    if (hasFingerprintHardware) {
      // check if the user has saved fingerprints in the device
      hasFingerprint = await Fingerprint.isEnrolledAsync();
    }
    this.setState({ hasFingerprint });
  }

  async componentDidMount() {
    console.log('componentDidMount', this.props.auth.loggedIn, this.props.auth.useFingerprintId, this.props.auth.fingerprintAuthenticationTime);
    if (this.props.auth.loggedIn && this.props.auth.useFingerprintId) {
      this._handleFingerprintPress();
    }
  }

  _handleFingerprintPress = async () => {
    if (Platform.OS === 'android') {
      // TO DO present Android specific UI
    }
    console.log('_handleFingerprintPress');
    const { success, error } = await Fingerprint.authenticateAsync();
    let message;
    if (success) {
      message = 'Fingerprint successfully authenticated';
      this.props.updateFingerprintValidationTime();
    } else if (this.state.hasFingerprint) {
      message = 'Error authenticating fingerprint. Reason: '+error;
    } else {
      message = 'Fingerprint authentication is not available on this device.';
    }

    Alert.alert(
      'Fingerprint authentication',
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
  }
  _handleUsernameChange = (username: string) => this.setState({ username });
  _handlePasswordChange = (password: string) => this.setState({ password });
  _handleURLChange = (url: string) => this.setState({ url });
  _handleForgotPasswordPress = () => this.props.navigation.navigate('ForgotPassword');

  _handleLoginPress = () => {
    console.log('_handleLoginPress', this.state.hasFingerprint, this.props.auth.useFingerprintId);
    // if the device supports fingerprint and the user hasn't chosen whether to
    // use it yet, present a dialog
    if (this.state.hasFingerprint && (this.props.auth.useFingerprintId === undefined)) {
      this.setState({ fingerprintModalVisible: true });
    } else {
      this.login();
    }
  }
  login = () => {
    this.setState({ waitingLogin: true, error: null },
      () => this.props.login(this.state.username, this.state.password, (success, message)=> {
        if (!success)
          this.setState({ waitingLogin: false, error: message });
        // in case of success, action/reducer sets auth.loggedIn to true,
        // which triggers a re-render that now routes the app to RootStackNavigator
      }));
  }
  _handleModalConfirmFingerprint = () => {
    this.props.enableFingerprintLogin();
    this.setState({ fingerprintModalVisible: false }, () => {
      this._handleFingerprintPress();
      this.login()
    });
  }
  _handleModalDenyFingerprint = () => {
    this.props.disableFingerprintLogin();
    this.setState({ fingerprintModalVisible: false }, () => this.login() );
  }
  _handleLogoutPress = () => {
    return this.props.logout();
  }

  _handlePhonePress = () => {
    Linking.openURL('tel:8554669332');
  }
  _handleMailPress = () => {
    Linking.openURL('mailto:support@salonultimate.com')
  }

  renderFingerprintModal() {
    return (
      <Modal
        visible={this.state.fingerprintModalVisible}
        animationType={'slide'}
        onRequestClose={() => this.closeModal()}
        transparent={true}
        >
        <View style={styles.fingerprintModalContainer}>
          <View style={styles.fingerprintModal}>
            <Image source={require('../assets/images/login/touch-icon.png')} style={styles.fingerprintImage} />
            <Text style={styles.fingerprintText}>
              Would you like to use <Text style={{fontFamily: 'OpenSans-Bold'}}>Touch ID</Text> on future logins?
            </Text>
            <Button rounded bordered style={styles.fingerprintAccept} onPress={this._handleModalConfirmFingerprint}>
              <Text style={styles.fingerprintAcceptText}>Yes, please!</Text>
            </Button>
            <Button transparent style={styles.fingerprintDeny} onPress={this._handleModalDenyFingerprint}>
              <Text style={styles.fingerprintDenyText}>No, thank you</Text>
            </Button>
          </View>
        </View>
      </Modal>
    )
  }

  render() {
    const { loggedIn } = this.props.auth;
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../assets/images/login/blue.png')} />
        {this.renderFingerprintModal()}
        <KeyboardAvoidingView
           style={{ flex: 1 }}
           behavior="padding"
         >
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
            <Image
              source={require('../assets/images/login/logo-simple.png')}
              style={styles.logo} />
            <View style={styles.inputContainer}>
              <Image source={require('../assets/images/login/url_icon.png')} style={styles.inputIcon} />
              <Item floatingLabel style={styles.item}>
                <Label style={{ color:'white', fontFamily: 'OpenSans-Regular' }}>URL</Label>
                <Input style={styles.input} disabled={loggedIn} autoCorrect={false} blurOnSubmit={true} autoCapitalize="none" onChangeText={this._handleURLChange} />
              </Item>
            </View>

            <View style={styles.inputContainer}>
              <Image source={require('../assets/images/login/icon_profile.png')} style={styles.inputIcon} />
              <Item floatingLabel style={styles.item}>
                <Label style={{ color:'white', fontFamily: 'OpenSans-Regular' }}>Username</Label>
                <Input style={styles.input} disabled={loggedIn} autoCorrect={false} blurOnSubmit={true} autoCapitalize="none" onChangeText={this._handleUsernameChange}  />
              </Item>
            </View>
            { loggedIn && <Text style={styles.bodyText}>You are already logged in. To proceed, please confirm using your fingerprint.</Text>}
            { !loggedIn &&
              <View style={styles.inputContainer}>
                <Image source={require('../assets/images/login/icon_lock.png')} style={styles.inputIcon} />
                <Item floatingLabel style={styles.item}>
                  <Label style={{ color:'white', fontFamily: 'OpenSans-Regular' }}>Password</Label>
                  <Input style={styles.input} autoCorrect={false} blurOnSubmit={true} autoCapitalize="none" secureTextEntry={true} onChangeText={this._handlePasswordChange} />
                </Item>
              </View>
            }
            <Button rounded bordered disabled={this.state.waitingLogin} style={styles.loginButton} onPress={ loggedIn ? this._handleLogoutPress : this._handleLoginPress }>
              { !this.state.waitingLogin && <Text style={styles.loginButtonText}>{ loggedIn ? 'LOGOUT': 'LOGIN' } </Text> }
              { this.state.waitingLogin && <ActivityIndicator style={{ marginLeft: 'auto', marginRight: 'auto' }}/> }
            </Button>
            {this.state.error &&
              <Text style={styles.errorMessage}>{this.state.error}</Text>
            }

            <View>
              <Text style={styles.bodyText}>Forgot your Password? <Text style={styles.bodyLink} onPress={this._handleForgotPasswordPress}>We'll Help</Text></Text>
            </View>

            <Button rounded bordered style={styles.touchIdButton} onPress={this._handleFingerprintPress}>
              <Text style={styles.touchIdButtonText}>Touch ID access</Text>
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? Contact our Support at</Text>
              <Text style={styles.footerText}><Text style={styles.bodyLink} onPress={this._handlePhonePress}>(855) 466-9332</Text> or <Text style={styles.bodyLink}  onPress={this._handleMailPress}>support@salonultimate.com</Text></Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  console.log('login-map');
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(LoginScreen);

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#333'
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  inputContainer: {
    // width: 292,
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 30,
    // backgroundColor: '#333',
    justifyContent: 'center'
  },
  item: {
    flex: 1,
    maxWidth: 260,
    marginLeft: 18,
    marginTop: 0,
    paddingTop: 0,
    // backgroundColor: '#555'
  },
  inputLabel: {
    color: 'white'
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    paddingTop: 0,
    marginTop: 0,
    paddingLeft: 0
  },
  inputIcon: {
    width: 28,
    height: 28,
    alignSelf: 'flex-end',
    resizeMode: 'contain'
  },
  logo: {
    marginTop: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 37,
    height: 72,
    width: 72
  },
  loginButton: {
    width: 250,
    height: 65,
    marginTop: 17,
    marginBottom: 18,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    alignItems: 'center'
  },
  loginButtonText: {
    color: 'rgba(48,120,164,1)',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 2
  },
  touchIdButton: {
    width: 250,
    height: 50,
    marginTop: 62,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: 'white',
    alignItems: 'center'
  },
  touchIdButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  footer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 60,
    marginBottom: 20,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 80
  },
  bodyText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent'
  },
  footerText: {
    color: 'rgba(103,163,199,1)',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent'
  },
  bodyLink: {
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-Bold'
  },
  fingerprintModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
  },
  fingerprintModal: {
    backgroundColor: 'white',
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fingerprintImage: {
    width: 130,
    height: 130,
    marginTop: 40
  },
  fingerprintText: {
    fontSize: 22,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(10,39,74,1)',
    textAlign: 'center',
    width: 300,
    marginTop: 41,
    paddingLeft: 10,
    paddingRight: 10
  },
  fingerprintAccept: {
    backgroundColor: 'rgba(103,163,199,1)',
    width: 220,
    height: 58,
    marginTop: 52,
    borderColor: 'white',
    alignSelf: 'center'
  },
  fingerprintAcceptText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  fingerprintDeny: {
    width: 220,
    height: 58,
    marginTop: 27,
    marginBottom: 30,
    alignSelf: 'center'
  },
  fingerprintDenyText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(107,103,99,1)',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderColor: 'white'
  }
});
