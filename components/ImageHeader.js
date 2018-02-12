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
const ImageHeader = (props) => {
  console.log('ImageHeader', props);

  const { searchBar, ...headerProps } = props;
  const searchParams = props.params ?
    { onChangeText: props.params.onChangeText } : null;

  return (
    <View style={styles.container}>
      <Header {...headerProps} />
      {props.searchBar ? props.searchBar(searchParams) : null }
    </View>
  );
};

export default ImageHeader;
