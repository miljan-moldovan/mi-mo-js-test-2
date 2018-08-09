import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgb(17.85, 94.35, 204)',
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: '3%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 370,
    fontSize: 20,
    color: 'white',
    alignItems: 'center',
  },
  fakeHeaderElement: {
    width: 10,
    height: 10,
  },
  headerText: {
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
    marginTop: 32,
    justifyContent: 'center',
  },
  inputFieldContainer: {
    width: '100%',
  },
  fakeContainer: {
    width: '100%',
    height: 20,
  },

  item: {
    width: 260,
    marginLeft: 18,
    marginTop: 0,
    paddingTop: 0,
    // backgroundColor: '#555'
  },
  inputLabel: {
    color: 'white',
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    paddingTop: 0,
    marginTop: 0,
    paddingLeft: 0,
  },
  inputIcon: {
    width: 28,
    height: 28,
    alignSelf: 'flex-end',
    resizeMode: 'contain',
  },
  bodyText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    backgroundColor: 'transparent',
  },
  actionButton: {
    width: 194,
    height: 44,
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    letterSpacing: 1.17,
  },
  resetPasswordButton: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  resetButtonText: {
    fontSize: 12,
    color: 'rgba(48,120,164,1)',
  },
  backToLoginButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  backToLoginButtonText: {
    fontSize: 14,
    color: 'white',
  },
  linkText: {
    marginTop: 10,
    color: 'rgba(103,163,199,1)',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 300,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 30,
    paddingRight: 20,
    marginTop: 2,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 311,
    borderRadius: 4,
  },
  successIcon: {
    position: 'absolute',
    zIndex: 300,
    top: 13,
    left: 15,
    width: 12,
    height: 12,
    fontSize: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
    color: 'rgb(0, 207, 71.4)',
  },
  successMessageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  successMessage: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: 'rgb(46, 49, 66)',
  },
  successMessageFirstRow: {
    marginBottom: 2,
  },
});

export default styles;
