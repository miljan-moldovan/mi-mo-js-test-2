// @flow
import * as React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Button} from 'native-base';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import styles from './styles';
import UserNameInput from '../../components/login/UserNameInput';
import UrlInput from '../../components/login/UrlInput';
import ErrorsView from '../../components/ErrorsView';

import {Auth} from '../../utilities/apiWrapper';
import * as actions from '../../redux/actions/login';

class ForgotPassword extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    usernameError: false,
    resetPressed: false,
    waitingReset: false,
    urlError: false,
    resetSuccess: false,
    resetErrors: [],
  };

  handleUsernameChange = (username: string) => {
    this.props.changeUsername (username);
  };

  handleResetPasswordPress = async () => {
    this.setState (
      {
        resetPressed: true,
        waitingReset: true,
      },
      async () => {
        const {username, url} = this.props.auth;
        const response = await Auth.resetPassword ({url, username});
        this.setState ({
          waitingReset: false,
          resetSuccess: response.success,
          urlError: response.errors.urlError,
          usernameError: response.errors.usernameError,
          resetErrors: response.errorMessages,
        });
      }
    );
  };

  handleURLChange = (url: string) => this.props.changeURL (url);
  handleBackToLoginButtonPress = () => this.props.navigation.goBack ();

  renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text
        onPress={this.handleBackToLoginButtonPress}
        style={[styles.backButtonLogo, styles.bodyText, styles.headerText]}
      >
        <FontAwesome style={[styles.backButtonLogo]}>
          {Icons.angleLeft}
        </FontAwesome>
      </Text>
      <Text style={[styles.bodyText, styles.headerText]}>Reset Password</Text>
      <Text style={styles.fakeHeaderElement} />
    </View>
  );

  renderResetButton = () => (
    <View>
      <Button
        transparent
        style={[styles.actionButton, styles.resetPasswordButton]}
        onPress={this.handleResetPasswordPress}
      >
        {this.state.waitingReset &&
          <ActivityIndicator
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />}
        {!this.state.waitingReset &&
          <Text style={[styles.actionButtonText, styles.resetButtonText]}>
            RESET PASSWORD
          </Text>}
      </Button>
      <Text style={styles.linkText}>
        We&#39;ll email you a password reset link
      </Text>
    </View>
  );

  renderBackToLoginButton = () => (
    <View>
      <Button
        transparent
        style={[styles.actionButton, styles.backToLoginButton]}
        onPress={this.handleBackToLoginButtonPress}
      >
        {this.state.waitingReset &&
          <ActivityIndicator
            style={{marginLeft: 'auto', marginRight: 'auto'}}
          />}
        {!this.state.waitingReset &&
          <Text style={[styles.actionButtonText, styles.backToLoginButtonText]}>
            Back to Login
          </Text>}
      </Button>
      <Text style={styles.linkText}>
        If the email doesn&#39;t show up soon, check your spam folder.
        We sent it from support@salonultimate.com.
      </Text>
    </View>
  );

  renderSuccessContent = () => (
    <View style={styles.successContainer}>
      <FontAwesome style={styles.successIcon}>{Icons.check}</FontAwesome>
      <View style={styles.successMessageWrapper}>
        <Text style={[styles.successMessage, styles.successMessageFirstRow]}>
          Link sent successfully!
        </Text>
        <Text style={styles.successMessage}>
          We&#39;ve sent an email to
          {' '}
          {this.props.auth.username}
          {' '}
          with password reset instructions
        </Text>
      </View>
    </View>
  );

  render = () => {
    const {usernameError} = this.state;
    const {username, url} = this.props.auth;
    //console.log(username, url);

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={[{flex: 1, height: '100%'}]}
          behavior="padding"
        >
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {this.renderHeader ()}
            <View style={styles.inputFieldContainer}>
              {!this.state.resetSuccess &&
                <UrlInput
                  loggedIn={false}
                  handleURLChange={this.handleURLChange}
                  url={url}
                  showSuccess={
                    this.state.resetPressed &&
                      !this.state.urlError &&
                      !this.state.waitingReset
                  }
                  showFail={
                    this.state.resetPressed &&
                      this.state.urlError &&
                      !this.state.waitingReset
                  }
                />}
              {!this.state.resetSuccess &&
                <UserNameInput
                  handleUsernameChange={this.handleUsernameChange}
                  loggedIn={false}
                  username={username}
                  userNameError={usernameError}
                />}
              {this.state.resetSuccess && this.renderSuccessContent ()}
              {!this.state.resetSuccess &&
                this.state.resetPressed &&
                this.state.resetErrors.length > 0 &&
                <ErrorsView errors={this.state.resetErrors} />}
              {!this.state.resetSuccess && this.renderResetButton ()}
              {this.state.resetSuccess && this.renderBackToLoginButton ()}
            </View>
            <View style={styles.fakeContainer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };
}

const mapStateToProps = state => ({
  auth: state.auth,
});

ForgotPassword.propTypes = {
  navigation: PropTypes.shape ({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape ({
    username: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  changeUsername: PropTypes.func.isRequired,
  changeURL: PropTypes.func.isRequired,
};

export default connect (mapStateToProps, actions) (ForgotPassword);
