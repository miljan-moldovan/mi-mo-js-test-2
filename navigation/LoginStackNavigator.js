// @flow
import { StackNavigator } from 'react-navigation';

import LoginScreen from '../screens/loginScreen/index';
import ForgotPasswordScreen from './../screens/ForgotPasswordScreen';

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
