import * as React from 'react';
import {
  Image,
  Text,
  View,
  Alert,
  Modal,
  Linking,
  ActivityIndicator,
  Keyboard,
  EmitterSubscription,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AnimatedHideView from 'react-native-animated-hide-view';
import { Input, Button } from 'native-base';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import TouchID from 'react-native-touch-id';
import PropTypes from 'prop-types';

import { ErrorObj } from '@/redux/actions/login';

import styles from './styles';
import images from './imagesMap';
import UserNameInput from '../../components/login/UserNameInput';
import UrlInput from '../../components/login/UrlInput';
import ErrorsView from '../../components/ErrorsView';

interface IReduxProps {
  auth: IAuth,
};

const errorWithUndefiend = 'The server has returned an error. undefined';
const errorPasswordIsRequired = 'The server has returned an error. The Password field is required.';
const errorUserNaameIsRequired = 'The server has returned an error. The Username field is required.';
const commonErrorMessage = 'Something went wrong. Check your credentials';

interface IProps extends IReduxProps {
  disableFingerprintLogin: () => void,
  logout: () => void,
  enableFingerprintLogin: () => void,
  updateFingerprintValidationTime: () => void,
  login: (url, username, password, fn) => void,
  navigation: any,
  changeUsername: (username) => void,
  changeURL: (url) => void,
};

type IState = {
  waitingLogin: boolean,
  hasFingerprint: boolean,
  fingerprintModalVisible: boolean,
  showLogo: boolean,
  loginPressed: boolean,
  urlError: boolean,
  loginError: boolean,
  error: any,
  errors: ErrorObj[],
  password: string,
};

type IAuth = {
  loggedIn: () => void,
  useFingerprintId?: boolean,
  username: string,
  url: string,
};

export default class LoginScreen extends React.Component<IProps, IState, any> {
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    disableFingerprintLogin: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    enableFingerprintLogin: PropTypes.func.isRequired,
    updateFingerprintValidationTime: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      loggedIn: PropTypes.bool.isRequired,
      useFingerprintId: PropTypes.bool,
      username: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    changeUsername: PropTypes.func.isRequired,
    changeURL: PropTypes.func.isRequired,
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
    error: null,
    password: '',
  };
  private keyboardDidShowListener: EmitterSubscription;
  private keyboardDidHideListener: EmitterSubscription;

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );

    if (this.props.auth.loggedIn && this.props.auth.useFingerprintId) {
      this.handleFingerprintPress();
    }
  }

  handleFingerprintPress = () => {
    // config is optional to be passed in on Android
    const optionalConfigObject = {
      title: 'Authentication Required',
      color: '#e00606',
    };

    TouchID.authenticate(
      'to demo this react-native component',
      optionalConfigObject,
    )
      .then(() => {
        Alert.alert('Biometry successfully authenticated');

        this.props.updateFingerprintValidationTime();
      })
      .catch(() => {
        Alert.alert('Error authenticating fingerprint');
      });
  };

  keyboardDidShow = () => {
    this.setState({ showLogo: false });
  };

  keyboardDidHide = () => {
    this.setState({ showLogo: true });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  handleUsernameChange = (username: string) =>
    this.props.changeUsername(username);
  handlePasswordChange = (password: string) => this.setState({ password });
  handleURLChange = (url: string) => this.props.changeURL(url);
  handleForgotPasswordPress = () =>
    this.props.navigation.navigate('ForgotPassword');

  handleLoginPress = () => {
    // if the device supports fingerprint and the user hasn't chosen whether to
    // use it yet, present a dialog
    if (
      this.state.hasFingerprint &&
      this.props.auth.useFingerprintId === undefined
    ) {
      this.setState({ fingerprintModalVisible: true });
    } else {
      this.setState({ loginPressed: true });
      this.login();
    }
  };
  login = () => {
    this.setState({ waitingLogin: true, error: null }, () =>
      this.props.login(
        this.props.auth.url,
        this.props.auth.username,
        this.state.password,
        (success, err) => {
          if (!success) {
            this.handleErrorAfterLogin(err);
          }
          // in case of success, action/reducer sets auth.loggedIn to true,
          // which triggers a re-render that now routes the app to RootStackNavigator
        },
      ),
    );
  };

  handleErrorAfterLogin = (err) => {
    if (this.isItCommonError(err)) {
      this.setState({
        waitingLogin: false,
        error: commonErrorMessage,
        urlError: err.error.response.data.urlError,
        loginError: err.error.response.data.loginError,
        errors: [],
      });
    } else {
      this.setState({
        waitingLogin: false,
        error: err.message,
        urlError: err.error.response.data.urlError,
        loginError: err.error.response.data.loginError,
        errors: err.error.response.data.errors,
      });
    }
  };

  isItCommonError = (err) => {
    return err && (err.message !== errorWithUndefiend
    || err.message !== errorPasswordIsRequired || err.message !== errorUserNaameIsRequired);
  };

  handleModalConfirmFingerprint = () => {
    this.props.enableFingerprintLogin();
    this.setState({ fingerprintModalVisible: false }, () => {
      this.handleFingerprintPress();
      this.login();
    });
  };
  handleModalDenyFingerprint = () => {
    this.props.disableFingerprintLogin();
    this.setState({ fingerprintModalVisible: false }, () => this.login());
  };
  handleLogoutPress = () => this.props.logout();

  handlePhonePress = () => {
    Linking.openURL('tel:8554669332');
  };
  handleMailPress = () => {
    Linking.openURL('mailto:support@salonultimate.com');
  };

  renderFingerprintModal() {
    // @ts-ignore
    return (
      <Modal
        visible={this.state.fingerprintModalVisible}
        animationType="slide"
        // Todo Need check if it is work. Because closeModal is not exist
        // @ts-ignore
        onRequestClose={() => this.closeModal()}
        transparent
      >
        <View style={styles.fingerprintModalContainer}>
          <View style={styles.fingerprintModal}>
            <Image
              source={images.touchIcon}
              // @ts-ignore problem with native base types
              style={styles.fingerprintImage}
            />
            <Text style={styles.fingerprintText}>
              Would you like to use
              {' '}
              <Text style={{ fontFamily: 'OpenSans-Bold' }}>Touch ID</Text>
              {' '}
              on future logins?
            </Text>
            <Button
              rounded
              bordered
              // @ts-ignore problem with native base types
              style={styles.fingerprintAccept}
              onPress={this.handleModalConfirmFingerprint}
            >
              <Text style={styles.fingerprintAcceptText}>Yes, please!</Text>
            </Button>
            <Button
              transparent
              // @ts-ignore problem with native base types
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
    <View
      style={[
        styles.inputContainer,
        this.state.loginError ? styles.inputInvalid : null,
      ]}
    >
      <FontAwesome style={styles.inputIcon}>{Icons.unlockAlt}</FontAwesome>
      <Input
        style={[
          styles.input,
          this.state.password
            ? styles.inputFontFamily
            : styles.inputPlaceholderFontFamily,
        ]}
        autoCorrect={false}
        blurOnSubmit
        autoCapitalize="none"
        secureTextEntry
        onChangeText={this.handlePasswordChange}
        placeholder="Password"
        placeholderTextColor="rgb(76.15, 135.15, 216.75)"
      />
    </View>
  );

  renderTouchIdButton = () => (
    <Button
      rounded
      bordered
      // @ts-ignore problem with native base types
      style={styles.touchIdButton}
      onPress={this.handleFingerprintPress}
    >
      <Text style={styles.touchIdButtonText}>Touch ID access</Text>
    </Button>
  );

  render() {
    const { loggedIn, url, username } = this.props.auth;
    const { showLogo } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {this.renderFingerprintModal()}
          <AnimatedHideView visible={showLogo} unmountOnHide={true}>
            <Image
              source={images.logoWithText}
              // @ts-ignore problem with native base types
              style={styles.logo}
            />
          </AnimatedHideView>
          {
            __DEV__ &&
            (
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                <Button
                  bordered
                  disabled={this.state.waitingLogin}
                  // @ts-ignore problem with native base types
                  style={[styles.loginButton, { width: 130, height: 50 }]}
                  onPress={() => this.props.login(
                    'nw.dev.sg.salondev.net',
                    'frank@zonaprofessional.com',
                    'SevenSlySnakes',
                    () => {},
                  )}
                >
                  <Text style={[styles.loginButtonText, { fontSize: 12 }]}>
                    LOGIN AS DEVELOPER
                  </Text>
                </Button>
                <Button
                  bordered
                  disabled={this.state.waitingLogin}
                  // @ts-ignore problem with native base types
                  style={[styles.loginButton, { width: 130, height: 50 }]}
                  onPress={() => this.props.login(
                    'nw.qa.sg.salondev.net',
                    'olga.filippova@salonultimate.com',
                    'qafirst',
                    () => {},
                  )}
                >
                  <Text style={[styles.loginButtonText, { fontSize: 12 }]}>
                    LOGIN AS QA
                  </Text>
                </Button>
              </View>
            )
          }
          <AnimatedHideView
            visible={!showLogo && !loggedIn}
            unmountOnHide={true}
          >
            <Text onPress={this.hideKeyboard} style={styles.backButtonLogo}>
              <FontAwesome style={styles.backButtonLogo}>
                {Icons.angleLeft}
              </FontAwesome>
            </Text>
          </AnimatedHideView>
          {loggedIn &&
          <Text style={styles.bodyText}>
            You are already logged in. To proceed, please confirm using your fingerprint.
          </Text>}
          <View
            style={
              showLogo
                ? styles.mainContent
                : [styles.mainContent, styles.mainContentWithLogo]
            }
          >
            {!loggedIn &&
            <UrlInput
              loggedIn={loggedIn}
              handleURLChange={this.handleURLChange}
              url={url}
              showSuccess={
                this.state.loginPressed &&
                !this.state.urlError &&
                !this.state.waitingLogin
              }
              showFail={
                this.state.loginPressed &&
                this.state.urlError &&
                !this.state.waitingLogin
              }
            />}
            {!loggedIn &&
            <UserNameInput
              handleUsernameChange={this.handleUsernameChange}
              loggedIn={loggedIn}
              userNameError={this.state.loginError}
              username={username}
            />}
            {!loggedIn && this.renderPasswordInput()}
            {
              this.state.loginError && this.state.error &&
                <ErrorsView
                  errors={this.state.errors}
                  error={this.state.error}
                />
            }
            <Button
              bordered
              disabled={this.state.waitingLogin}
              // @ts-ignore problem with native base types
              style={styles.loginButton}
              onPress={
                loggedIn ? this.handleLogoutPress : this.handleLoginPress
              }
            >
              {!this.state.waitingLogin &&
              <Text style={styles.loginButtonText}>
                {loggedIn ? 'LOGOUT' : 'LOGIN'}{' '}
              </Text>}
              {this.state.waitingLogin &&
              <ActivityIndicator
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              />}
            </Button>

            <Text
              style={[
                styles.bodyText,
                styles.bodyLink,
                styles.forgotPasswordLink,
              ]}
              onPress={this.handleForgotPasswordPress}
            >
              Forgot your Password?
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don&#39;t have an account? Contact our Support at
            </Text>
            <Text style={styles.footerText}>
              <Text style={styles.bodyLink} onPress={this.handlePhonePress}>
                (855) 466-9332
              </Text>
              &nbsp;or&nbsp;
              <Text style={styles.bodyLink} onPress={this.handleMailPress}>
                support@salonultimate.com
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
