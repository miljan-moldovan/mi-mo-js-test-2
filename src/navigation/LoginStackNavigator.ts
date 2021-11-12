// @flow
import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/loginScreen';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen';

const LoginStackNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  },
);
export default LoginStackNavigator;
