import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  headerTitle: {
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
  headerLeftText: { fontSize: 14, color: 'white' },
  headerRightText: { fontSize: 14 },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginTop: 16 },
  inputSwitch: { height: 43 },
  inputSwitchText: { color: '#727A8F' },
  sectionTitle: { height: 38 },
});
