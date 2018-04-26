import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import WordHighlighter from '../../../components/wordHighlighter';
import apiWrapper from '../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

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

export default class SalonResourceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resources: [],
      searchText: null,
      refreshing: false,
      selectedResource: null,
    };
  }

  componentWillMount() {
    this.getData();
  }

  onRefresh = () => this.getData();

  getData = () => {
    apiWrapper.doRequest('getResources', {})
      .then((resources) => {
        this.setState({ resources });
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
    <SalonTouchableOpacity
      style={styles.itemRow}
      onPress={() => {}}
      key={index}
    >
      <View style={styles.inputRow}>
        <WordHighlighter
          highlight={this.state.searchText}
          style={this.state.selectedResource === item.id ? [styles.providerName, { color: '#1DBF12' }] : styles.providerName}
          highlightStyle={{ color: '#1DBF12' }}
        >
          {item.fullName}
        </WordHighlighter>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.selectedResource === item.id && (
        <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
        )}
      </View>
    </SalonTouchableOpacity>
  );

  render() {
    return (
      <FlatList
        data={this.state.resources}
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
