import { createStackNavigator } from 'react-navigation';

import SelectStoreScreen from '../screens/selectStoreScreen';


export default createStackNavigator({
  SelectStore: {
    screen: SelectStoreScreen,
  },
});
