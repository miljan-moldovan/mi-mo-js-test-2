// @flow
import { combineReducers } from 'redux';
import { auth } from './auth';
import queue from './queue';
import settings from './settings';
import walkInReducer from './walkIn';
import clientsReducer from './clients';
import formCache from './formCache';
import appointmentNotesReducer from './appointmentNotes';
import { appointmentFormulasReducer } from '../screens/appointmentDetailsScreen/components/appointmentFormulas/redux';
import { salonSearchHeaderReducer } from '../components/SalonSearchHeader/redux';

import { REHYDRATE } from 'redux-persist/constants';

export default combineReducers({
  auth,
  settings,
  queue,
  walkInReducer,
  clientsReducer,
  formCache,
  appointmentNotesReducer,
  appointmentFormulasReducer,
  salonSearchHeaderReducer,
});
