import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import AvatarWrapper from '../../avatarWrapper';

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

const PreferredProviderHeader = props => (

  <View style={styles.container}>
    {/* <View style={styles.avatarContainer}>
    <AvatarWrapper
      key={props.headerData.preferredProvider.id}
      wrapperStyle={styles.avatar}
      width={44}
      image={props.headerData.preferredProvider.avatar}
    />

  </View> */}

    <Text style={styles.text}>{props.headerData.preferredProvider.name}</Text>

  </View>


);

export default PreferredProviderHeader;
