// @flow
import { combineReducers } from 'redux';
import { auth } from './auth';
import { REHYDRATE } from 'redux-persist/constants';

export default combineReducers({
  auth  
});
