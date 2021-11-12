import getEmployeeAppointments from '../getEmployeeAppointments';
import getEmployeePhoto from '../getEmployeePhoto';
import getEmployeePositions from '../getEmployeePositions';
import getEmployees from '../getEmployees';
import getEmployeeSchedule from '../getEmployeeSchedule';
import getEmployeeScheduleRange from '../getEmployeeScheduleRange';
import getRoomAssignments from '../getRoomAssignments';
import putRoomAssignments from '../putRoomAssignments';
import getEmployeeScheduleException from '../getEmployeeScheduleException';
import putEmployeeScheduleException from '../putEmployeeScheduleException';
import getEmployee from '../getEmployee';
import getEmployeeStatus from '../getEmployeeStatus';
import getEmployeesScheduleDates from '../getEmployeesScheduleDates';
import getQueueEmployees from '../getQueueEmployees';
import getReceptionists from '../getReceptionists';

import axios from 'axios';
import qs from 'qs';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

const startDate = '12-12-2018';
const endDate = '12-12-2019';
const date = startDate;
const id = 101;
const ids = id;
const queryString = 101;

const reqData = {
  startDate,
  endDate,
  dateFrom: startDate,
  dateTo: endDate,
  ids: id,
  id,
};

mock
  .onGet(`Employees/${id}`).reply(200, returnData)
  .onPut(`Employees/${id}/RoomAssignments/${date}`).reply(200, returnData)
  .onGet(
    `Employees/${id}/ScheduleException?startDate=${date}&endDate=${date}&api-version=1`,
  ).reply(200, returnData)
  .onPut(`Employees/${id}/ScheduleException`).reply(200, returnData)
  .onGet(`Employees/${id}/RoomAssignments?${qs.stringify({ date })}`).reply(200, returnData)
  .onGet(`Employees/Receptionists?${queryString}`).reply(200, returnData)
  .onGet(`Employees/Receptionists?${qs.stringify({})}`).reply(200, returnData)
  .onGet('Queue/Employees').reply(200, returnData)
  .onGet(`Employees/Schedule/${startDate}/${endDate}?${qs.stringify({ ids })}`).reply(200, returnData)
  .onGet(`Employees/${id}/Schedule/${startDate}/${endDate}`).reply(200, returnData)
  .onGet(`Employees/${id}/Schedule/${date}`).reply(200, returnData)
  .onGet(`Employees?${qs.stringify(id)}`).reply(200, returnData)
  .onGet('Employees/Positions').reply(200, returnData)
  .onGet(`Employees/${id}/Photo`).reply(200, returnData)
  .onGet(`AppointmentBook/${startDate}/${endDate}/Employee/${id}/Appointments`).reply(200, returnData)
  .onGet(`Employees/${id}/Status`).reply(200, returnData);

describe('Employees', () => {
  test('getEmployee should return correct property', async () => {
    const res = await getEmployee(id);
    expect(res).toEqual(returnData.response);
  });
  test('putRoomAssignments should return correct property', async () => {
    const res = await putRoomAssignments(id, date, 'assigned to tests');
    expect(res).toEqual(returnData.response);
  });
  test('putEmployeeScheduleException should return correct property', async () => {
    const res = await putEmployeeScheduleException(id, id);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeeScheduleException should return correct property', async () => {
    const res = await getEmployeeScheduleException(id, date);
    expect(res).toEqual(returnData.response);
  });
  test('getReceptionists should return correct property', async () => {
    const res = await getReceptionists(id);
    expect(res).toEqual(returnData.response);
    const res2 = await getReceptionists();
    expect(res2).toEqual(returnData.response);
  });
  test('getQueueEmployees should return correct property', async () => {
    const res = await getQueueEmployees();
    expect(res).toEqual(returnData.response);
    const res2 = await getQueueEmployees(false);
    expect(res2).toEqual(returnData.response);
  });
  test('getEmployeesScheduleDates should return correct property', async () => {
    const res = await getEmployeesScheduleDates(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeeScheduleRange should return correct property', async () => {
    const res = await getEmployeeScheduleRange(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeeSchedule should return correct property', async () => {
    const res = await getEmployeeSchedule(id, date);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployees should return correct property', async () => {
    const res = await getEmployees(id);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeePositions should return correct property', async () => {
    const res = await getEmployeePositions();
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeePhoto should return correct property', async () => {
    const res = await getEmployeePhoto(id);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeeAppointments should return correct property', async () => {
    const res = await getEmployeeAppointments(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('getRoomAssignments should return correct property', async () => {
    const res = await getRoomAssignments(date, id);
    expect(res).toEqual(returnData.response);
  });
  test('getEmployeeStatus should return correct property', async () => {
    const res = await getEmployeeStatus(id);
    expect(res).toEqual(returnData.response);
    const res2 = await getEmployeeStatus(id, false);
    expect(res2).toEqual(returnData.response);
  });
});
