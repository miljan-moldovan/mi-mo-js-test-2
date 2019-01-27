import { StyleSheet } from 'react-native';

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
  leftButton: {
    paddingLeft: 10,
  },
  rightButton: {
    paddingRight: 10,
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
    zIndex: 0,
  },
  leftButtonText: {
    backgroundColor: 'transparent',
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
    fontSize: 14,
    color: 'white',
  },
  styleSelectorWithRemove: {
    color: '#110A24',
    fontSize: 14,
    lineHeight: 18,
    marginRight: 7,
    fontFamily: 'Roboto-Medium',
  },
  heightForInputSwitch: {
    height: 43,
  },
  styleForInputButton: {
    flex: 1,
  },
  styleForSectionTitle: {
    height: 38,
  },
});
