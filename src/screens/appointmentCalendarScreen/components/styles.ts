import {StyleSheet} from 'react-native';
import Colors from '../../../constants/Colors';

export default StyleSheet.create ({
  mainContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
  headerSubTitleText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Roboto',
    textAlign: 'center',
    color: Colors.white,
  },
  salonAvatarWrapperContainer: {
    flexDirection: 'row',
  },
  salonAvatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginRight: 6,
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    paddingBottom: 60,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc4d',
  },
  dateTimeContainer: {
    borderWidth: 1,
    borderColor: '#1DBF12',
  },
  dateTimeText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    color: '#1DBF12',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'right',
  },
});

export const headerStyles = StyleSheet.create ({
  container: {
    height: 44,
    backgroundColor: '#115ECD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    paddingTop: 1,
    marginLeft: 16,
  },
  btnTitle: {
    flex: 3 / 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCaretDown: {
    marginLeft: 5,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    flexDirection: 'row',
  },
  btnElipsis: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCalendar: {
    paddingBottom: 2,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSearch: {
    position: 'absolute',
    top: 8,
  },
});
