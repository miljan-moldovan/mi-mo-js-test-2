import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  errorIcon: {
    position: 'absolute',
    zIndex: 300,
    top: 13,
    left: 15,
    width: 12,
    height: 12,
    fontSize: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
    color: 'rgba(209, 36, 41, 1)',
  },
  errorMessage: {
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  errorContainer: {
    // width: 292,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 30,
    paddingRight: 20,
    marginTop: 2,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 311,
    borderRadius: 4,
  },
  errorItemsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  errorListItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  errorListMessage: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: 'rgb(46, 49, 66)',
  },
  bullet: {
    width: 10,
  },
});
