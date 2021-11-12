import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  rightButtonContainer: {
    // paddingTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
  //  paddingTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    // paddingTop: 25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,
    color: 'white',
  },
  headerTitleSubTitle: {
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 12,
    color: 'white',
  },
  headerLeftText: { paddingLeft: 10, fontSize: 14, color: 'white' },
  headerRightText: { paddingRight: 10, fontSize: 14 },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  weeksTextSyle: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  serviceNameText: {
    color: '#000',
    fontFamily: 'Roboto',
    fontSize: 14,
    marginBottom: 10,
  },
  employeeNameText: {
    color: '#000',
    fontFamily: 'Roboto-Light',
    fontSize: 12,
  },
  serviceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
