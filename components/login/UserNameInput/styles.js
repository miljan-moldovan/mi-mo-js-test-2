import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
  inputInvalid: {
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'red',
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
});

export default styles;
