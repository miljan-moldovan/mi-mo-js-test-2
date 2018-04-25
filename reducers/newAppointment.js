import moment from 'moment';

import newAppointmentActions, {
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

const initialState = {
  isLoading: false,
  hasConflicts: false,
  service: null,
  client: null,
  employee: null,
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
      {
        date: moment(),
        fromTime: 'string',
        toTime: 'string',
        employeeId: 0,
        bookedByEmployeeId: 0,
        serviceId: 0,
        clientId: 0,
        requested: true,
        isFirstAvailable: false,
      },
    ],
  },
};

export default function newAppointmentReducer(state = initialState, action) {
  const { type, data } = action;
  const { body } = state;
  switch (type) {
    case SET_NEW_APPT_REQUESTED:
      body.items[0].requested = data.requested;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_FIRST_AVAILABLE:
      body.items[0].isFirstAvailable = data.isFirstAvailable;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_DATE:
      body.date = data.date;
      body.items[0].date = data.date;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_START_TIME:
      body.items[0].fromTime = moment(data.startTime, 'HH:mm A').format('HH:mm');
      body.items[0].toTime = moment(data.endTime, 'HH:mm A').format('HH:mm');
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_CLIENT:
      body.clientInfo = data.client;
      body.items[0].clientId = data.client.id;
      return {
        ...state,
        body,
        client: data.client,
      };
    case SET_NEW_APPT_EMPLOYEE:
      body.bookedByEmployeeId = data.employee.id;
      body.items[0].employeeId = data.employee.id;
      body.items[0].bookedByEmployeeId = data.employee.id;
      return {
        ...state,
        body,
        employee: data.employee,
      };
    case SET_NEW_APPT_SERVICE:
      body.items[0].serviceId = data.service.id;
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
