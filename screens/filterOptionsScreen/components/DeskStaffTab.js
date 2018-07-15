import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import WordHighlighter from '../../../components/wordHighlighter';
import { getEmployeePhoto } from '../../../utilities/apiWrapper/api';
import { Employees } from '../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonAvatar from '../../../components/SalonAvatar';

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

export default class DeskStaffTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeData: [],
      deskStaff: [],
      searchText: null,
      refreshing: false,
      isLoading: false,
    };
  }

  componentWillMount() {
    this.getData();
  }

  onRefresh = () => this.getData();

  getData = () => {
    this.setState({ isLoading: true });
    Employees.getEmployees()
      .then((providers) => {
        const filtered = providers.filter(provider => provider.isReceptionist);
        this.setState({ isLoading: false, activeData: filtered, deskStaff: filtered });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
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
      onPress={() => this.props.handleSelect(item)}
      key={index}
    >
      <View style={styles.inputRow}>
        <SalonAvatar
          wrapperStyle={styles.providerRound}
          width={30}
          borderWidth={1}
          borderColor="transparent"
          image={{ uri: getEmployeePhoto(item.id) }}
        />
        <WordHighlighter
          highlight={this.props.searchText}
          style={this.state.selectedProvider === item.id ? [styles.providerName, { color: '#1DBF12' }] : styles.providerName}
          highlightStyle={{ color: '#1DBF12' }}
        >
          {item.fullName}
        </WordHighlighter>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        {this.state.selectedProvider === item.id && (
        <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
        )}
      </View>
    </SalonTouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <SalonTouchableOpacity
          style={styles.row}
          onPress={() => this.props.handleSelect('all')}
        >
          <Text style={styles.rowText}>View All Desk Staff</Text>
        </SalonTouchableOpacity>
        {this.props.isLoading
          ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={this.props.data}
              ItemSeparatorComponent={this.renderSeparator}
              renderItem={this.renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.props.onRefresh}
                />
              }
            />
          )
        }
      </View>
    );
  }
}
