import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingTop: 18,
  },
  row: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  rowFirst: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C0C1C6',
  },
  dataContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  textData: {
    fontFamily: 'Roboto',
    color: '#110A24',
    fontSize: 14,
  },
  iconStyle: {
    tintColor: '#727A8F',
    marginLeft: 5,
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleRow: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: '#727A8F',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputDividerContainer: { width: '100%', backgroundColor: '#FFFFFF' },
  inputDivider: { marginHorizontal: 16 },
  sectionDivider: { height: 37 },
  optionaLabel: {
    fontFamily: 'Roboto',
    color: '#727A8F',
    fontSize: 14,
  },
  clientInput: {
    height: 44,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C0C1C6',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,

  },
  cancelButton: { fontSize: 14, color: 'white' },
});
