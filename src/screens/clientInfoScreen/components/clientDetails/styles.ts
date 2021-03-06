import {
  StyleSheet,
} from 'react-native';

const createStyleSheet = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  activityIndicator: {
    marginHorizontal: 10, height: 14, alignItems: 'flex-end', justifyContent: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    paddingBottom: 60,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc4d',
  },
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
  iconStyle: {
    fontSize: 20,
    color: '#727A8F',
    marginLeft: 10,
  },
  willNotProvideText: { color: '#D1242A', fontFamily: 'Roboto-Medium' },
  deleteText: { color: '#D1242A', fontFamily: 'Roboto-Medium' },
  deleteButton: {
    justifyContent: 'center', alignItems: 'center',
  },
  referredClientView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  inputDivider: { marginBottom: 10 },
  cancelButton: { paddingLeft: 10, fontSize: 14, color: 'white' },
  clientReferralTypeContainer: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  inputStyle: { fontFamily: 'Roboto-Light' },
  dateValueStyle: { color: '#727A8F', fontFamily: 'Roboto-Light' },
  autocompleteContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  suggestionStyle: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C0C1C6',
  },
  inputContainerStyle: {
    paddingVertical: 10,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputRow: {
    minHeight: 43.5,
    paddingRight: 16,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backContainer: {},
  backIcon: {},
  leftButtonText: {},
  headerRightText: {}
  
});

export default createStyleSheet;