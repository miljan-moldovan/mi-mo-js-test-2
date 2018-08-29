import {
  StyleSheet, Dimensions,
} from 'react-native';

const smallDevice = Dimensions.get('window').width === 320;

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  innerRow: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C0C1C6',
    paddingLeft: smallDevice ? 5 : 10,
    alignItems: 'center',
    paddingRight: smallDevice ? 10 : 16,
  },
  lastInnerRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    paddingRight: smallDevice ? 10 : 16,
    paddingLeft: smallDevice ? 5 : 10,
  },
  addRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: smallDevice ? 10 : 10,
    paddingRight: smallDevice ? 10 : 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#C0C1C6',
  },
  plusIcon: {
    color: '#115ECD',
    fontSize: 22,
    marginRight: 5,
  },
  textData: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
    marginLeft: 5,
  },
  serviceRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#C0C1C6',
    paddingLeft: smallDevice ? 10 : 10,
  },
  iconContainer: {
    paddingRight: smallDevice ? 5 : 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDataContainer: {
    flex: 1,
  },
  removeIcon: {
    marginRight: 8,
    fontSize: 22,
    color: '#D1242A',
  },
  carretIcon: {
    fontSize: 20,
    color: '#727A8F',
  },
  label: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  middleSectionDivider: {
    width: '95%', height: 1, alignSelf: 'center', backgroundColor: '#DDE6F4',
  },
  providerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  providerWrapper: { marginRight: 5 },
  providerRootStyle: { marginLeft: smallDevice ? 5 : 10, paddingRight: smallDevice ? 10 : 16 },
  providerRequestedStyle: { marginLeft: smallDevice ? 5 : 10, paddingRight: smallDevice ? 10 : 16 },
  cancelButton: { fontSize: 14, color: 'white' },

});
