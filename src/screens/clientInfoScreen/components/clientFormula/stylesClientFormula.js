import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    width: '100%',
    height: '100%',
  },
  inputGroupCopy: { flex: 1, height: 44, flexDirection: 'column' },
  inputGroupCopyButton: { flex: 1 },
  dateValueStyle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
  },
  inputDate: { flex: 1 },
  inputButton: { flex: 1 },
  inputGroupAssociated: { flex: 1, flexDirection: 'column' },
  topView: { marginTop: 15.5, borderColor: 'transparent', borderWidth: 0 },
  leftButtonText: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    fontSize: 14,
    color: 'white',
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
  rightButtonText: {
    backgroundColor: 'transparent',
    paddingRight: 10,
    fontSize: 14,
    color: 'white',
  },
});
