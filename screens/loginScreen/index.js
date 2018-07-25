// @flow
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  Alert,
  Modal,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Item, Input, Button, Label } from 'native-base';
// import { Fingerprint } from 'expo';
import TouchID from 'react-native-touch-id';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInputMask from 'react-native-text-input-mask';

import * as actions from '../../actions/login';
import styles from './styles';
import images from './imagesMap';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    waitingLogin: false,
    hasFingerprint: false,
    fingerprintModalVisible: false,
  }

  componentWillMount() {
    TouchID.isSupported()
      .then((biometryType) => {
        // Success code
        if (biometryType === 'FaceID' || biometryType === 'TouchID') {
          this.setState({ hasFingerprint: true });
        } else {
          this.setState({ hasFingerprint: false });
        }
      })
      .catch(() => {
        // Failure code
        this.setState({ hasFingerprint: false });
      });
  }

  componentDidMount() {
    if (this.props.auth.loggedIn && this.props.auth.useFingerprintId) {
      this.handleFingerprintPress();
    }
  }

  handleFingerprintPress = () => {
    // if (Platform.OS === 'android') {
    //   // TO DO present Android specific UI
    // }
    //
    // const { success, error } = await Fingerprint.authenticateAsync();
    // let message;
    // if (success) {
    //   message = 'Fingerprint successfully authenticated';
    //   this.props.updateFingerprintValidationTime();
    // } else if (this.state.hasFingerprint) {
    //   message = 'Error authenticating fingerprint. Reason: '+error;
    // } else {
    //   message = 'Fingerprint authentication is not available on this device.';
    // }
    //
    // Alert.alert(
    //   'Fingerprint authentication',
    //   message,
    //   [
    //     {text: 'OK', onPress: () => console.log('OK Pressed')},
    //   ],
    //   { cancelable: false }
    // );
    // config is optional to be passed in on Android
    const optionalConfigObject = {
      title: 'Authentication Required',
      color: '#e00606',
    };

    TouchID.authenticate('to demo this react-native component', optionalConfigObject)
      .then(() => {
        Alert.alert('Biometry successfully authenticated');

        this.props.updateFingerprintValidationTime();
      })
      .catch(() => {
        Alert.alert('Error authenticating fingerprint');
      });
  }
  handleUsernameChange = (username: string) => this.setState({ username });
  handlePasswordChange = (password: string) => this.setState({ password });
  handleURLChange = (url: string) => this.setState({ url });
  handleForgotPasswordPress = () => this.props.navigation.navigate('ForgotPassword');

  handleLoginPress = () => {
    // if the device supports fingerprint and the user hasn't chosen whether to
    // use it yet, present a dialog
    if (this.state.hasFingerprint && (this.props.auth.useFingerprintId === undefined)) {
      this.setState({ fingerprintModalVisible: true });
    } else {
      this.login();
    }
  }
  login = () => {
    this.setState(
      { waitingLogin: true, error: null },
      () => this.props.login(this.state.username, this.state.password, (success, message) => {
        if (!success) { this.setState({ waitingLogin: false, error: message }); }
        // in case of success, action/reducer sets auth.loggedIn to true,
        // which triggers a re-render that now routes the app to RootStackNavigator
      }),
    );
  }
  handleModalConfirmFingerprint = () => {
    this.props.enableFingerprintLogin();
    this.setState({ fingerprintModalVisible: false }, () => {
      this.handleFingerprintPress();
      this.login();
    });
  }
  handleModalDenyFingerprint = () => {
    this.props.disableFingerprintLogin();
    this.setState({ fingerprintModalVisible: false }, () => this.login());
  }
  handleLogoutPress = () => this.props.logout()

  handlePhonePress = () => {
    Linking.openURL('tel:8554669332');
  }
  handleMailPress = () => {
    Linking.openURL('mailto:support@salonultimate.com');
  }

  renderFingerprintModal() {
    return (
      <Modal
        visible={this.state.fingerprintModalVisible}
        animationType="slide"
        onRequestClose={() => this.closeModal()}
        transparent
      >
        <View style={styles.fingerprintModalContainer}>
          <View style={styles.fingerprintModal}>
            <Image source={images.touchIcon} style={styles.fingerprintImage} />
            <Text style={styles.fingerprintText}>
              Would you like to use <Text style={{ fontFamily: 'OpenSans-Bold' }}>Touch ID</Text> on future logins?
            </Text>
            <Button
              rounded
              bordered
              style={styles.fingerprintAccept}
              onPress={this.handleModalConfirmFingerprint}
            >
              <Text style={styles.fingerprintAcceptText}>Yes, please!</Text>
            </Button>
            <Button
              transparent
              style={styles.fingerprintDeny}
              onPress={this.handleModalDenyFingerprint}
            >
              <Text style={styles.fingerprintDenyText}>No, thank you</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }

  renderUrlField = loggedIn => (
    <View style={styles.inputContainer}>
      <Image source={images.urlIcon} style={styles.inputIcon} />
      <TextInputMask
        refInput={(ref) => { this.input = ref; }}
        onChangeText={this.handleURLChange}
        mask={'[0-9a-z]{10}.salonultimate.com'}
      />
    </View>
  );

  render() {
    const { loggedIn } = this.props.auth;
    return (
      <View style={styles.container}>
        {this.renderFingerprintModal()}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
          >
            <Image
              source={images.logoSimple}
              style={styles.logo}
            />

            {loggedIn &&
            <Text
              style={styles.bodyText}
            >
              You are already logged in. To proceed, please confirm using your fingerprint.
            </Text>
            }
            {!loggedIn && this.renderUrlField(loggedIn)}
            {!loggedIn &&
            <View style={styles.inputContainer}>
              <Image source={images.iconProfile} style={styles.inputIcon} />
              <Item floatingLabel style={styles.item}>
                <Label style={styles.inputLabel}>Username</Label>
                <Input
                  style={styles.input}
                  disabled={loggedIn}
                  autoCorrect={false}
                  blurOnSubmit
                  autoCapitalize="none"
                  onChangeText={this.handleUsernameChange}
                />
              </Item>
            </View>
            }
            { !loggedIn &&
              <View style={styles.inputContainer}>
                <Image source={images.iconLock} style={styles.inputIcon} />
                <Item floatingLabel style={styles.item}>
                  <Label style={styles.inputLabel}>Password</Label>
                  <Input
                    style={styles.input}
                    autoCorrect={false}
                    blurOnSubmit
                    autoCapitalize="none"
                    secureTextEntry
                    onChangeText={this.handlePasswordChange}
                  />
                </Item>
              </View>
            }
            <Button
              rounded
              bordered
              disabled={this.state.waitingLogin}
              style={styles.loginButton}
              onPress={loggedIn ? this.handleLogoutPress : this.handleLoginPress}
            >
              { !this.state.waitingLogin && <Text style={styles.loginButtonText}>{ loggedIn ? 'LOGOUT' : 'LOGIN' } </Text> }
              { this.state.waitingLogin && <ActivityIndicator style={{ marginLeft: 'auto', marginRight: 'auto' }} /> }
            </Button>
            {this.state.error &&
              <Text style={styles.errorMessage}>{this.state.error}</Text>
            }

            <View>
              <Text style={styles.bodyText}>Forgot your Password?...&nbsp;
                <Text
                  style={styles.bodyLink}
                  onPress={this.handleForgotPasswordPress}
                >We&#39;ll Help
                </Text>
              </Text>
            </View>

            <Button
              rounded
              bordered
              style={styles.touchIdButton}
              onPress={this.handleFingerprintPress}
            >
              <Text style={styles.touchIdButtonText}>Touch ID access</Text>
            </Button>

            <View style={styles.footer}>
              <Text
                style={styles.footerText}
              >Don&#39t have an account? Contact our Support at
              </Text>
              <Text style={styles.footerText}>
                <Text style={styles.bodyLink} onPress={this.handlePhonePress}>(855) 466-9332</Text>
                or&nbsp;
                <Text
                  style={styles.bodyLink}
                  onPress={this.handleMailPress}
                >support@salonultimate.com
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
});

LoginScreen.propTypes = {
  disableFingerprintLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  enableFingerprintLogin: PropTypes.func.isRequired,
  updateFingerprintValidationTime: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    loggedIn: PropTypes.bool,
    useFingerprintId: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps, actions)(LoginScreen);
