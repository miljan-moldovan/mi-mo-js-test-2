import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#727A8F',
    fontSize: 12,
    paddingLeft: 15,
    paddingTop: 8,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
});

const ServiceListHeader = props => (<Text style={styles.text}>{props.header}</Text>);

export default ServiceListHeader;
