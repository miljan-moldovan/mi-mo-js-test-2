import React from 'react';
import { View, StyleSheet, ActivityIndicator, ViewPropTypes, ViewStylePropTypes } from 'react-native';

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
    opacity: 0.3,
    zIndex: 999,
    elevation: 2,
  },
});
const LoadingOverlay = props => (
  <View style={[styles.container, props.style]}>
    <ActivityIndicator {...props.indicatorProps} />
  </View>
);
LoadingOverlay.propTypes = {
  style: ViewStylePropTypes,
  indicatorProps: ViewPropTypes,
};
LoadingOverlay.defaultProps = {
  style: {},
  indicatorProps: {},
};

export default LoadingOverlay;
