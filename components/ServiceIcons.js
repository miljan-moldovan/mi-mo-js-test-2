// @flow
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const ServiceIcons = ({ item }) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <FontAwesome style={{color: '#FFA300', marginRight: 3}}>{Icons.star}</FontAwesome>
      <View style={styles.newClientTag}>
        <Text style={styles.newClientTagText}>NL</Text>
      </View>
      <FontAwesome style={{color: '#115ECD', marginRight: 3, fontSize: 16}}>{Icons.gift}</FontAwesome>
      <View style={styles.clientGroupContainer}>
        <View style={styles.clientGroupLabelContainer}>
          <FontAwesome style={{fontSize: 10, padding: 0 }}>{Icons.userPlus}</FontAwesome>
          <Text style={styles.clientGroupLabel}>LC</Text>
        </View>
        <Text style={styles.dollarSign}>$</Text>
      </View>
      <FontAwesome style={{marginRight: 3}}>{Icons.tag}</FontAwesome>
    </View>

  );
}

export default ServiceIcons;

const styles = StyleSheet.create({
  clientGroupContainer: {
    borderColor: '#00E480',
    borderRadius: 4,
    marginRight: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clientGroupLabelContainer: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clientGroupLabel: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    marginLeft: 2,
  },
  dollarSign: {
    backgroundColor: '#00E480',
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    paddingHorizontal: 4,
    paddingVertical: 1
  },
  newClientTag: {
    backgroundColor: '#082D66',
    borderRadius: 10,
    borderWidth: 1,
    // paddingHorizontal: 3,
    paddingVertical: 0,
    padding: 4,
    marginRight: 3,
  },
  newClientTagText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    padding: 0
  }
});
