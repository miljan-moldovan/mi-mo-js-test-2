import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    height: 39.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    color: '#4D5067',
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    lineHeight: 14,
  },
  tabLabelActive: {
    color: '#1DBF12',
  },
  tabIcon: {
    marginRight: 5,

  },
  textWalkInBtn: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 5,
  },
  leftButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 10,
  },
  titleContainer: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullSize: { flex: 1 },
  flexRow: { flexDirection: 'row' },
});

export default styles;
