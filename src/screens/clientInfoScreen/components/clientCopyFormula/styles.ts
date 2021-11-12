import {
  StyleSheet,
} from 'react-native';

const createStyleSheet = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginTop: 16 },
  cancelButton: { paddingLeft: 10, fontSize: 14, color: 'white' },
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
  headerTitle: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  headerLeftText: {
    paddingLeft: 10, marginTop: 20, fontSize: 14, color: 'white',
  },
  headerRightText: { paddingRight: 10, marginTop: 20, fontSize: 14 },
});


export default createStyleSheet;