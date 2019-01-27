import * as React from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import SalonTouchableOpacity from '../SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    right: 0,
    height: '100%',
    top: 78,
  },
  rowItem: {
    paddingHorizontal: 3,
  },
  text: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 13,
  },
});

const abecedary = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const keyExtractor = item => item;

const renderItem = (elem, props) => (
  <SalonTouchableOpacity style={styles.rowItem} onPress={() => { props.onPress(elem.item); }}>
    <Text style={styles.text}>{elem.item}</Text>
  </SalonTouchableOpacity>
);

const listLetterFilter = props => (
  <FlatList
    style={[styles.container, props.containerStyle]}
    data={abecedary}
    renderItem={elem => renderItem(elem, props)}
    keyExtractor={keyExtractor}
    bounces={false}
  />
);

export default listLetterFilter;
