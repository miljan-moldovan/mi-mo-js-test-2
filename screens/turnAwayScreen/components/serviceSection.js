import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import SalonIcon from '../../../components/SalonIcon';

const styles = StyleSheet.create({
  row: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#C0C1C6',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  innerRow: {
    flexDirection: 'row',
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
});

const renderService = service => (<View><Text>{service}</Text></View>);

const serviceSection = props => (
  <View style={styles.row} >
    <TouchableOpacity>
      <View style={styles.innerRow}>
        <View style={styles.plusContainer}>
          <SalonIcon style={styles.plusStyle} icon="plus" />
        </View>
        <Text style={styles.textData}>add Service</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export default serviceSection;
