import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 10,
    fontWeight: '500',
  },
  cellStyle: {
    height: 30,
    width: 102,
    borderColor: '#C0C1C6',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const renderItems = (item, key) => (
  <View key={key} style={styles.cellStyle}>
    <Text style={styles.textStyle}>1 available</Text>
  </View>
);

const availabilityColumn = ({ dataSource }) => (
  <View>
    { dataSource.map((item, index) => renderItems(item, index))}
  </View>
);

export default availabilityColumn;
