import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const headerMiddle = (props) => {
  console.log('headerprops', props);
  return (
    <View style={styles.container}>
      {props.title}
      {props.subTitle}
    </View>
  );
};

headerMiddle.propTypes = {
  title: PropTypes.element.isRequired,
  subTitle: PropTypes.element,
};

headerMiddle.defaultProps = {
  subTitle: null,
};

export default headerMiddle;
