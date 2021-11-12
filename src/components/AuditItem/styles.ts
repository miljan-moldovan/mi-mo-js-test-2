import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  auditInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  auditInfoHeader: {
    // marginTop: 5,
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  auditInfoText: {
    color: '#3F3F3F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  auditDateText: {
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
});

export default styles;
