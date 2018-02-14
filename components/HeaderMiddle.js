import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
    justifyContent: 'center',
    flex: 1,
    // bottom: 0,
    // left: TITLE_OFFSET,
    // right: TITLE_OFFSET,
    // top: 0,
    // position: 'absolute',
  },
});

const headerMiddle = props => (
  <View style={styles.container}>
    {props.title}
    {props.subTitle}
  </View>
);

headerMiddle.propTypes = {
  title: PropTypes.element.isRequired,
  subTitle: PropTypes.element,
};

headerMiddle.defaultProps = {
  subTitle: null,
};

export default headerMiddle;
