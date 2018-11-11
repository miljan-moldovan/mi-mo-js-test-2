import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 3,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    maxWidth: 311,
    borderRadius: 4,
  },
  inputIcon: {
    width: 16,
    height: 16,
    fontSize: 16,
    alignSelf: 'center',
    resizeMode: 'contain',
    color: 'rgba(255, 255, 255, 0.25)',
  },
  input: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    paddingTop: 0,
    marginTop: 0,
    marginLeft: 22,
    paddingLeft: 0,
  },
  inputFontFamily: {
    fontFamily: 'Roboto-Regular',
  },
  inputPlaceholderFontFamily: {
    fontFamily: 'Roboto-Italic',
  },
  inputLabel: {
    color: 'white',
    fontSize: 12,
    paddingRight: 10,
    fontFamily: 'Roboto-Medium',
  },
  urlValidationIcon: {
    position: 'absolute',
    top: 18,
    right: 10,
  },
  iconCheck: {
    color: 'rgb(0, 207, 71.4)',
  },
  iconTimes: {
    color: 'red',
  },
});
