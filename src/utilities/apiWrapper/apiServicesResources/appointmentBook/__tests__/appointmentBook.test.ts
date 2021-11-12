import getAppointmentBookAvailability from '../getAppointmentBookAvailability';
import getAppointmentBookEmployees from '../getAppointmentBookEmployees';
import getBlockTimes from '../getBlockTimes';
import getResourceAppointments from '../getResourceAppointments';
import getRoomAppointments from '../getRoomAppointments';
import postAppointmentBookRebook from '../postAppointmentBookRebook';
import postCheckConflicts from '../postCheckConflicts';
import getBlockTimesBetweenDates from '../getBlockTimesBetweenDates';
import postMessageAllClients from '../postMessageAllClients';
import postMessageProvidersClients from '../postMessageProvidersClients';
import postAppointmentBookBlockTime from '../postAppointmentBookBlockTime';
import postEmailUpcomingAppointments from '../postEmailUpcomingAppointments';
import postAppointmentBookRebookMulti from '../postAppointmentBookRebookMulti';
import putBlockTimeMove from '../putBlockTimeMove';
import putBlockTimeResize from '../putBlockTimeResize';
import putBlockTimeEdit from '../putBlockTimeEdit';
import deleteBlock from '../deleteBlock';

import axios from 'axios';
import qs from 'qs';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

const reqData = {
  startDate: '12-12-2018',
  endDate: '12-12-2019',
  fromDate: '12-12-2018',
  toDate: '12-12-2019',
  fromTime: '12-12-2019',
  toTime: '12-12-2019',
  date: '12-12-2019',
  newTime: '12-12-2019',
  ids: 101,
  id: 101,
  reasonId: 101,
  clientId: 101,
  employeeId: 101,
  bookedByEmployeeId: 101,
  query: 'testmepls',
  notes: 'test',
  email: 'some@postservice.net',
  zipCode: '220003',
};

const filterOptions = {
  showOffEmployees: 'test',
  company: {
    id: 101,
  },
  position: {
    id: 101,
  },
  ...reqData,
};
const filterDataStringified = qs.stringify({
  ShowOffEmployees: filterOptions.showOffEmployees,
  CompanyId: filterOptions.company && filterOptions.company.id,
  PositionId: filterOptions.position && filterOptions.position.id,
  ...filterOptions,
});

mock
  // deleteBlock
  .onDelete(`AppointmentBook/BlockTime/${reqData.id}/Cancel`)
  .reply(200, returnData)
  // getAppointmentBookAvailability
  .onGet(`AppointmentBook/${reqData.date}/Availability`)
  .reply(200, returnData)
  // getAppointmentBookEmployees
  .onGet(`AppointmentBook/${reqData.date}/Employees?${filterDataStringified}`)
  .reply(200, returnData)
  .onGet(`Employees/Schedule/${reqData.date}/${reqData.date}?${filterDataStringified}`)
  .replyOnce(200, returnData)
  // getBlockTimes
  .onGet(`AppointmentBook/${reqData.date}/BlockTime`)
  .reply(200, returnData)
  // getResourceAppointments
  .onGet(`AppointmentBook/${reqData.date}/Resources/Appointments`)
  .reply(200, returnData)
  // getResourceAppointments
  .onGet(`AppointmentBook/${reqData.date}/Rooms/Appointments`)
  .reply(200, returnData)
  // getBlockTimesBetweenDates
  .onGet(`AppointmentBook/${reqData.fromDate}/${reqData.toDate}/BlockTime`)
  .reply(200, returnData)
  // postAppointmentBookRebook
  .onPost(`AppointmentBook/Rebook/${reqData.id}`, reqData)
  .reply(200, returnData)
  // postCheckConflicts
  .onPost('AppointmentBook/Conflicts', reqData)
  .reply(200, returnData)
  // postMessageAllClients
  .onPost(`AppointmentBook/${reqData.date}/MessageAllClients`, { messageText: reqData.query })
  .reply(200, returnData)
  // postMessageProvidersClients
  .onPost(`AppointmentBook/${reqData.date}/Employee/${reqData.id}/MessageClients`, { messageText: reqData.query })
  .reply(200, returnData)
  // postAppointmentBookBlockTime
  .onPost('AppointmentBook/BlockTime', reqData.date)
  .reply(200, returnData)
  // postEmailUpcomingAppointments
  .onPost('AppointmentBook/EmailUpcomingAppointments')
  .reply(200, returnData)
  // postAppointmentBookRebookMulti
  .onPost('AppointmentBook/Rebook/Multi', reqData)
  .reply(200, returnData)
  // putBlockTimeResize
  .onPut(`AppointmentBook/BlockTime/${reqData.id}/Resize`, { newLength: 'test' })
  .reply(200, returnData)
  // putBlockTimeEdit
  .onPut(`AppointmentBook/BlockTime/${reqData.id}`, {
    date: reqData.date,
    employeeId: reqData.employeeId,
    fromTime: reqData.fromTime,
    toTime: reqData.toTime,
    reasonId: reqData.reasonId,
    notes: reqData.notes,
    bookedByEmployeeId: reqData.bookedByEmployeeId,
  })
  .reply(200, returnData)
  // putBlockTimeMove
  .onPut(`AppointmentBook/BlockTime/${reqData.id}/Move`, {
    date: reqData.date,
    employeeId: reqData.employeeId,
    newTime: reqData.newTime,
    roomId: null,
    roomOrdinal: null,
    resourceId: null,
    resourceOrdinal: null,
  })
  .reply(200, returnData);

