import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  subTitleContainer: {
    height: 54,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  subTitleTextContainer: {
    flex: 1,
  },
  subTitleText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Roboto-Bold',
    color: Colors.defaultGrey,
  },
  guestSubTitle: {
    paddingBottom: 5,
  },
  timeCaretIcon: {
    fontSize: 12,
    marginHorizontal: 3,
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.defaultBlack,
    fontFamily: 'Roboto-Medium',
  },
  serviceInfo: {
    fontSize: 12,
    lineHeight: 24,
    color: Colors.defaultGrey,
    fontFamily: 'Roboto-Light',
  },
  serviceTimeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  serviceTime: {
    color: Colors.defaultGrey,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Roboto',
  },
  guestContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  removeGuestContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginHorizontal: 12,
    alignSelf: 'flex-end',
  },
  removeGuestText: {
    color: Colors.defaultRed,
    marginLeft: 4,
    lineHeight: 12,
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  cardPadding: { paddingVertical: 0 },
  guestInput: {
    flex: 1,
    height: 40,
    paddingRight: 0,
  },
  inputIconColor: { color: Colors.defaultBlue },
  headerButtonText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'white',
  },
});
export default styles;
