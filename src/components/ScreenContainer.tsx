import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import backgroundImage from '../assets/images/login/blue.png';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

const ScreenContainer = props => (
  <View style={styles.container}>
    <Image
      style={styles.backgroundImage}
      source={backgroundImage}
    />
    {props.children}
  </View>
);

ScreenContainer.propTypes = {
  children: PropTypes.element,
};

ScreenContainer.defaultProps = {
  children: null,
};

export default ScreenContainer;
