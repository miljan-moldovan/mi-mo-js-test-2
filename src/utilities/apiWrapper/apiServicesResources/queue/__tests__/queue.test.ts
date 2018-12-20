import deleteQueueGroup from '../deleteQueueGroup';
import getQueue from '../getQueue';
import getQueueById from '../getQueueById';
import getQueueClientsToday from '../getQueueClientsToday';
import getQueueEmployeeServices from '../getQueueEmployeeServices';
import getQueueGroups from '../getQueueGroups';
import getQueueServiceEmployees from '../getQueueServiceEmployees';
import postQueueGroup from '../postQueueGroup';
import postQueueWalkinClient from '../postQueueWalkinClient';
import postQueueWalkinWalkin from '../postQueueWalkinWalkin';
import putQueue from '../putQueue';
import putQueueEmployeeService from '../putQueueEmployeeService';
import putQueueEmployeeServiceEmployee from '../putQueueEmployeeServiceEmployee';
import putQueueGroupLeader from '../putQueueGroupLeader';
import putServiceByEmployee from '../putServiceByEmployee';
import getQueueState from '../getQueueState';
import getQueueServiceEmployeeServices from '../getQueueServiceEmployeeServices';
import putQueueServiceEmployeeEmployee from '../putQueueServiceEmployeeEmployee';
import putQueueServiceEmployeeService from '../putQueueServiceEmployeeService';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
const returnData = {
  response: {
    test: 'test',
  },
};

mock.onDelete('Queue/Group/101').reply(200, returnData);
mock.onGet('Queue').reply(200, returnData);
mock.onGet('Queue/101').reply(200, returnData);
mock.onGet('Queue/ClientsToday').reply(200, returnData);
mock.onGet('Queue/101/ServiceEmployee/101/Services').reply(200, returnData);
mock.onGet('Queue/Group').reply(200, returnData);
mock.onGet('Queue/101/Service/101/Employees').reply(200, returnData);
mock.onGet('Queue/101/ServiceEmployee/101/Services').reply(200, returnData);
mock.onGet('Queue/State').reply(200, returnData);
mock.onPost('Queue/Group').reply(200, returnData);
mock.onPost('Queue/WalkIn/Client').reply(200, returnData);
mock.onPost('Queue/Walkin/Walkin').reply(200, returnData);
mock.onPut('Queue/101').reply(200, returnData);
mock.onPut('Queue/101/Employee/101/Service/101/Service').reply(200, returnData);
mock.onPut('Queue/101/Employee/101/Service/101/Employee').reply(200, returnData);
mock.onPut('Queue/Group/101/Leader/101').reply(200, returnData);
mock.onPut('Queue/101/ServiceEmployee/101/Employee').reply(200, returnData);
mock.onPut('Queue/101/ServiceEmployee/101/Service').reply(200, returnData);
mock.onPut('Queue/Service/ByEmployee/101').reply(200, returnData);

describe('Queue', () => {
  test('deleteQueueGroup should return correct property', async () => {
    const res = await deleteQueueGroup(101);
    expect(res).toEqual(returnData.response);
  });
  test('getQueue should return correct property', async () => {
    const res = await getQueue();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueById should return correct property', async () => {
    const res = await getQueueById(101);
    expect(res).toEqual(returnData.response);
  });
  test('getQueueClientsToday should return correct property', async () => {
    const res = await getQueueClientsToday();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueEmployeeServices should return correct property', async () => {
    const res = await getQueueEmployeeServices({ id: 101, idEmployee: 101 });
    expect(res).toEqual(returnData.response);
  });
  test('getQueueGroups should return correct property', async () => {
    const res = await getQueueGroups();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueServiceEmployees should return correct property', async () => {
    const res = await getQueueServiceEmployees({ id: 101, idService: 101 });
    expect(res).toEqual(returnData.response);
  });
  test('postQueueGroup should return correct property', async () => {
    const res = await postQueueGroup(101);
    expect(res).toEqual(returnData.response);
  });
  test('postQueueWalkinClient should return correct property', async () => {
    const res = await postQueueWalkinClient(101);
    expect(res).toEqual(returnData.response);
  });
  test('postQueueWalkinWalkin should return correct property', async () => {
    const res = await postQueueWalkinWalkin(101);
    expect(res).toEqual(returnData.response);
  });
  test('putQueue should return correct property', async () => {
    const res = await putQueue(101, 101);
    expect(res).toEqual(returnData.response);
  });
  test('putQueueEmployeeService should return correct property', async () => {
    const res = await putQueueEmployeeService({ queueItemId: 101, employeeId: 101, serviceId: 101 }, 101);
    expect(res).toEqual(returnData.response);
  });
  test('putQueueEmployeeServiceEmployee should return correct property', async () => {
    const res = await putQueueEmployeeServiceEmployee({ queueItemId: 101, employeeId: 101, serviceId: 101 }, 101);
    expect(res).toEqual(returnData.response);
  });
  test('putQueueGroupLeader should return correct property', async () => {
    const res = await putQueueGroupLeader({ groupId: 101, clientQueueId: 101 }, 101);
    expect(res).toEqual(returnData.response);
  });
  test('putServiceByEmployee should return correct property', async () => {
    const res = await putServiceByEmployee(101, 101);
    expect(res).toEqual(returnData.response);
  });
  test('getQueueState should return correct property', async () => {
    const res = await getQueueState();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueServiceEmployeeServices should return correct property', async () => {
    const res = await getQueueServiceEmployeeServices({ id: 101, serviceEmployeeId: 101 });
    expect(res).toEqual(returnData.response);
  });
  test('putQueueServiceEmployeeEmployee should return correct property', async () => {
    const res = await putQueueServiceEmployeeEmployee(101, 101, { some: 'new service' });
    expect(res).toEqual(returnData.response);
  });
  test('putQueueServiceEmployeeService should return correct property', async () => {
    const res = await putQueueServiceEmployeeService(101, 101, { some: 'new service' });
    expect(res).toEqual(returnData.response);
  });
});
