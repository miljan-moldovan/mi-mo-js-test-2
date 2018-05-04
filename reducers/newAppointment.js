import moment from 'moment';

import newAppointmentActions, {
  ADD_NEW_APPT_ITEM,
  SET_NEW_APPT_EMPLOYEE,
  SET_NEW_APPT_DATE,
  SET_NEW_APPT_SERVICE,
  SET_NEW_APPT_CLIENT,
  SET_NEW_APPT_START_TIME,
  SET_NEW_APPT_DURATION,
  SET_NEW_APPT_REQUESTED,
  SET_NEW_APPT_FIRST_AVAILABLE,
  BOOK_NEW_APPT,
  BOOK_NEW_APPT_SUCCESS,
  BOOK_NEW_APPT_FAILED,
} from '../actions/newAppointment';

const itemShape = {
  date: moment(),
  service: null,
  employee: null,
  client: null,
  fromTime: 'string',
  toTime: 'string',
  employeeId: 0,
  bookedByEmployeeId: 0,
  serviceId: 0,
  clientId: 0,
  requested: true,
  isFirstAvailable: false,
};

const initialState = {
  isLoading: false,
  hasConflicts: false,
  service: null,
  employee: null,
  client: null,
  body: {
    date: moment(),
    bookedByEmployeeId: 0,
    remarks: '',
    displayColor: '',
    recurring: {
      repeatPeriod: 0,
      endsAfterCount: 0,
      endsOnDate: moment(),
    },
    clientInfo: {
      id: 0,
      email: '',
      phones: [
        {
          type: 'work',
          value: '',
        },
      ],
      confirmationType: null,
    },
    items: [
      itemShape,
    ],
  },
};

export default function newAppointmentReducer(state = initialState, action) {
  const { type, data } = action;
  const { body } = state;
  switch (type) {
    case ADD_NEW_APPT_ITEM:
      body.items.push(itemShape);
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_REQUESTED:
      body.items[data.index].requested = data.requested;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_FIRST_AVAILABLE:
      body.items[data.index].isFirstAvailable = data.isFirstAvailable;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_DATE:
      body.date = data.date;
      body.items[data.index].date = data.date;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_START_TIME:
      body.items[data.index].fromTime = moment(data.startTime, 'HH:mm A').format('HH:mm');
      body.items[data.index].toTime = moment(data.endTime, 'HH:mm A').format('HH:mm');
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_CLIENT:
      body.clientInfo = data.client;
      body.items[data.index].client = data.client;
      body.items[data.index].clientId = data.client.id;
      return {
        ...state,
        body,
        client: data.client,
      };
    case SET_NEW_APPT_EMPLOYEE:
      body.bookedByEmployeeId = data.employee.id;
      body.items[data.index].employee = data.employee;
      body.items[data.index].employeeId = data.employee.id;
      body.items[data.index].bookedByEmployeeId = data.employee.id;
      return {
        ...state,
        body,
        employee: data.employee,
      };
    case SET_NEW_APPT_SERVICE:
      body.items[data.index].service = data.service;
      body.items[data.index].serviceId = data.service.id;
      return {
        ...state,
        body,
        service: data.service,
      };
    case BOOK_NEW_APPT:
      return {
        ...state,
        isLoading: true,
        hasConflicts: false,
      };
    case BOOK_NEW_APPT_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
      };
    case BOOK_NEW_APPT_FAILED:
      return {
        ...state,
        isLoading: false,
        hasConflicts: true,
      };
    default:
      return state;
  }
}
