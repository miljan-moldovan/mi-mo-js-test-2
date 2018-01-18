// @flow
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SideMenuItem = ({ focused, title, icon }) => (
  <View style={styles.itemContainer}>
    <Image source={icon} style={styles.icon} />
    <Text style={[
      styles.label,
      {fontFamily: 'OpenSans-'+( focused? 'Bold' : 'Regular' )}
    ]}>
      {title}
    </Text>
    <Image
      source={require('../assets/images/sidemenu/icon_check_2.png')}
      style={[styles.check, {opacity: focused? 1 : 0}]} />
  </View>
);
export default SideMenuItem;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: 75,
    backgroundColor: 'white',
    marginVertical: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgb(221,221,221)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center'
  },
  icon: {
    width: 30,
    height: 30,
    margin: 30,
    resizeMode: 'contain'
  },
  label: {
    color: 'rgba(17,31,42,1)',
    fontSize: 19,
    fontFamily: 'OpenSans-Regular',
  },
  check: {
    width: 16,
    height: 16,
    marginLeft: 'auto',
    marginRight: 20
  }
});
