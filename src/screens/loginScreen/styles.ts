import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {},
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(17.85, 94.35, 204)',
    height: '100%',
  },
  mainContent: {
    minHeight: 120,
    marginBottom: '20%',
  },
  mainContentWithLogo: {
    marginTop: '10%',
  },
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
  item: {
    flex: 1,
    maxWidth: 260,
    marginLeft: 22,
    marginTop: 0,
    paddingTop: 0,
  },
  inputLabel: {
    color: 'white',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  input: {
    color: 'white',
    fontSize: 16,
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
  inputIcon: {
    width: 16,
    height: 16,
    fontSize: 16,
    alignSelf: 'center',
    resizeMode: 'contain',
    color: 'rgba(255, 255, 255, 0.25)',
  },
  inputInvalid: {
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'red',
  },
  logo: {
    marginTop: '25%',
    marginBottom: '10%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 139,
    width: 122,
  },
  backButtonLogo: {
    color: 'white',
    height: 20,
    width: 20,
    fontSize: 16,
    marginLeft: '5%',
    marginTop: '10%',
    marginBottom: '10%',
  },
  loginButton: {
    width: 194,
    height: 44,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'white',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'rgba(48,120,164,1)',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 2,
  },
  touchIdButton: {
    width: 250,
    height: 50,
    marginTop: 62,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: 'white',
    alignItems: 'center',
  },
  touchIdButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  footer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
    paddingHorizontal: 20,
    height: 80,
  },
  bodyText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  footerText: {
    color: 'rgba(103,163,199,1)',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    backgroundColor: 'transparent',
  },
  bodyLink: {
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'Roboto-Bold',
  },
  forgotPasswordLink: {
    marginTop: 20,
  },
  fingerprintModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
  },
  fingerprintModal: {
    backgroundColor: 'white',
    borderRadius: 6,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintImage: {
    width: 130,
    height: 130,
    marginTop: 40,
  },
  fingerprintText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(10,39,74,1)',
    textAlign: 'center',
    width: 300,
    marginTop: 41,
    paddingLeft: 10,
    paddingRight: 10,
  },
  fingerprintAccept: {
    backgroundColor: 'rgba(103,163,199,1)',
    width: 220,
    height: 58,
    marginTop: 52,
    borderColor: 'white',
    alignSelf: 'center',
  },
  fingerprintAcceptText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  fingerprintDeny: {
    width: 220,
    height: 58,
    marginTop: 27,
    marginBottom: 30,
    alignSelf: 'center',
  },
  fingerprintDenyText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(107,103,99,1)',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});