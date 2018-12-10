import * as React from 'react';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Input, Label } from 'native-base';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

function UrlInput(props) {
  return (
    <View style={styles.inputContainer}>
      <FontAwesome style={styles.inputIcon}>{Icons.link}</FontAwesome>
      <Input
        style={[styles.input, props.url ?
          styles.inputFontFamily : styles.inputPlaceholderFontFamily]}
        disabled={props.loggedIn}
        autoCorrect={false}
        blurOnSubmit
        autoCapitalize="none"
        onChangeText={props.handleURLChange}
        placeholder="URL"
        placeholderTextColor="rgb(76.15, 135.15, 216.75)"
        value={props.url}
      />
      {/*<Label*/}
        {/*style={styles.inputLabel}*/}
      {/*>*/}
        {/*.salonultimate.com*/}
      {/*</Label>*/}
      {props.showSuccess && (
        <FontAwesome
          style={[styles.urlValidationIcon, styles.iconCheck]}
        >{Icons.check}
        </FontAwesome>)
      }
      {props.showFail && (
        <FontAwesome
          style={[styles.urlValidationIcon, styles.iconTimes]}
        >{Icons.times}
        </FontAwesome>)
      }
    </View>
  );
}

UrlInput.propTypes = {
  url: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  handleURLChange: PropTypes.func.isRequired,
  showSuccess: PropTypes.bool.isRequired,
  showFail: PropTypes.bool.isRequired,
};

export default UrlInput;
