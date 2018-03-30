import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

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

const renderItem = (item, key, startTime) => (
  <View key={key} style={{ position: 'absolute', top: key * 30 - 6, justifyContent: 'center', alignItems: 'center', height: 12, width: 38}}>
    <Text
      style={styles.textStyle}
    >
      {moment(startTime).add(key * 15, 'm').format('HH:mm').toString()}
    </Text>
  </View>
);

const timeColumn = ({ dataSource, startTime }) => (
  <View style={[styles.container, { height: dataSource.length * 30 }]}>
    {dataSource.map((item, index) => renderItem(item, index, startTime))}
  </View>
);

export default timeColumn;
