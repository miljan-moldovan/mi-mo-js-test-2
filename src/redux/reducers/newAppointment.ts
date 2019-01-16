import moment from 'moment';
import { get, reject } from 'lodash';
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
  UPDATE_SERVICE_ITEM,
  REMOVE_SERVICE_ITEM,
  ADD_SERVICE_ITEM_EXTRAS,
  BOOK_NEW_APPT,
  BOOK_NEW_APPT_SUCCESS,
  BOOK_NEW_APPT_FAILED,
  CHECK_CONFLICTS_SUCCESS,
  CHECK_CONFLICTS_FAILED,
  CHECK_CONFLICTS,
  ADD_GUEST,
  REMOVE_GUEST,
  SET_GUEST_CLIENT,
  SET_REMARKS,
  SET_SELECTED_APPT,
  POPULATE_STATE_FROM_APPT,
  POPULATE_STATE_FROM_REBOOKED_APPT,
  SET_MAIN_EMPLOYEE,
  IS_BOOKED_BY_FIELD_ENABLED,
  UPDATE_SERVICE_ITEMS,
} from '../actions/newAppointment';
import { Maybe, Client, PureProvider, Conflict, PureAppointment, AppointmentCard } from '@/models';
import { ServiceItem } from '@/models/new-appointment';

const defaultState: NewAppointmentReducer = {
  isLoading: false,
  isBooking: false,
  editType: 'new',
  isBookingQuickAppt: false,
  isQuickApptRequested: true,
  isBookedByFieldEnabled: false,
  date: moment(),
  startTime: moment(),
  client: null,
  bookedByEmployee: null,
  deletedIds: [],
  guests: [],
  conflicts: [],
  serviceItems: [],
  mainEmployee: null,
  remarks: '',
  rebooked: true,
  initialState: null,
  selectedAppt: null,
};

export interface NewAppointmentReducer {
  isLoading: boolean;
  isBooking: boolean;
  editType: string;
  isBookingQuickAppt: boolean;
  isQuickApptRequested: boolean;
  isBookedByFieldEnabled: boolean;
  date: moment.Moment;
  startTime: moment.Moment;
  client: Maybe<Client>;
  bookedByEmployee: Maybe<PureProvider>;
  deletedIds: number[];
  guests: any[];
  conflicts: Conflict[];
  serviceItems: ServiceItem[];
  mainEmployee: Maybe<PureProvider>;
  remarks: string;
  rebooked: boolean;
  initialState: any;
  selectedAppt: Maybe<AppointmentCard | PureAppointment>;
}

