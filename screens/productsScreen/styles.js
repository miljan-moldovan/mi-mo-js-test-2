import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: { flex: 1 },
  rootView: {
    marginTop: -44,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  noContentContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.noContentBackground,
  },
  noContentText: {
    fontSize: 13,
    lineHeight: 15,
    color: Colors.defaultGrey,
    fontFamily: 'Roboto-Medium',
  },
  caretIcon: {
    marginHorizontal: 10,
  },
  flexRow: { flexDirection: 'row' },
  whiteBg: { backgroundColor: Colors.white },
  headerButton: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.white,
  },
  itemRow: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 6,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.defaultBlack,
  },
  selectedText: {
    color: Colors.selectedGreen,
    fontFamily: 'Roboto-Medium',
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginLeft: 16,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeText: {
    fontSize: 11,
    color: Colors.serviceCheckBlack,
  },
  priceText: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.defaultGrey,
    alignSelf: 'flex-end',
  },
  searchBarContainer: { paddingHorizontal: 8 },
  highlightText: {
    color: Colors.selectedGreen,
  },
  iconContainer: {
    width: 14,
    marginHorizontal: 8,
  },
  iconStyle: {
    lineHeight: 18,
    alignSelf: 'flex-start',
  },
  headerStyle: {
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 10,
    height: 44,
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: '#fff',
  },
  sectionHeaderContainer: {
    height: 38,
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sectionHeaderText: {
    color: '#727A8F',
    fontSize: 12,
    paddingLeft: 15,
    paddingTop: 8,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  categoryIconStyle: {
    fontSize: 20,
    color: '#727A8F',
    marginHorizontal: 10,
  },
});
export default styles;
