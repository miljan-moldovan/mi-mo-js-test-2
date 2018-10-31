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

import { Employees } from '../../utilities/apiWrapper';
import WordHighlighter from '../../components/wordHighlighter';
import HeaderLateral from '../../components/HeaderLateral';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonFlatPicker from '../../components/SalonFlatPicker';
import SalonAvatar from '../../components/SalonAvatar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import headerStyles from '../../constants/headerStyles';


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
  leftButtonText: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    fontSize: 14,
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,
    color: 'white',
  },
  rightButtonText: {
    backgroundColor: 'transparent',
    paddingRight: 10,
    fontSize: 14,
    color: 'white',
  },
});

export default class FilterByPositionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    ...headerStyles,
    headerTitle: (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Filter By Position
        </Text>
      </View>
    ),
    headerLeft: (
      <SalonTouchableOpacity style={{ paddingLeft: 10 }} wait={3000} onPress={() => navigation.goBack()}>
        <Text style={styles.leftButtonText}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity style={{ paddingRight: 10 }} wait={3000} onPress={navigation.getParam('handleSave', () => { })}>
        <Text style={styles.rightButtonText}>Done</Text>
      </SalonTouchableOpacity>
    ),
  });

  static flexFilter(list, info) {
    let matchesFilter = [];
    const matches = [];

    matchesFilter = function match(item) {
      let count = 0;
      for (let n = 0; n < info.length; n += 1) {
        if (item[info[n].Field] && item[info[n].Field].toLowerCase().indexOf(info[n].Values) > -1) {
          count += 1;
        }
      }
      return count > 0;
    };

    for (let i = 0; i < list.length; i += 1) {
      if (matchesFilter(list[i])) {
        matches.push(list[i]);
      }
    }

    return matches;
  }

  constructor(props) {
    super(props);

    this.props.navigation.setParams({
      handleSave: this.handleSave,
      goBack: this.goBack,
    });
    this.state = {
      isLoading: false,
      refreshing: false,
      positions: [],
      activeData: [],
      selectedPosition: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  onRefresh = () => this.getData();

  getData = () => {
    this.setState({ isLoading: true });
    Employees.getEmployeePositions()
      .then(positions => this.setState({ isLoading: false, positions, activeData: positions }))
      .catch((err) => {
        console.warn(err);
        this.setState({ isLoading: false });
      });
  }

  filter = (searchText) => {
    if (searchText && searchText.length > 0) {
      const criteria = [
        { Field: 'name', Values: [searchText.toLowerCase()] },
      ];

      const filtered = FilterByPositionScreen.flexFilter(this.state.positions, criteria);
      this.setState({ activeData: filtered });
    } else {
      this.setState({ activeData: this.state.positions });
    }
  }

  handleChangePosition = (item) => {
    const selectedPosition =
      this.state.selectedPosition !== null &&
        this.state.selectedPosition.id === item.id ?
        null : item;
    this.setState({ selectedPosition });
  };

  handleSave = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangePosition, onNavigateBack, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangePosition) { onChangePosition(this.state.selectedPosition); }
    if (dismissOnSelect) { this.props.navigation.goBack(); }
  }

  goBack = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onNavigateBack, dismissOnSelect } = this.props.navigation.state.params;
    if (dismissOnSelect) { onNavigateBack(); }
  }

  renderItem = ({ item, index }) => {
    const isSelected = this.state.selectedPosition !== null && this.state.selectedPosition.id === item.id;
    return (
      <SalonTouchableOpacity
        style={styles.itemRow}
        onPress={() => this.handleChangePosition(item)}
        key={index}
      >
        <View style={styles.inputRow}>
          <WordHighlighter
            highlight={this.state.searchText}
            style={isSelected ? [styles.providerName, { color: '#1DBF12' }] : styles.providerName}
            highlightStyle={{ color: '#1DBF12' }}
          >
            {item.name}
          </WordHighlighter>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {isSelected && (
            <FontAwesome style={{ color: '#1DBF12' }}>{Icons.checkCircle}</FontAwesome>
          )}
        </View>
      </SalonTouchableOpacity>
    );
  };

  renderSeparator = () => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        width: '100%',
        backgroundColor: '#C0C1C6',
      }}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SalonSearchBar
            placeholderTextColor="#727A8F"
            iconsColor="#727A8F"
            fontColor="#727A8F"
            backgroundColor="rgba(142,142,147,0.24)"
            borderColor="transparent"
            placeHolderText="Search"
            onChangeText={this.filter}
          />
        </View>
        {this.state.isLoading
          ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={this.state.activeData}
              ItemSeparatorComponent={this.renderSeparator}
              renderItem={this.renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
            />
          )
        }
      </View>
    );
  }
}
