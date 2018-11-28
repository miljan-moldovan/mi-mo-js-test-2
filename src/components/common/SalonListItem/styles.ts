import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    height: 44,
    paddingRight: 8,
  },
  content: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginLeft: {
    marginLeft: 5,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.defaultBlack,
    textAlign: 'left',
  },
});
export default styles;