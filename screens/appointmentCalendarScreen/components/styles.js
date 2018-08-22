import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
  salonAvatarWrapperContainer: {
    flexDirection: 'row',
  },
  salonAvatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginRight: 6,
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    paddingBottom: 60,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc4d',
  },
  dateTimeContainer: {
    borderWidth: 1,
    borderColor: '#1DBF12',
  },
  dateTimeText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#1DBF12',
  }
});
