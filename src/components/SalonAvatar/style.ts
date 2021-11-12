import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  imageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapperStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // width: '100%',
  },
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  defaultComponentStyle: {
    position: 'absolute',
    zIndex: 999,
  },
  badgeStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
});
