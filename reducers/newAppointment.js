import moment from 'moment';

import newAppointmentActions, {
  ADD_GUEST,
  REMOVE_GUEST,
  SET_GUEST_CLIENT,
  ADD_GUEST_SERVICE,
  REMOVE_GUEST_SERVICE,
  UPDATE_TOTALS,
  ADD_NEW_APPT_ITEM,
  REMOVE_NEW_APPT_ITEM,
  SET_NEW_APPT_EMPLOYEE,
  SET_NEW_APPT_DATE,
  SET_NEW_APPT_SERVICE,
  SET_NEW_APPT_CLIENT,
  SET_NEW_APPT_START_TIME,
  SET_NEW_APPT_REMARKS,
  SET_NEW_APPT_DURATION,
  SET_NEW_APPT_REQUESTED,
  SET_NEW_APPT_ENDS_ON_DATE,
  SET_NEW_APPT_ENDS_AFTER,
  SET_NEW_APPT_REPEAT_PERIOD,
  SET_NEW_APPT_FIRST_AVAILABLE,
  BOOK_NEW_APPT,
  BOOK_NEW_APPT_SUCCESS,
  BOOK_NEW_APPT_FAILED,
  SET_NEW_APPT_RECURRING,
  SET_NEW_APPT_RECURRING_TYPE,
  SET_BOOKED_BY,
  CHECK_CONFLICTS_SUCCESS,
  CHECK_CONFLICTS_FAILED,
  CHECK_CONFLICTS,
} from '../actions/newAppointment';

const itemShape = {
  date: moment(),
  service: null,
  employee: null,
  client: null,
  fromTime: 'string',
  toTime: 'string',
  bookedByEmployeeId: 0,
  gapTime: 0,
  afterTime: 0,
  length: 0,
  price: 0,
  serviceType: '',
  room: null,
  roomOrdinal: 0,
  resource: null,
  resourceOrdinal: 0,
  isFirstAvailable: false,
};

const recurringShape = {
  repeatPeriod: 0,
  endsAfterCount: 0,
  endsOnDate: moment(),
};

const clientInfoShape = {
  id: 0,
  email: '',
  phones: [
    {
      type: 'work',
      value: '',
    },
  ],
  confirmationType: null,
};

const guestShape = {
  client: null,
  services: [],
};

const initialState = {
  isLoading: false,
  hasConflicts: false,
  startTime: '',
  endTime: '',
  date: moment(),
  service: null,
  employee: null,
  client: null,
  bookedByEmployee: null,
  totalPrice: 0,
  totalDuration: moment.duration(0, 'second'),
  recurringType: 'week',
  guests: [],
  conflicts: [],
  quickApptConflicts: [],
  body: {
    date: moment(),
    bookedByEmployee: null,
    remarks: '',
    displayColor: '',
    recurring: recurringShape,
    clientInfo: clientInfoShape,
    items: [
      itemShape,
    ],
  },
  appt: {
    date: moment(),
    client: null,
    bookedByEmployee: null,
    clientEmail: '',
    phones: [],
    confirmationType: '',
    displayColor: '',
    remarks: '',
    rebooked: false,
  },
  serviceItems: [
    {
      id: null,
      client: null,
      service: null,
      provider: null,
      requested: false,
      bookBetween: false,
      fromTime: moment.Duration,
      toTime: moment.Duration,
      gapTime: 0,
      afterTime: 0,
      length: 0,
      price: 0,
      serviceType: '',
      isFirstAvailable: false,
    },
  ],
};

export default function newAppointmentReducer(state = initialState, action) {
  const { type, data } = action;
  if (type.indexOf('newAppointment') >= 0) {
    console.log(`New Appt Reducer ${type}`, data);
  }
  const {
    body,
    guests,
    totalPrice,
    totalDuration,
  } = state;
  const newGuests = guests;
  const newTotalDuration = moment.duration();
  let newTotalPrice = 0;
  switch (type) {
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
    case UPDATE_TOTALS:
      for (let i = 0; i < body.items.length; i += 1) {
        if (body.items[i].service !== null) {
          const serviceDuration = moment.duration(body.items[i].service.maxDuration);
          newTotalPrice += body.items[i].service.price;
          newTotalDuration.add(serviceDuration);
        }
      }
      for (let i = 0; i < guests.length; i += 1) {
        for (let j = 0; j < guests[i].services.length; j += 1) {
          if (guests[i].services[j]) {
            const serviceDuration = moment.duration(guests[i].services[j].service.maxDuration);
            newTotalPrice += guests[i].services[j].service.price;
            newTotalDuration.add(serviceDuration);
          }
        }
      }
      return {
        ...state,
        totalDuration: newTotalDuration,
        totalPrice: newTotalPrice,
      };
    case SET_BOOKED_BY:
      return {
        ...state,
        bookedByEmployee: data.employee,
      };
    case ADD_NEW_APPT_ITEM:
      body.items.push(data.item);
      return {
        ...state,
        body,
      };
    case REMOVE_NEW_APPT_ITEM:
      body.items.splice(data.index, 1);
      return {
        ...state,
        body,
      };
    case ADD_GUEST:
      guests.push({
        client: null,
        services: [],
      });
      return {
        ...state,
        guests,
      };
    case REMOVE_GUEST:
      guests.pop();
      return {
        ...state,
        guests,
      };
    case SET_GUEST_CLIENT:
      newGuests[data.guestIndex].client = data.client;
      return {
        ...state,
        guests: newGuests,
      };
    case ADD_GUEST_SERVICE:
      newGuests[data.guestIndex].services.push(data.item);
      return {
        ...state,
        guests: newGuests,
      };
    case REMOVE_GUEST_SERVICE:
      newGuests[data.guestIndex].services.splice(data.serviceIndex, 1);
      return {
        ...state,
        guests: newGuests,
      };
    case SET_NEW_APPT_REQUESTED:
      body.items[data.index].requested = data.requested;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_RECURRING:
      body.items[data.index].recurring = data.recurring;
      return {
        ...state,
        body,
      };
    case SET_NEW_APPT_RECURRING_TYPE:
      return {
        ...state,
        recurringType: data.recurringType,
      };
    case SET_NEW_APPT_REMARKS:
      return {
        ...state,
        remarks: data.remarks,
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
        date: data.date,
        body,
      };
    case SET_NEW_APPT_START_TIME:
      body.items[data.index].fromTime = moment(data.startTime, 'HH:mm A').format('HH:mm');
      body.items[data.index].toTime = moment(data.endTime, 'HH:mm A').format('HH:mm');
      return {
        ...state,
        body,
        startTime: moment(data.startTime, 'HH:mm A').format('HH:mm'),
        endTime: moment(data.endTime, 'HH:mm A').format('HH:mm'),
      };
    case SET_NEW_APPT_CLIENT:
      body.clientInfo = data.client;
      body.client = data.client;
      body.items[data.index].client = data.client;
      body.items[data.index].clientId = data.client.id;
      return {
        ...state,
        body,
        client: data.client,
      };
    case SET_NEW_APPT_EMPLOYEE:
      if (data.employee !== null) {
        body.bookedByEmployeeId = data.employee.id;
        body.bookedByEmployee = data.employee;
        body.items[data.index].employee = data.employee;
        body.items[data.index].employeeId = data.employee.id;
        body.items[data.index].bookedByEmployeeId = data.employee.id;
      } else {
        body.bookedByEmployeeId = null;
        body.bookedByEmployee = null;
        body.items[data.index].employee = null;
        body.items[data.index].employeeId = null;
        body.items[data.index].bookedByEmployeeId = null;
      }
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
