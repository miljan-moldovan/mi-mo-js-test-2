import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  panelTopRemarks: {
    textAlign: 'justify',
    color: '#110A24',
    fontSize: 11,
    padding: 5,
    backgroundColor: '#F1F1F1',
    fontFamily: 'Roboto',
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
    bottom: -12,
  },
  buttonShowView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelTopLineLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
    flex: 1,
  },
  panelTopLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#F1F1F1',
  },
  showMoreTextView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
