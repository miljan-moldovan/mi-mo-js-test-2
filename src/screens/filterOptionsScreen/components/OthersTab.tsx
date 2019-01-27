import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import {
  InputGroup,
  InputButton,
  InputDivider,
} from '../../../components/formHelpers';


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
    fontFamily: 'Roboto-Medium',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  blackText: { color: '#110A24' },
  greenColor: { color: '#1DBF12' },
  viewAllStyle: { paddingHorizontal: 14 },
});

const OthersTab = ({ handleSelect, selectedFilter, showResources }) => {
  const selectRooms = () => handleSelect('rooms');
  const selectResources = () => handleSelect('resources');
  const roomIcon = selectedFilter === 'rooms' ?
    <FontAwesome style={styles.greenColor}>{Icons.checkCircle}</FontAwesome> : null;
  const resourceIcon = selectedFilter === 'resources' ?
    <FontAwesome style={styles.greenColor}>{Icons.checkCircle}</FontAwesome> : null;
  return (
    <View style={styles.container}>
      <InputGroup>
        <InputButton
          icon={roomIcon}
          labelStyle={
            selectedFilter === 'rooms' ?
              [styles.rowText, styles.boldText] :
              styles.rowText
          }
          label="View all Rooms"
          onPress={selectRooms}
        />
        <InputDivider/>
        {showResources && <InputButton
          icon={resourceIcon}
          labelStyle={
            selectedFilter === 'resources' ?
              [styles.rowText, styles.boldText]
              : styles.rowText
          }
          label="View all Resources"
          onPress={selectResources}
        />}
      </InputGroup>
    </View>
  );
};
export default OthersTab;
