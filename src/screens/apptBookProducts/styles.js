import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Roboto',
  },
  iconContainer: { width: 20, height: 20},
  listItem: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  listItemText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
  },
  listItemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C0C1C6',
  },
});
export default styles;
