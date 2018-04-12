import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from '../../UI/Icon';
import SalonAvatar from '../../SalonAvatar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fff',
  },
  dayText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#110A24',
  },
  dateText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#110A24',
  },
  cellStyle: {
    flexDirection: 'column',
    width: 45,
    borderColor: '#C0C1C6',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  avatarStyle: {
    marginRight: 12,
  },
});

const renderItems = (item, key) => {
  return (
  <View style={styles.cellStyle} key={key}>
    <Text numberOfLines={1} style={styles.dayText}>{moment(item).format('ddd')}</Text>
    <Text numberOfLines={1} style={styles.dateText}>{moment(item).format('DD')}</Text>
  </View>
)};

const headerTop = ({ dataSource }) => {
  return (
  <View style={styles.container}>
    {dataSource.map((item, index) => renderItems(item, index))}
  </View>
)};

export default headerTop;
