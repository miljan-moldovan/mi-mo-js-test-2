import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Header } from 'react-navigation';

import backgroundImage from '../assets/images/login/blue.png';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#115ECD',
  },
});
const SalonHeader = (mainProps) => {
  const { searchBar, props } = mainProps;

  const searchParams = props.params ?
    { onChangeText: props.params.onChangeText } : null;

  return (
    <View style={styles.container}>
      <Header {...props} />
      {props.searchBar ? props.searchBar(searchParams) : null }
    </View>
  );
};

export default SalonHeader;
