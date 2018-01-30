// @flow
import { combineReducers } from 'redux';
import { auth } from './auth';
import queue from './queue';
import { REHYDRATE } from 'redux-persist/constants';

export default combineReducers({
  auth,
  queue
});
