import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Text, View } from 'react-native';

import styles from './styles';

function ErrorsView(props) {
  return (
    <View style={styles.errorContainer}>
      <FontAwesome style={styles.errorIcon}>{Icons.exclamationTriangle}</FontAwesome>
      {props.errors.length > 0 && (
        <View style={styles.errorItemsContainer}>
          {props.errors.map((err, index) => (
            <View style={styles.errorListItem}>
              <Text style={styles.bullet}>{'\u2022 '}</Text>
              <Text key={`err__${index}`} style={styles.errorListMessage}>{err}</Text>
            </View>
          ))}
        </View>
      )}
      {props.errors.length === 0 && (
        <Text style={styles.errorMessage}>{props.error}</Text>
      )}
    </View>
  );
}

ErrorsView.defaultProps = {
  error: '',
  errors: [],
};

ErrorsView.propTypes = {
  error: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default ErrorsView;
