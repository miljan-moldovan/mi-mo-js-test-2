import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

export default StyleSheet.create({
  serviceCategoriesList: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  selectedProvider: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedProviderName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  serviceCategoryListContainer: {
    flex: 9,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  dividerComponent: {
    marginLeft: 16,
    height: StyleSheet.hairlineWidth,
    color: Colors.divider,
  },
  checkIcon: {
    fontSize: 15,
    marginLeft: 10,
    textAlign: 'center',
    color: '#1DBF12',
  },
});
