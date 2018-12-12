import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  pickerItem: {
    backgroundColor: Colors.white,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loadingStyle: {
    height: 100,
  },
  container: {
    flex: 1,
  },
  noPadding: {
    paddingLeft: 0,
  },
  openDialog: {
    color: Colors.secondaryLightBlue,
  },
});

export default styles;