describe('AppointmentBook', () => {
  describe('delete', () => {
    test('deleteBlock should return correct property', async () => {
      const res = await deleteBlock(reqData.id);
      expect(res).toEqual(returnData.response);
    });
  });

  describe('get', () => {
    test('getAppointmentBookAvailability should return correct property', async () => {
      const res = await getAppointmentBookAvailability(reqData.date);
      expect(res).toEqual(returnData.response);
    });
    test('getAppointmentBookEmployees should return correct property', async () => {
      const res = await getAppointmentBookEmployees(reqData.date, filterOptions);
      expect(res).toEqual(returnData.response);
    });
    test('getAppointmentBookEmployees should return correct property', async () => {
      const res = await getAppointmentBookEmployees(reqData.date, filterOptions);
      expect(res).toEqual(returnData.response);
    });
    test('getBlockTimes should return correct property', async () => {
      const res = await getBlockTimes(reqData.date);
      expect(res).toEqual(returnData.response);
    });
    test('getResourceAppointments should return correct property', async () => {
      const res = await getResourceAppointments(reqData.date);
      expect(res).toEqual(returnData.response);
    });
    test('getRoomAppointments should return correct property', async () => {
      const res = await getRoomAppointments(reqData.date);
      expect(res).toEqual(returnData.response);
    });
    test('getBlockTimesBetweenDates should return correct property', async () => {
      const res = await getBlockTimesBetweenDates(reqData);
      expect(res).toEqual(returnData.response);
    });
  });

  describe('post', () => {
    test('postAppointmentBookRebook should return correct property', async () => {
      const res = await postAppointmentBookRebook(reqData.id, reqData);
      expect(res).toEqual(returnData.response);
    });
    test('postCheckConflicts should return correct property', async () => {
      const res = await postCheckConflicts(reqData);
      expect(res).toEqual(returnData.response);
    });
    test('postMessageAllClients should return correct property', async () => {
      const res = await postMessageAllClients(reqData.date, reqData.query);
      expect(res).toEqual(returnData.response);
    });
    test('postMessageProvidersClients should return correct property', async () => {
      const res = await postMessageProvidersClients(reqData.date, reqData.id, reqData.query);
      expect(res).toEqual(returnData.response);
    });
    test('postAppointmentBookBlockTime should return correct property', async () => {
      const res = await postAppointmentBookBlockTime(reqData.date);
      expect(res).toEqual(returnData.response);
    });
    test('postEmailUpcomingAppointments should return correct property', async () => {
      const res = await postEmailUpcomingAppointments();
      expect(res).toEqual(returnData.response);
    });
    test('postAppointmentBookRebookMulti should return correct property', async () => {
      const res = await postAppointmentBookRebookMulti(reqData);
      expect(res).toEqual(returnData.response);
    });
  });

  describe('put', () => {
    test('putBlockTimeResize should return correct property', async () => {
      const res = await putBlockTimeResize(reqData.id, { newLength: 'test' });
      expect(res).toEqual(returnData.response);
    });
    test('putBlockTimeEdit should return correct property', async () => {
      const res = await putBlockTimeEdit(reqData.id, reqData);
      expect(res).toEqual(returnData.response);
    });
    test('putBlockTimeMove should return correct property', async () => {
      const res = await putBlockTimeMove(reqData.id, reqData);
      expect(res).toEqual(returnData.response);
    });
  });
});
