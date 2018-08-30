import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cancelTitle: {
    fontSize: 20,
    color: '#0C4699',
  },
  loginIconStyle: {
    color: '#115ECD',
    fontSize: 20,
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
  actionItemTitle: {
    fontSize: 21,
    fontWeight: '500',
    color: '#115ECD',
  },
  actionItemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
});
