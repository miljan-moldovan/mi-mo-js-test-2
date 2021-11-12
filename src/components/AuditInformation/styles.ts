import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '92%',
    backgroundColor: '#F1F1F1',
    padding: 15,
  },
  panelInfoIsOpened: {
    maxHeight: 230,
    minHeight: 55,
  },
  panelInfoLine: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  panelInfoShowMoreText: {
    color: '#115ECD',
    fontSize: 10,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  panelInfoShowMore: {
    borderColor: '#CACBCF',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: 100,
    position: 'absolute',
    bottom: 6,
  },
});

export default styles;
