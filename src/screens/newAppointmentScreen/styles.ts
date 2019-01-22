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
    alignSelf: 'flex-end',
    marginRight: 32,
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
  containerForTrashButton: {
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: -10,
    right: -10,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingRight: 10,
    width: 32,
    height: 35,
  },
  containerForServiceInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  textRequired: {
    fontSize: 10,
    marginLeft: 6,
    color: '#1DBF12',
  },
  styleAddonIcon: {
    marginRight: 10,
    transform: [{ rotate: '90deg' }],
  },
  containerServiceTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  styleIconAngleRight: {
    color: '#115ECD',
    fontSize: 20,
    marginLeft: 15,
  },
  containerAvatarWithText: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  salonAvatarWrapperStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  styleIconLock: {
    color: '#1DBF12',
    fontSize: 10,
  },
  separatorStyle: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: '#E0EAF7',
    marginVertical: 7,
  },
  containerSalonAppointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conflictBox: {
    marginHorizontal: 10,
    marginTop: 0,
    marginBottom: 10,
  },
  containerStylesSalonCard: {
    marginVertical: 0,
    marginBottom: 10,
  },
  bodyStylesSalonCard: {
    paddingTop: 7,
    paddingBottom: 13,
  },
  rootViewInSalonCard: {
    flex: 1,
    flexDirection: 'column',
  },
});
export default styles;
