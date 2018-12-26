import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  colContainer: {
    flexDirection: 'column',
  },
  cellContainer: {
    height: 30,
    borderColor: '#C0C1C6',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  cellContainerDisabled: {
    height: 30,
    borderColor: '#C0C1C6',
    backgroundColor: 'rgb(221,223,224)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  oClockBorder: {
    borderBottomColor: '#2c2f34',
  },
  dayOff: {
    backgroundColor: 'rgb(129, 136, 152)',
  },
  exceptionText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    paddingHorizontal: 8,
    color: '#2F3142',
    flex: 1,
  },
  roomContainer: {
    position: 'absolute',
    width: 16,
    backgroundColor: '#082E66',
    right: 0,
    borderRadius: 3,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  roomText: {
    fontSize: 11,
    lineHeight: 11,
    minHeight: 11,
    textAlign: 'center',
    margin: 0,
    padding: 0,
    color: 'white',
    transform: [{ rotate: '-90deg' }],
  },
});
export default styles;
