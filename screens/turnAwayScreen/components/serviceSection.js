import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import SalonIcon from '../../../components/SalonIcon';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  innerRow: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
  },
  lastInnerRow: {
    flexDirection: 'row',
    height: 44,
  },
  addRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
  },
  plusContainer: {
    backgroundColor: '#115ECD',
    height: 22,
    width: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  textData: {
    fontFamily: 'Roboto-Medium',
    color: '#110A24',
    fontSize: 14,
  },
  serviceRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
  },
  iconContainer: {
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDataContainer: {
    flex: 1,
  },
  removeIcon: {
    marginRight: 8,
  },
});

const renderService = service => (
  <View style={styles.serviceRow}>
    <View style={styles.iconContainer}>
      <SalonIcon style={styles.removeIcon} icon="cross" />
      <Text>service</Text>
    </View>
    <View style={styles.serviceDataContainer}>
      <View style={styles.innerRow}>
        <Text>{service}</Text>
      </View>
      <View style={styles.lastInnerRow}>
        <Text>{service}</Text>
      </View>
    </View>
  </View>
);

const serviceSection = props => (
  <View style={styles.container}>
    {renderService('test')}
    <TouchableOpacity>
      <View style={styles.addRow}>
        <View style={styles.plusContainer}>
          <SalonIcon style={styles.plusStyle} icon="plus" />
        </View>
        <Text style={styles.textData}>add Service</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export default serviceSection;
