import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999999,
    backgroundColor: 'rgba(0,0,0,0.8)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  offlineText: { color: '#fff' },
});

export default styles;