export default function newAppointmentReducer(
  state: NewAppointmentReducer = defaultState, action): NewAppointmentReducer {
  const { type, data } = action;
  const newGuests = state.guests.slice();
  const newServiceItems = state.serviceItems.slice();
  switch (type) {
    case IS_BOOKED_BY_FIELD_ENABLED:
      return {
        ...state,
        isBookedByFieldEnabled: data.isBookedByFieldEnabled,
      };
    case CLEAN_FORM:
      return {
        isLoading: false,
        isBooking: false,
        editType: 'new',
        isBookingQuickAppt: false,
        isQuickApptRequested: true,
        isBookedByFieldEnabled: false,
        client: null,
        date: moment(),
        startTime: moment(),
        bookedByEmployee: data.bookedByEmployee || null,
        deletedIds: [],
        guests: [],
        conflicts: [],
        serviceItems: [],
        mainEmployee: null,
        remarks: '',
        rebooked: true,
        initialState: null,
        selectedAppt: null,
      };
    case SET_SELECTED_APPT:
      return {
        ...state,
        isLoading: true,
        bookedByEmployee: data.appt.bookedByEmployee,
        remarks: data.appt.remarks,
        selectedAppt: data.appt,
        initialState: null,
      };
    case POPULATE_STATE_FROM_REBOOKED_APPT:
      return {
        ...state,
        isLoading: false,
        isBooking: false,
        editType: 'new',
        rebooked: true,
        isBookingQuickAppt: false,
        isQuickApptRequested: true,
        date: data.newState.date,
        startTime: data.newState.startTime,
        client: data.newState.client,
        bookedByEmployee: data.newState.bookedByEmployee,
        mainEmployee: data.newState.mainEmployee,
        deletedIds: data.newState.deletedIds,
        guests: data.newState.guests,
        conflicts: data.newState.conflicts,
        serviceItems: data.newState.serviceItems,
        remarks: data.newState.remarks,
      };
    case POPULATE_STATE_FROM_APPT:
      return {
        ...state,
        isLoading: false,
        isBooking: false,
        editType: 'edit',
        isBookingQuickAppt: false,
        isQuickApptRequested: true,
        date: data.newState.date,
        startTime: data.newState.startTime,
        client: data.newState.client,
        bookedByEmployee: data.newState.bookedByEmployee,
        mainEmployee: data.newState.mainEmployee,
        deletedIds: data.newState.deletedIds,
        guests: data.newState.guests,
        conflicts: data.newState.conflicts,
        serviceItems: data.newState.serviceItems,
        remarks: data.newState.remarks,
        initialState: {
          date: data.newState.date,
          startTime: data.newState.startTime,
          client: data.newState.client,
          bookedByEmployee: data.newState.bookedByEmployee,
          mainEmployee: data.newState.mainEmployee,
          guests: data.newState.guests,
          serviceItems: data.newState.serviceItems,
          remarks: data.newState.remarks,
        },
      };
    case IS_BOOKING_QUICK_APPT:
      return {
        ...state,
        isBookingQuickAppt: data.isBookingQuickAppt,
        isBookedByFieldEnabled: data.isBookedByFieldEnabled,
      };
    case SET_BOOKED_BY:
      return {
        ...state,
        bookedByEmployee: data.bookedByEmployee,
        isBookedByFieldEnabled: data.isBookedByFieldEnabled,
      };
    case SET_MAIN_EMPLOYEE:
      return {
        ...state,
        mainEmployee: data.mainEmployee,
        serviceItems: newServiceItems.map(item => {
          const employee = (item.service && item.service.employee && item.service.employee.id)
            === (state.mainEmployee && state.mainEmployee.id)
            ? data.mainEmployee
            : item.service.employee;
          return {
            ...item,
            service: {
              ...item.service,
              employee,
            },
          };
        }),
      };
    case SET_CLIENT:
      return {
        ...state,
        client: data.client,
        serviceItems: newServiceItems.map(item => ({
          ...item,
          service: {
            ...item.service,
            client: item.guestId ? item.service.clients : data.client,
          },
        })),
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
    case SET_REMARKS:
      return {
        ...state,
        remarks: data.remarks,
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
      return {
        ...state,
        serviceItems: data.serviceItems.slice(),
      };
    case ADD_QUICK_SERVICE_ITEM:
      return {
        ...state,
        serviceItems: [data.serviceItem],
      };
    case UPDATE_SERVICE_ITEM:
      return {
        ...state,
        serviceItems: data.serviceItems.slice(),
      };
    case UPDATE_SERVICE_ITEMS:
      return {
        ...state,
        serviceItems: [...data.serviceItems],
      };
    case REMOVE_SERVICE_ITEM:
      const previousDeletedIds = state.deletedIds || [];
      let newDeletedIds = [...previousDeletedIds];
      if (data.deletedIds) {
        newDeletedIds = [...newDeletedIds, data.deletedIds];
      }

      return {
        ...state,
        serviceItems: data.serviceItems.slice(),
        deletedIds: newDeletedIds,
      };
    case ADD_SERVICE_ITEM_EXTRAS:
      return {
        ...state,
        serviceItems: data.serviceItems.slice(),
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
        isBooking: true,
      };
    case BOOK_NEW_APPT_SUCCESS:
    case BOOK_NEW_APPT_FAILED:
      return {
        ...state,
        isLoading: false,
        isBooking: false,
        deletedIds: [],
      };
    case ADD_GUEST:
      return {
        ...state,
        guests: [...state.guests, data.guest],
      };
    case REMOVE_GUEST:
      if (data.guestId) {
        const guestIndex = state.guests.findIndex(
          guest => guest.guestId === data.guestId,
        );
        state.serviceItems = reject(
          state.serviceItems,
          item => item.guestId === data.guestId,
        );
        newGuests.splice(guestIndex, 1);
      } else {
        const removedGuest = newGuests.pop();
        const removedGuestId = get(removedGuest, 'guestId', null);
        if (removedGuestId) {
          state.serviceItems = reject(
            state.serviceItems,
            item => item.guestId === removedGuestId,
          );
        }
      }
      return {
        ...state,
        guests: newGuests,
      };
    case SET_GUEST_CLIENT:
      return {
        ...state,
        guests: state.guests.map(guest => {
          if (guest.guestId === data.guest.guestId) {
            return data.guest;
          }
          return guest;
        }),
        serviceItems: state.serviceItems.map(item => {
          if (item.guestId === data.guest.guestId) {
            return {
              ...item,
              service: {
                ...item.service,
                client: data.guest.client,
              },
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
}
