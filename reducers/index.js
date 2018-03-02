// @flow
import { combineReducers } from 'redux';
import { auth } from './auth';
import queue from './queue';
import walkInReducer from './walkIn';
import clientsReducer from './clients';
import formCache from './formCache';
import appointmentNotesReducer from './appointmentNotes';
import walkoutReducer from './walkout';
import { appointmentFormulasReducer } from '../screens/appointmentDetailsScreen/components/appointmentFormulas/redux';
import { salonSearchHeaderReducer } from '../components/SalonSearchHeader/redux';

import { REHYDRATE } from 'redux-persist/constants';

export default combineReducers({
  auth,
  queue,
  walkInReducer,
  clientsReducer,
  formCache,
  appointmentNotesReducer,
  walkoutReducer,
  appointmentFormulasReducer,
  salonSearchHeaderReducer,
});
