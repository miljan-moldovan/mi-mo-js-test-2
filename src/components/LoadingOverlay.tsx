import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ActivityIndicator, ViewPropTypes, ViewStylePropTypes } from 'react-native';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    paddingBottom: 60,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc',
    opacity: 0.2,
    zIndex: 999,
    elevation: 2,
  },
});
const LoadingOverlay = props => (
  <View style={[styles.container, props.style]}>
    <ActivityIndicator color={props.color} {...props.indicatorProps} />
  </View>
);
LoadingOverlay.propTypes = {
  style: ViewStylePropTypes,
  color: PropTypes.string,
  indicatorProps: ViewPropTypes,
};
LoadingOverlay.defaultProps = {
  style: {},
  color: Colors.defaultBlack,
  indicatorProps: {},
};

export default LoadingOverlay;
