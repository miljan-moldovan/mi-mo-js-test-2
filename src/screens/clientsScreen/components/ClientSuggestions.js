import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import SuggestionList from '../../../components/suggestionList';

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  modalContent: {
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#115ECD',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBarContainer: {
    backgroundColor: '#115ECD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionList: {
    backgroundColor: '#FFFFFF',
    flex: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSearchBar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default class ClientSuggestions extends React.Component {
  constructor(props) {
    super(props);
  }


  selectItem = (item) => {
    this.props.onPressItem(item);
  }


  render() {
    return (
      <View key={Math.random().toString()} style={styles.container}>
        <View style={styles.suggestionList}>
          <SuggestionList
            list={this.props.clientsState.filteredSuggestions}
            boldWords={this.props.salonSearchHeaderState.searchText}
            onPress={this.selectItem}
          />
        </View>
      </View>
    );
  }
}
