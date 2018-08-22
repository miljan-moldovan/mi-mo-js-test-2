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
import userInfoReducer from './userInfo';
import appointmentBookReducer from './appointmentBook';
import checkinReducer from './checkin';
import serviceReducer from './service';
import providersReducer from './providers';
import productsReducer from './products';
import appointmentReducer from './appointment';
import newAppointmentReducer from './newAppointment';
import apptBookViewOptionsReducer from './apptBookViewOptions';
import apptBookSetEmployeeOrderReducer from './apptBookSetEmployeeOrder';
import formulasAndNotesReducer from './formulasAndNotes';
import roomAssignmentReducer from './roomAssignment';
import employeeScheduleReducer from './employeeSchedule';
import turnAwayReducer from './turnAway';
import blockTimeReducer from './blockTime';
import blockTimesReasonsReducer from './blockTimesReasons';
import turnAwayReasonsReducer from './turnAwayReasons';
import clientNotesReducer from './clientNotes';
import clientFormulasReducer from './clientFormulas';
import clientInfoReducer from './clientInfo';
import clientAppointmentsReducer from './clientAppointments';
import storeReducer from './store';

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
  newAppointmentReducer,
  modifyApptReducer,
  formulasAndNotesReducer,
  roomAssignmentReducer,
  employeeScheduleReducer,
  turnAwayReducer,
  blockTimeReducer,
  blockTimesReasonsReducer,
  turnAwayReasonsReducer,
  clientNotesReducer,
  clientFormulasReducer,
  clientInfoReducer,
  clientAppointmentsReducer,
  userInfoReducer,
  storeReducer,
});
