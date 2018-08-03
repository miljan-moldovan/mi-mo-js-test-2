// @flow
import React from 'react';
import {
  Image,
  Text,
  View,
  Alert,
  Modal,
  Linking,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import AnimatedHideView from 'react-native-animated-hide-view';
import { Input, Button } from 'native-base';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import TouchID from 'react-native-touch-id';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../actions/login';
import styles from './styles';
import images from './imagesMap';
import UserNameInput from '../../components/login/UserNameInput';
import UrlInput from '../../components/login/UrlInput';
import ErrorsView from '../../components/login/ErrorsView';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    waitingLogin: false,
    hasFingerprint: false,
    fingerprintModalVisible: false,
    showLogo: true,
    loginPressed: false,
    urlError: false,
    loginError: false,
    errors: [],
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    if (this.props.auth.loggedIn && this.props.auth.useFingerprintId) {
      this.handleFingerprintPress();
    }

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

  keyboardDidShow = () => {
    this.setState({ showLogo: false });
  }

  keyboardDidHide = () => {
    this.setState({ showLogo: true });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  hideKeyboard = () => {
    Keyboard.dismiss();
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
      this.setState({ loginPressed: true });
      this.login();
    }
  }
  login = () => {
    this.setState(
      { waitingLogin: true, error: null },
      () => this.props.login(
        this.state.url,
        this.state.username,
        this.state.password,
        (success, err) => {
          if (!success) {
            this.setState({
              waitingLogin: false,
              error: err.message,
              urlError: err.error.response.data.urlError,
              loginError: err.error.response.data.loginError,
              errors: err.error.response.data.errors
            });
          }
          // in case of success, action/reducer sets auth.loggedIn to true,
          // which triggers a re-render that now routes the app to RootStackNavigator
        },
      ),
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

  renderPasswordInput = () => (
    <View style={[styles.inputContainer, this.state.loginError ? styles.inputInvalid : null]}>
      <FontAwesome style={styles.inputIcon}>{Icons.unlockAlt}</FontAwesome>
      <Input
        style={[styles.input, this.state.password ?
          styles.inputFontFamily : styles.inputPlaceholderFontFamily]}
        autoCorrect={false}
        blurOnSubmit
        autoCapitalize="none"
        secureTextEntry
        onChangeText={this.handlePasswordChange}
        placeholder="Password"
        placeholderTextColor="rgb(76.15, 135.15, 216.75)"
      />
    </View>
  )

  renderTouchIdButton = () => (
    <Button
      rounded
      bordered
      style={styles.touchIdButton}
      onPress={this.handleFingerprintPress}
    >
      <Text style={styles.touchIdButtonText}>Touch ID access</Text>
    </Button>
  )

  render() {
    const { loggedIn } = this.props.auth;
    const { showLogo } = this.state;

    return (
      <View style={styles.container}>
        {this.renderFingerprintModal()}
        <AnimatedHideView
          visible={showLogo}
          unmountOnHide={true}
        >
          <Image
            source={images.logoWithText}
            style={styles.logo}
          />
        </AnimatedHideView>
        <KeyboardAvoidingView
          style={[{ flex: 1, height: '100%' }]}
          behavior="padding"
        >
          {loggedIn &&
            <Text
              style={styles.bodyText}
            >
              You are already logged in. To proceed, please confirm using your fingerprint.
            </Text>
          }
          <View
            style={showLogo ? styles.mainContent : [
              styles.mainContent,
              styles.mainContentWithLogo]}
          >
            <AnimatedHideView
              visible={!showLogo && !loggedIn}
              unmountOnHide={true}
            >
              <Text
                onPress={this.hideKeyboard}
                style={styles.backButtonLogo}
              >
                <FontAwesome style={styles.backButtonLogo}>
                  {Icons.angleLeft}
                </FontAwesome>
              </Text>
            </AnimatedHideView>
            {!loggedIn && (
              <UrlInput
                loggedIn={loggedIn}
                handleURLChange={this.handleURLChange}
                url={this.state.url}
                showSuccess={this.state.loginPressed &&
                !this.state.urlError && !this.state.waitingLogin}
                showFail={this.state.loginPressed &&
                this.state.urlError && !this.state.waitingLogin}
              />
            )}
            {!loggedIn && (
              <UserNameInput
                handleUsernameChange={this.handleUsernameChange}
                loggedIn={loggedIn}
                userNameError={this.state.loginError}
                username={this.state.username}
              />
            )}
            {!loggedIn && this.renderPasswordInput()}
            {this.state.loginError && <ErrorsView
              errors={this.state.errors}
              error={this.state.error}
            />}
            <Button
              bordered
              disabled={this.state.waitingLogin}
              style={styles.loginButton}
              onPress={loggedIn ? this.handleLogoutPress : this.handleLoginPress}
            >
              { !this.state.waitingLogin && <Text style={styles.loginButtonText}>{ loggedIn ? 'LOGOUT' : 'LOGIN' } </Text> }
              { this.state.waitingLogin && <ActivityIndicator style={{ marginLeft: 'auto', marginRight: 'auto' }} /> }
            </Button>

            <Text
              style={[styles.bodyText, styles.bodyLink, styles.forgotPasswordLink]}
              onPress={this.handleForgotPasswordPress}
            >
              Forgot your Password?
            </Text>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.footer}>
          <Text
            style={styles.footerText}
          >Don&#39;t have an account? Contact our Support at
          </Text>
          <Text style={styles.footerText}>
            <Text style={styles.bodyLink} onPress={this.handlePhonePress}>(855) 466-9332</Text>
            &nbsp;or&nbsp;
            <Text
              style={styles.bodyLink}
              onPress={this.handleMailPress}
            >support@salonultimate.com
            </Text>
          </Text>
        </View>
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
    loggedIn: PropTypes.bool.isRequired,
    useFingerprintId: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, actions)(LoginScreen);
