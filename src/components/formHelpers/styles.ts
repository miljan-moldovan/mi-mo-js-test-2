import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C0C1C6',
    borderBottomColor: '#C0C1C6',
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingLeft: 16,
    justifyContent: 'flex-start',
  },
  placeholderText: {
    color: Colors.placeholderText,
  },
  inputRow: {
    height: 43.5,
    paddingRight: 16,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C0C1C6',
    alignSelf: 'stretch',
  },
  labelText: {
    fontSize: 14,
    lineHeight: 22,
    marginRight: 5,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
  },
  inputText: {
    fontSize: 14,
    lineHeight: 43,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',
  },
  iconStyle: {
    fontSize: 20,
    color: '#727A8F',
    marginLeft: 10,
  },
  textArea: {
    minHeight: 60,
    paddingVertical: 12,
    paddingTop: 12,
    paddingRight: 16,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto',
    marginLeft: 16,
    marginTop: 7,
  },
  dateCancelButtonStyle: {
    width: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateCancelStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 10,
  },
  inputNumber: {
    borderColor: '#1DBF12',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 101,
    height: 28,
    borderRadius: 5,
  },
  inputNumberButton: {
    width: 50,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputNumberLabelText: {
    fontSize: 32,
    color: '#1DBF12',
    fontFamily: 'Roboto-Light',
    lineHeight: 40,
  },
  avatarDefaultComponent: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#115ECD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDefaultComponentText: {
    fontSize: 10,
    color: '#115ECD',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});
export default styles;
