import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(17.85, 94.35, 204)',
    height: '100%',
  },
  headerStyle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
    marginBottom: '10%',
    letterSpacing: 2,
  },
  listItem: {
    color: 'white',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '5%',
    marginBottom: '5%',
    letterSpacing: 2,
  },
});
