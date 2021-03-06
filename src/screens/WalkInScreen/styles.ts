import { StyleSheet, Dimensions } from 'react-native';

const smallDevice = Dimensions.get('window').width === 320;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerButton: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  headerLeft: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerRight: {
    paddingRight: 10,
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  rightButtonText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontFamily: 'Roboto',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
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
  headerLeftIcon: { marginRight: 8, fontSize: 30, color: '#fff' },
  activityIndicator: {
    marginTop: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: { paddingLeft: 10, fontSize: 14, color: 'white' },
  inputGroupStyle: { paddingLeft: smallDevice ? 10 : 16 },
  rootStyle: { paddingRight: smallDevice ? 10 : 16 },
  sectionTitleRootStyle: { marginLeft: 0 },
  inputStyle: { fontFamily: 'Roboto-Light' },
  sectionTitleStyle: { marginLeft: smallDevice ? 10 : 16 },
});
