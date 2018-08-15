// @flow
import { combineReducers } from 'redux';
import { auth } from './auth';
import queue from './queue';
import settingsReducer from './settings';
import walkInReducer from './walkIn';
import clientsReducer from './clients';
import formCache from './formCache';
import appointmentNotesReducer from './appointmentNotes';
import walkoutReducer from './walkout';
import { appointmentDetailsReducer } from '../screens/appointmentDetailsScreen/redux';
import { modifyApptReducer } from '../screens/modifyAppointmentScreen/redux';
import { salonSearchHeaderReducer } from '../components/SalonSearchHeader/redux';

import appointmentBookReducer from './appointmentBook';
import checkinReducer from './checkin';
import serviceReducer from './service';
import providersReducer from './providers';
import productsReducer from './products';
import appointmentReducer from './appointment';
import newAppointmentReducer from './newAppointment';
import apptBookViewOptionsReducer from './apptBookViewOptions';
import apptBookSetEmployeeOrderReducer from './apptBookSetEmployeeOrder';
import turnAway from './turnAway';
import formulasAndNotesReducer from './formulasAndNotes';
import roomAssignmentReducer from './roomAssignment';
import employeeScheduleReducer from './employeeSchedule';
import apptBookTurnAwayReducer from './apptBookTurnAway';
import blockTimeReducer from './blockTime';
import blockTimesReasonsReducer from './blockTimesReasons';
import turnAwayReasonsReducer from './turnAwayReasons';
import clientNotesReducer from './clientNotes';
import clientFormulasReducer from './clientFormulas';
import clientInfoReducer from './clientInfo';
import clientAppointmentsReducer from './clientAppointments';

export default combineReducers({
  auth,
  settingsReducer,
  queue,
  walkInReducer,
  clientsReducer,
  formCache,
  appointmentDetailsReducer,
  appointmentNotesReducer,
  walkoutReducer,
  salonSearchHeaderReducer,
  checkinReducer,
  serviceReducer,
  providersReducer,
  productsReducer,
  appointmentReducer,
  appointmentBookReducer,
  apptBookViewOptionsReducer,
  apptBookSetEmployeeOrderReducer,
  turnAway,
  newAppointmentReducer,
  modifyApptReducer,
  formulasAndNotesReducer,
  roomAssignmentReducer,
  employeeScheduleReducer,
  apptBookTurnAwayReducer,
  blockTimeReducer,
  blockTimesReasonsReducer,
  turnAwayReasonsReducer,
  clientNotesReducer,
  clientFormulasReducer,
  clientInfoReducer,
  clientAppointmentsReducer,
});
