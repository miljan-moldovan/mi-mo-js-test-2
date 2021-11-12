const _XHR = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;

XMLHttpRequest = _XHR;

import {AppRegistry} from 'react-native';
import codePush from "react-native-code-push";
import App from './src/App';

const codePushApp = codePush(App);

AppRegistry.registerComponent ('SalonUltimateRN', () => codePushApp);
