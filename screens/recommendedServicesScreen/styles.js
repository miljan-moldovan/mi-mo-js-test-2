import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  headerTitleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,
    color: 'white',
  },
  headerSubtitleText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 12,
    color: 'white',
  },
  headerButtonText: { fontSize: 14, color: 'white' },
  robotoMedium: { fontFamily: 'Roboto-Medium' },
  listItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  listItemContainer: {
    flex: 9 / 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemText: {
    fontSize: 14,
    color: '#2F3142',
  },
  priceText: { fontSize: 12, color: '#115ECD' },
  iconContainer: { flexDirection: 'row', flex: 1 / 10, alignItems: 'flex-end', justifyContent: 'center' },
  icon: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  listItemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C0C1C6',
  },
  marginTop: { marginTop: 14 },
});
export default styles;
