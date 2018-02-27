const _XHR = GLOBAL.originalXMLHttpRequest ?
  GLOBAL.originalXMLHttpRequest :
  GLOBAL.XMLHttpRequest;

XMLHttpRequest = _XHR;

import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('SalonUltimateRN', () => App);
