import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  innerRow: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#C0C1C6',
    paddingLeft: 16,
    alignItems: 'center',
    paddingRight: 16,
  },
  carretIcon: {
    fontSize: 20,
    color: '#727A8F',
  },
  contentStyle: { alignItems: 'flex-start', paddingLeft: 16 },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto',
    marginLeft: 0,
    marginTop: 7,
  },
  rightButtonText: {
    paddingRight: 10,
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  sectionDivider: { height: 37 },
  inputGroup: { marginTop: 16 },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { paddingLeft: 10, fontSize: 14, color: 'white' },
  leftButtonText: { paddingLeft: 10, fontSize: 14, color: 'white' },
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
});
