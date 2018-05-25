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

import apiWrapper from '../../utilities/apiWrapper';
import WordHighlighter from '../../components/wordHighlighter';
import SalonSearchBar from '../../components/SalonSearchBar';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';


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

export default class FilterByCompanyScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Filter By Position',
    headerLeft: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.state.params.goBack()}>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto' }}>
          Cancel
        </Text>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity wait={3000} onPress={() => navigation.state.params.handleSave()}>
        <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Roboto-Medium' }}>
          Done
        </Text>
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
      companies: [],
      activeData: [],
      selectedCompany: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  onRefresh = () => this.getData();

  getData = () => {
    this.setState({ isLoading: true });
    apiWrapper.doRequest('getCompanies', {})
      .then(companies => this.setState({ isLoading: false, companies, activeData: companies }))
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

      const filtered = FilterByCompanyScreen.flexFilter(this.state.companies, criteria);
      this.setState({ activeData: filtered });
    } else {
      this.setState({ activeData: this.state.companies });
    }
  }

  handleChangeCompany = (item) => {
    const selectedCompany =
      this.state.selectedCompany !== null &&
      this.state.selectedCompany.id === item.id ?
        null : item;
    this.setState({ selectedCompany });
  };

  handleSave = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onChangeCompany, onNavigateBack, dismissOnSelect } = this.props.navigation.state.params;
    if (this.props.navigation.state.params && onChangeCompany) { onChangeCompany(this.state.selectedCompany); }
    if (dismissOnSelect) { onNavigateBack(); }
  }

  goBack = () => {
    if (!this.props.navigation.state || !this.props.navigation.state.params) {
      return;
    }
    const { onNavigateBack, dismissOnSelect } = this.props.navigation.state.params;
    if (dismissOnSelect) { onNavigateBack(); this.props.navigation.goBack(); }
  }

  renderItem = ({ item, index }) => {
    const isSelected = this.state.selectedCompany !== null && this.state.selectedCompany.id === item.id;
    return (
      <SalonTouchableOpacity
        style={styles.itemRow}
        onPress={() => this.handleChangeCompany(item)}
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
