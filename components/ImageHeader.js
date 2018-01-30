import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Header } from 'react-navigation';

import backgroundImage from '../assets/images/login/blue.png';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

const ImageHeader = props => (
  <View style={styles.container}>
    <Image
      style={StyleSheet.absoluteFillObject}
      source={backgroundImage}
    />
    <Header {...props} />
  </View>
);

export default ImageHeader;
