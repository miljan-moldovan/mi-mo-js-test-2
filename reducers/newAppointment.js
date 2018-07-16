import moment from 'moment';
import {
  CLEAN_FORM,
  IS_BOOKING_QUICK_APPT,
  SET_BOOKED_BY,
  SET_DATE,
  SET_START_TIME,
  SET_CLIENT,
  SET_QUICK_APPT_REQUESTED,
  CLEAR_SERVICE_ITEMS,
  ADD_QUICK_SERVICE_ITEM,
  ADD_SERVICE_ITEM,
  BOOK_NEW_APPT,
  BOOK_NEW_APPT_SUCCESS,
  BOOK_NEW_APPT_FAILED,
  CHECK_CONFLICTS_SUCCESS,
  CHECK_CONFLICTS_FAILED,
  CHECK_CONFLICTS,
  ADD_GUEST,
  REMOVE_GUEST,
  SET_GUEST_CLIENT,
} from '../actions/newAppointment';

const defaultState = {
  isLoading: false,
  isBooking: false,
  isBookingQuickAppt: false,
  isQuickApptRequested: true,
  date: moment(),
  startTime: moment(),
  client: null,
  bookedByEmployee: null,
  guests: [],
  conflicts: [],
  serviceItems: [],
  remarks: '',
};

export default function newAppointmentReducer(state = defaultState, action) {
  const { type, data } = action;
  const newServiceItems = state.serviceItems;
  const newGuests = state.guests;
  switch (type) {
    case CLEAN_FORM:
      return {
        ...defaultState,
      };
    case IS_BOOKING_QUICK_APPT:
      return {
        ...state,
        isBookingQuickAppt: data.isBookingQuickAppt,
      };
    case SET_BOOKED_BY:
      return {
        ...state,
        bookedByEmployee: data.employee,
      };
    case SET_CLIENT:
      return {
        ...state,
        client: data.client,
      };
    case SET_DATE:
      return {
        ...state,
        date: data.date,
      };
    case SET_START_TIME:
      return {
        ...state,
        startTime: data.startTime,
      };
    case SET_QUICK_APPT_REQUESTED:
      return {
        ...state,
        isQuickApptRequested: data.requested,
      };
    case CLEAR_SERVICE_ITEMS:
      return {
        ...state,
        serviceItems: [],
      };
    case ADD_SERVICE_ITEM:
      newServiceItems.push(data.serviceItem);
      return {
        ...state,
        serviceItems: newServiceItems,
      };
    case ADD_QUICK_SERVICE_ITEM:
      return {
        ...state,
        serviceItems: [data.serviceItem],
      };
    case CHECK_CONFLICTS:
      return {
        ...state,
        isLoading: true,
        conflicts: [],
      };
    case CHECK_CONFLICTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        conflicts: data.conflicts,
      };
    case CHECK_CONFLICTS_FAILED:
      return {
        ...state,
        isLoading: false,
        conflicts: [],
      };
    case BOOK_NEW_APPT:
      return {
        ...state,
        isLoading: false,
        isBooking: true,
      };
    case BOOK_NEW_APPT_SUCCESS:
    case BOOK_NEW_APPT_FAILED:
      return defaultState;
    case ADD_GUEST:
      return {
        ...state,
        guests: [...state.guests, data.guest],
      };
    case REMOVE_GUEST:
      newGuests.pop();
      return {
        ...state,
        guests: newGuests,
      };
    case SET_GUEST_CLIENT:
      return {
        ...state,
        guests: data.guests,
      };
    default:
      return state;
  }
}
