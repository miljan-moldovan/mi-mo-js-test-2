import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
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
  subTitleText: {
    fontSize: 10,
    lineHeight: 12,
    color: 'white',
  },
  cancelButton: { paddingLeft: 10, fontSize: 14, color: 'white' },
  rightButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  leftButtonContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  leftButtonText: { fontSize: 14, color: 'white', marginLeft: 5 },
  removeButton: { height: 44, alignItems: 'center', justifyContent: 'center' },
  removeButtonText: {
    fontSize: 14, lineHeight: 22, color: '#D1242A', fontFamily: 'Roboto-Medium',
  },
  marginTop: { marginTop: 16 },
});
