import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { times } from 'lodash';
import moment from 'moment';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 10,
    fontWeight: '500',
  },
  cellStyle: {
    height: 30,
    width: 64,
    borderColor: '#C0C1C6',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const renderItems = item => (
  <View key={item.startTime} style={styles.cellStyle}>
    <Text style={styles.textStyle}>{`${item.availableSlots} avl.`}</Text>
  </View>
);

const availabilityColumn = ({ availability }) => (
  <View>
    {
      availability.map(renderItems)
    }
  </View>
);

export default availabilityColumn;
