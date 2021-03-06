import {
  StyleSheet,
} from 'react-native';

const createStyleSheet = () => StyleSheet.create({
  headerContainer: {
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#115ECD',
    borderBottomWidth: 0,
    borderWidth: 0,
    elevation: 0,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    // paddingHorizontal: 19,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: 'transparent',
    // backgroundColor: 'red'
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
    alignSelf: 'center',
  },
  searchContainer: {
    borderRadius: 10,
    backgroundColor: 'rgba(12,70,153,1)',
    height: 36,
    marginHorizontal: 6,
    // marginBottom: 6,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  searchIcon: {
    marginLeft: 7,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  search: {
    margin: 7,
    height: 36,
    borderWidth: 0,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  navButton: {
    color: 'white',
    fontSize: 16,
    // marginLeft: 10,
  },
  actionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    height: 55,
    width: '90%',
  },
  actionItemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 4,
  },
  actionItemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  actionItemTitle: { fontSize: 21, fontWeight: '500', color: '#115ECD' },
  cancelTitle: { fontSize: 20, color: '#0C4699' },
});

export default createStyleSheet;