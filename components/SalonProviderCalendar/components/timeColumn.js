import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { times } from 'lodash';
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

const renderItem = (key, apptGridSettings) => (
  <View key={key} style={{ position: 'absolute', top: key * 40 - 6, justifyContent: 'center', alignItems: 'center', height: 12, width: 38}}>
    <Text
      style={styles.textStyle}
    >
      {moment(apptGridSettings.startTime).add(key * apptGridSettings.step, 'm').format('HH:mm').toString()}
    </Text>
  </View>
);

const timeColumn = ({ apptGridSettings }) => (
  <View style={[styles.container, { height: apptGridSettings.numOfRow * 40 }]}>
    {times(apptGridSettings.numOfRow, index => renderItem(index, apptGridSettings))}
  </View>
);

export default timeColumn;
