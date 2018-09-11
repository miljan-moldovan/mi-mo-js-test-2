import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: { flex: 1 },
  whiteBg: { backgroundColor: Colors.white },
  headerButton: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.white,
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    lineHeight: 44,
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
});
export default styles;
