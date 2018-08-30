import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { get } from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import WordHighlighter from '../../../components/wordHighlighter';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import { Employees } from '../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import SalonAvatar from '../../../components/SalonAvatar';
import { InputButton, DefaultAvatar } from '../../../components/formHelpers';

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
  },
  boldText: {
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
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  centered: { flex: 1, alignItems: 'center' },
  greenColor: { color: '#1DBF12' },
  viewAllButton: { paddingHorizontal: 14 },
});

const ViewAllProviders = ({ icon, onPress, isSelected, separator }) => (
  <React.Fragment>
    <InputButton
      icon={icon}
      noIcon={!icon}
      style={styles.viewAllButton}
      onPress={onPress}
      label="View All Desk Staff"
      labelStyle={isSelected ? [styles.rowText, styles.boldText] : styles.rowText}
    />
    {separator}
  </React.Fragment>
);

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

  renderItem = ({ item }) => {
    const { selectedFilter, selectedProvider } = this.props;
    const isViewAllSelected = selectedFilter === 'deskStaff' && selectedProvider === 'all';
    const isSelected = (selectedFilter === 'providers' || selectedFilter === 'deskStaff') && get(selectedProvider, 'id', null) === item.id;
    const onPress = () => this.props.handleSelect(item);
    return (
      <SalonTouchableOpacity
        key={item.id}
        style={styles.itemRow}
        onPress={onPress}
      >
        <View style={styles.inputRow}>
          <SalonAvatar
            wrapperStyle={styles.providerRound}
            width={30}
            borderWidth={1}
            borderColor="transparent"
            image={getEmployeePhotoSource(item)}
            defaultComponent={(
              <DefaultAvatar
                provider={item}
              />
            )}
          />
          <WordHighlighter
            highlight={this.props.searchText}
            highlightStyle={styles.greenColor}
            style={isSelected || isViewAllSelected ? [styles.providerName, styles.boldText] : styles.providerName}
          >
            {item.fullName}
          </WordHighlighter>
        </View>
        <View style={styles.centered}>
          {
            isSelected &&
            <FontAwesome style={styles.greenColor}>{Icons.checkCircle}</FontAwesome>
          }
        </View>
      </SalonTouchableOpacity>
    );
  };

  render() {
    const { selectedFilter, selectedProvider } = this.props;
    const loadingStyle = { flex: 1, alignItems: 'center', justifyContent: 'center' };
    const isViewAllSelected = selectedFilter === 'deskStaff';
    const icon = isViewAllSelected && selectedProvider === 'all' ? <FontAwesome style={styles.greenColor}>{Icons.checkCircle}</FontAwesome> : null;
    const changeFilter = () => this.props.handleSelect('all');
    return (
      <View style={styles.container}>
        <ViewAllProviders
          icon={icon}
          isSelected={isViewAllSelected}
          separator={this.renderSeparator()}
          onPress={changeFilter}
        />
        {
          this.props.isLoading
            ? (
              <View style={loadingStyle}>
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
