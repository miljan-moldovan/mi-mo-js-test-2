// @flow
import { combineReducers } from 'redux';
import { auth } from './auth';
import queue from './queue';
import walkInReducer from './walkIn';
import clientsReducer from './clients';
import clientsSearchReducer from './clientsSearch';
import formCache from './formCache';
import appointmentNotesReducer from './appointmentNotes';
import { appointmentFormulasReducer } from '../screens/appointmentDetailsScreen/components/appointmentFormulas/redux';

import { REHYDRATE } from 'redux-persist/constants';

export default combineReducers({
  auth,
  queue,
  walkInReducer,
  clientsReducer,
  clientsSearchReducer,
  formCache,
  appointmentNotesReducer,
  appointmentFormulasReducer,
});
