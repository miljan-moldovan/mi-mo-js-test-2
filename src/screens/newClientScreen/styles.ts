import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    height: 39.5,
    // paddingVertical: 14,
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
  headerLeftText: { fontSize: 14, color: 'white' },
  headerRightText: { fontSize: 14 },
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
  leftButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 8,
  },
  backContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
