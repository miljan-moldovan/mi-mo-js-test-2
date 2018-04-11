import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import WordHighlighter from '../../../components/wordHighlighter';
import apiWrapper from '../../../utilities/apiWrapper';

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
  itemRow: {
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'white',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#C0C1C6',
  },
  inputRow: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  providerName: {
    fontSize: 14,
    marginLeft: 7,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default class SalonRoomList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      searchText: null,
      refreshing: false,
      selectedRoom: null,
    };
  }

  componentWillMount() {
    this.getData();
  }

  onRefresh = () => this.getData();

  getData = () => {
    apiWrapper.doRequest('getRooms', {})
      .then((rooms) => {
        this.setState({ rooms });
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  renderSeparator = () => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        width: '100%',
        backgroundColor: '#C0C1C6',
      }}
    />
  );

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemRow}
      onPress={() => {}}
      key={index}
    >
      <View style={styles.inputRow}>
        <WordHighlighter
          highlight={this.state.searchText}
          style={this.state.selectedRoom === item.id ? [styles.providerName, { color: '#1DBF12' }] : styles.providerName}
          highlightStyle={{ color: '#1DBF12' }}
        >
          {item.fullName}
        </WordHighlighter>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.selectedRoom === item.id && (
        <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
        )}
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <FlatList
        data={this.state.rooms}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      />
    );
  }
}
