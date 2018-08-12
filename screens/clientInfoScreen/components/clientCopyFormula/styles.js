import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginTop: 16 },
  cancelButton: { fontSize: 14, color: 'white' },
  optionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  formulaType: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  italicText: {
    fontStyle: 'italic',
  },
  formulasScroller: {
    flex: 9,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  leftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  leftButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
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
    marginBottom: 5,
  },
});
