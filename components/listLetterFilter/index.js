import React from 'react';
import { StyleSheet, TouchableOpacity, Text, FlatList, View } from 'react-native';

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

const renderItem = (elem, props) => (<TouchableOpacity style={styles.rowItem} onPress={() => { props.onPress(elem.item); }}>
  <Text style={styles.text}>{elem.item}</Text>
                                     </TouchableOpacity>);

const listLetterFilter = props => (
  <FlatList
    style={styles.container}
    data={abecedary}
    renderItem={elem => renderItem(elem, props)}
    keyExtractor={keyExtractor}
    bounces={false}
  />
);

export default listLetterFilter;
