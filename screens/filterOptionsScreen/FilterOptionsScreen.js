import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import SalonSearchBar from '../../components/SalonSearchBar';
import SalonFlatPicker from '../../components/SalonFlatPicker';
import apiWrapper from '../../utilities/apiWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchBarContainer: {
    backgroundColor: '#F1F1F1',
  },
  row: {
    height: 43,
    paddingHorizontal: 16,
    borderBottomColor: '#C0C1C6',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    fontSize: 14,
    lineHeight: 44,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
});

export default class FilterOptionsScreen extends React.Component {
  static navigationOptions = rootProps => ({
    title: 'Filter Options',
  });

  constructor(props) {
    super(props);

    this.state = {
      activeData: [],
    };
  }

  componentWillMount() {
    apiWrapper.doRequest('getEmployees', {})
      .then((providers) => {
        this.setState({ activeData: providers });
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SalonSearchBar
            placeholderTextColor="#727A8F"
            iconsColor="#727A8F"
            fontColor="#727A8F"
            backgroundColor="rgba(142,142,147,0.24)"
          // backgroundColor="#F1F1F1"
            borderColor="transparent"
            placeholderText="Start typing to search"
            onChangeText={this.onChangeText}
          />
        </View>
        <View style={{
            // height: 26,
            // flex: 1,
            // overflow: 'hidden',
            backgroundColor: '#F1F1F1',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#C0C1C6',
          }}
        >
          <SalonFlatPicker
            rootStyle={{
              flex: 0,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
            containerStyle={{ backgroundColor: 'white' }}
            selectedColor="#115ECD"
            unSelectedTextColor="#115ECD"
            dataSource={['Providers', 'Resources', 'Rooms', 'Desk Staff']}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>View all providers</Text>
        </View>
        <FlatList
          data={this.state.activeData}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.rowText}>{item.fullName}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}
