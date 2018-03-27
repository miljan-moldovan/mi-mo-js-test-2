import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 36,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#C0C1C6',
  },
  textStyle: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center'
  }
});

const renderItem = (item, key) => (
  <View key={key} style={{ position: 'absolute', top: key * 30 - 6, justifyContent: 'center', alignItems: 'center', height: 12, width: 38}}>
    <Text
      style={styles.textStyle}
    >
      {item}
    </Text>
  </View>
);

const timeColumn = ({ dataSource }) => (
  <View style={[styles.container, { height: dataSource.length * 30 }]}>
    {dataSource.map((item, index) => renderItem(item, index))}
  </View>
);

export default timeColumn;
