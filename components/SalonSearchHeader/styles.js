import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    backgroundColor: '#115ECD',
    height: 115,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#115ECD',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 35,

    // paddingBottom: 8,
  },
  topSearchBar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSearchBarText: {
    color: '#1D1D26',
    fontSize: 12,
    marginLeft: 30,
    fontFamily: 'Roboto',
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  filterBarContainer: {
    backgroundColor: '#115ECD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
