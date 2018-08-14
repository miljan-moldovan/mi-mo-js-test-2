import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    width: '100%',
    height: '100%',
  },
  cancelButton: { fontSize: 14, color: 'white' },
  topSeparator: { marginTop: 15.5, borderColor: 'transparent', borderWidth: 0 },
  providerInputGroup: { height: 44 },
  sectionTitle: { height: 38 },
  inputSwitchSales: { height: 43, flex: 1 },
  inputSwitchClient: { height: 43 },
  inputSwitchQueue: { height: 43 },
  inputSwitchTextStyle: { color: '#000000' },
  sectionDivider: { height: 37 },
  inputGroupDate: { flex: 1, flexDirection: 'row' },
  InputDate: { flex: 1 },
  valueStyleDate: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
  },
});
