import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullSizeCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  inputRow: {
    flex: 1,
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
  greenColor: {
    color: '#1DBF12',
  },
  viewAllButton: {
    paddingHorizontal: 14,
  },
  styleSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    paddingLeft: 15,
    backgroundColor: '#C0C1C6',
  },
  containerForFlatPicker: {
    backgroundColor: '#F1F1F1',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C0C1C6',
  },
  containerForTab: {
    flex: 1,
    flexDirection: 'column',
  },
  rootStyle: {
    flex: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textHeader: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Roboto',
  },
  styleForTouchable: {
    paddingLeft: 10,
  },
});
