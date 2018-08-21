import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  serviceTimeContainer: {
    marginTop: 11,
  },
  serviceRemainingWaitTime: {
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
  },
  serviceTime: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#000',
  },
  chevronRightIcon: {
    fontSize: 10,
    color: '#000000',
    marginTop: 2,
    paddingHorizontal: 3,
  },
  serviceClockIcon: {
    fontSize: 12,
    color: '#7E8D98',
    paddingRight: 3,
    marginTop: 2,
  },
  apptLabel: {
    paddingLeft: 5,
    fontSize: 10,
    height: 10,
    width: 10,
    color: '#53646F',
  },
  serviceTimeRight: {
    flexDirection: 'row',
    minWidth: 50,
    minHeight: 15,
  },
  serviceTimeLeft: {
    flexDirection: 'row',
    minWidth: 50,
    minHeight: 15,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
