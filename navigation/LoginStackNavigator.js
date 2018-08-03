// @flow
import { StackNavigator } from 'react-navigation';

import LoginScreen from '../screens/loginScreen';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen';

const LoginStackNavigator = StackNavigator(
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
