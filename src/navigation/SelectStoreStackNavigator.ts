import {createStackNavigator} from 'react-navigation';

import SelectStoreScreen from '@/screens/SelectStoreScreen';

export default createStackNavigator ({
  SelectStore: {
    screen: SelectStoreScreen,
  },
});
