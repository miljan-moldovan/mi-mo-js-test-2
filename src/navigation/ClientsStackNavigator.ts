import { get } from 'lodash';
import { StackNavigator } from 'react-navigation';

import ClientsScreen from '../screens/clientsScreen';
import NewClientScreen from '../screens/newClientScreen';

import ClientNotes from '../screens/clientInfoScreen/components/clientNotes';
import ClientFormulas from '../screens/clientInfoScreen/components/clientFormulas';
import ClientNote from '../screens/clientInfoScreen/components/clientNote';
import ClientFormula from '../screens/clientInfoScreen/components/clientFormula';
import ClientCopyFormulaScreen from '../screens/clientInfoScreen/components/clientCopyFormula';
import ClientInfoScreen from '../screens/clientInfoScreen';
import ClientDetailsScreen from '../screens/clientInfoScreen/components/clientDetails';
import ProvidersScreen from '../screens/providersScreen';
import ServicesScreen from '../screens/ServicesScreen';
import TransitionConfiguration from './transitionConfiguration';

const ClientsStackNavigator = StackNavigator(
  {
    NewClient: {
      screen: NewClientScreen,
    },
    ChangeClient: {
      screen: ClientsScreen,
    },
    ClientInfo: {
      screen: ClientInfoScreen,
      navigationOptions: { tabBarVisible: false },
    },
    ClientNotes: {
      screen: ClientNotes,
      navigationOptions: { tabBarVisible: false },
    },
    ClientNote: {
      screen: ClientNote,
    },
    ClientFormula: {
      screen: ClientFormula,
    },
    ClientCopyFormula: {
      screen: ClientCopyFormulaScreen,
    },
    ClientFormulas: {
      screen: ClientFormulas,
      navigationOptions: { tabBarVisible: false },
    },
    ClientDetails: {
      screen: ClientDetailsScreen,
      navigationOptions: { tabBarVisible: false },
    },
    Services: {
      screen: ServicesScreen,
    },
    Providers: {
      screen: ProvidersScreen,
    },
    ReferredClients: {
      screen: ClientsScreen,
    },
  },
  {
    initialRouteName: 'ChangeClient',
    headerMode: 'float',
    transitionConfig: TransitionConfiguration,
  },
);
ClientsStackNavigator.navigationOptions = ({ navigation }) => {
  const { state } = navigation;
  let tabBarVisible = true;
  const routes = get(state, 'routes[0].routes', []);
  if (state.index > 0 || routes.length > 1) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};
export default ClientsStackNavigator;
