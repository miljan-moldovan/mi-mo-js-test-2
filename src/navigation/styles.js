import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  headerStyle: {
    backgroundColor: '#115ECD',
    paddingLeft: 10,
    paddingRight: 10,
    height: 44,
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 0,
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
    marginBottom: 5,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
