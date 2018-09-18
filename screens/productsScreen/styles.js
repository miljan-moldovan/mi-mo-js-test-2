import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    backgroundColor: Colors.dividerGrey,
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
    marginLeft: 5,
  },
  iconStyle: {
    lineHeight: 18,
    alignSelf: 'flex-start',
  },
});
export default styles;
