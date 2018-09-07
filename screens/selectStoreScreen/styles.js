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
    marginBottom: '2%',
    letterSpacing: 2,
  },
  listItem: {
    width: '85%',
    fontSize: 14,
    color: 'rgb(18, 10, 36)',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 5,
    borderBottomColor: 'rgb(18, 10, 36)',
  },
  listColumnWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(18, 10, 36, 0.3)',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
});
