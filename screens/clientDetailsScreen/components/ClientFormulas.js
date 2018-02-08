import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import Button from '../../../components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80BBDF',
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
  noteFooter: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 5,
    justifyContent: 'flex-start',
  },
});

// const notes = require('../../../mockData/clientDetails/notes.json');

export default class ClientNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeData: [],
    };
  }

  componentWillMount() {
    // this.setState({ activeData: notes });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FORMULAS</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => console.log('pressed filter btn')}
          >
            <Text style={styles.filterBtnText}>FILTER</Text>
            <Image style={{ marginLeft: 5, height: 20, width: 20 }} source={require('../../../assets/images/icons/icon_filter.png')} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <FlatList
            data={this.state.activeData}
            renderItem={({item, index}) => {
              return (
              <View key={index} style={styles.noteContainer}>
                <Text style={styles.noteMeta}>
                    By {item.name} at {item.date}
                </Text>
                <Text>{item.text}</Text>
                <View style={styles.noteFooter}>
                  <Button type="small" text="Hair" onPress={() => console.log('thangs')} />
                </View>
              </View>
            )}}
          />
          <Button type="light" text="+ ADD FORMULA" onPress={null} />
        </ScrollView>
      </View>
    );
  }
}
