import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 12,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    flex: 0.6,
    //  marginLeft: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {


  },
});

const LastVisitHeader = props => (

  <View style={styles.container}>
    <Text style={styles.text}>{props.headerData.header}</Text>
  </View>


);

export default LastVisitHeader;
