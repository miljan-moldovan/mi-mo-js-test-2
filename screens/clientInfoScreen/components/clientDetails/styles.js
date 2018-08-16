import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginTop: 16 },
  inputSwitch: { height: 43 },
  inputSwitchText: { color: '#727A8F' },
  sectionTitle: { height: 38 },
  labelText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
  },
  optionaLabel: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  clientInput: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 16,
    flex: 1,
  },
  clientReferralTypeInput: {
    height: 44,
    backgroundColor: '#fff',
    paddingLeft: 0,
    paddingRight: 24,
    width: '96%',
  },
  unselectedCheck: {
    fontSize: 20,
    color: '#727A8F',
    fontWeight: 'normal',
    width: 20,
    marginRight: 20,
  },
  selectedCheck: {
    fontSize: 20,
    color: '#1ABF12',
    width: 20,
    marginRight: 20,
  },
  addRow: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
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
  deleteText: { color: '#D1242A', fontFamily: 'Roboto-Medium' },
  deleteButton: {
    justifyContent: 'center', alignItems: 'center',
  },
  referredClientView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  inputDivider: { marginBottom: 10 },
  cancelButton: { fontSize: 14, color: 'white' },
  clientReferralTypeContainer: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  inputStyle: { fontFamily: 'Roboto-Light' },
  dateValueStyle: { color: '#727A8F', fontFamily: 'Roboto-Light' },
});
