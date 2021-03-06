// @flow
import {combineReducers} from 'redux';
import {auth} from './auth';
import queue from './queue';
import settingsReducer from './settings';
import walkInReducer from './walkIn';
import clientsReducer from './clients';
import formCache from './formCache';
import appointmentNotesReducer from './appointmentNotes';
// import walkoutReducer from './walkout';
// import { appointmentDetailsReducer } from '../screens/appointmentDetailsScreen/redux';
import {modifyApptReducer} from '../../screens/modifyAppointmentScreen/redux';
import {salonSearchHeaderReducer} from './searchHeader';
import userInfoReducer from './userInfo';
import appointmentBookReducer from './appointmentBook';
import checkinReducer from './checkin';
import serviceReducer from './service';
import providersReducer from './providers';
import productsReducer from './products';
import appointmentReducer from './appointment';
import restrictionsReducer from './restrictions';
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
import rootDrawerNavigator from './rootDrawerNavigator';
import rebookReducer from './rebookDialog';
import queueDetailReducer from './queueDetail';
import promotionsReducer from './promotions';
import scheduleReducer from './schedule';
import {AT} from '../actions/login';
import removalReasonTypesReducer from './removalReasonTypes';
import navigationReducer from './navigation';

const appReducer = combineReducers ({
  auth,
  settingsReducer,
  queue,
  walkInReducer,
  clientsReducer,
  formCache,
  appointmentNotesReducer,
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
  restrictionsReducer,
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
  rootDrawerNavigator,
  rebookReducer,
  queueDetailReducer,
  promotionsReducer,
  removalReasonTypesReducer,
  scheduleReducer,
  navigationReducer,
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === AT.LOGOUT) {
    newState = undefined;
  }

  return appReducer (newState, action);
};

export default rootReducer;
