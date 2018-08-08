import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 63,
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'absolute',
    zIndex: 99999,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    width: '100%',
    backgroundColor: 'rgb(0, 221.85, 71.4)',
  },
  text: {
    marginLeft: '5%',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
  },
  button: {
    width: 100,
    height: 44,
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 1.42,
    color: 'white',
    fontSize: 12,
  },
});
