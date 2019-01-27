import { StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

const createStyleSheet = (height: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  list: {
    backgroundColor: Colors.lightGrey,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: Colors.divider,
    // borderColor: Colors.divider,
  },
  item: {
    height,
    backgroundColor: Colors.white,
  },
  itemText: {
    fontSize: 14,
    color: Colors.defaultBlack,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: Colors.divider,
  },
});
export default createStyleSheet;
