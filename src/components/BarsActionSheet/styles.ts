import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cancelTitle: {
    fontSize: 20,
    color: '#0C4699',
  },
  loginIconStyle: {
    color: '#115ECD',
    fontSize: 16,
  },
  selectStoreIconStyle: {
    marginLeft: 2,
  },
  actionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: '90%',
  },
  actionItemLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 4,
  },
  actionItemTitle: {
    fontSize: 21,
    fontWeight: '500',
    color: '#115ECD',
  },
  actionItemRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  storeActionWrapper: {
    height: 130,
  },
});
