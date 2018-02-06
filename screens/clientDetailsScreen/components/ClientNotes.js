import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import Button from '../../../components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#1D1D26',

  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#67A3C7',
  },
  noteContainer: {
    paddingHorizontal: 35,
    paddingVertical: 15,
  },
  noteMeta: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'rgba(29,29,38,0.35)',
  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    color: 'rgba(29,29,38,1)',
  },
});

export default class ClientNotes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NOTES</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => console.log('pressed filter btn')}
          >
            <Text style={styles.filterBtnText}>FILTER</Text>
            <Image style={{ marginLeft: 5, height: 20, width: 20 }} source={require('../../../assets/images/icons/icon_filter.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.noteContainer}>
          <Text style={styles.noteMeta}>
            By <Text style={styles.textBold}>John Doe</Text> at 03/12/2012 - 11:40AM
          </Text>
          <Text>Whatever dawg, this is like the dummy content of the note and shizz.</Text>
          <View style={styles.noteFooter}>
            <Button buttonStyle={styles.queueBtn} textStyle={styles.queueBtnText} text="Queue" onPress={() => console.log('thangs')} />
          </View>
        </View>
      </View>
    );
  }
}
