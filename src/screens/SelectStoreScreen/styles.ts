import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const styles = StyleSheet.create({
  listItemContainer: {
    backgroundColor: Colors.white,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    height: '100%',
  },
  headerStyle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10%',
    marginBottom: '2%',
    letterSpacing: 2,
  },
  contentWrapper: { flex: 1 },
  listItem: {
    width: '100%',
    fontSize: 14,
    color: 'rgb(18, 10, 36)',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 5,
    borderBottomColor: 'rgb(18, 10, 36)',
  },
  listColumnWrapper: {
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  spinnerStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    color: Colors.selectedGreen,
  },
  selectedItemIcon: {
    color: Colors.selectedGreen,
    position: 'absolute',
    right: 0,
  },
  leftButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  selectedStoreWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    fontSize: 14,
    color: 'rgb(18, 10, 36)',
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 45,
  },
});
export default styles;
