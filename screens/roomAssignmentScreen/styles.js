import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    paddingBottom: 60,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc',
    opacity: 0.3,
    zIndex: 999,
    elevation: 2,
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
  headerButton: { fontSize: 14, lineHeight: 22, color: 'white' },
  leftButton: { marginLeft: 10 },
  rightButton: { marginRight: 10 },
});
export default styles;
