import React from 'react';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Input } from 'native-base';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

function UserNameInput(props) {
  const {
    loggedIn,
    userNameError,
    username,
    handleUsernameChange,
  } = props;

  return (
    <View style={[styles.inputContainer, userNameError ? styles.inputInvalid : null]}>
      <FontAwesome style={styles.inputIcon}>{Icons.user}</FontAwesome>
      <Input
        style={[styles.input, username ?
          styles.inputFontFamily : styles.inputPlaceholderFontFamily]}
        underline={false}
        disabled={loggedIn}
        autoCorrect={false}
        blurOnSubmit
        autoCapitalize="none"
        onChangeText={handleUsernameChange}
        placeholder="Username"
        placeholderTextColor="rgb(76.15, 135.15, 216.75)"
      />
    </View>
  );
}

UserNameInput.propTypes = {
  handleUsernameChange: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  userNameError: PropTypes.bool.isRequired,
};

export default UserNameInput;
