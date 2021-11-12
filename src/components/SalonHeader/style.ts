import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBlue,
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  titleText: {
    color: Colors.white,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 12,
    color: Colors.white,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
