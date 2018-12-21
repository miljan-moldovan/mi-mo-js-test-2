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

const id = 101;
const reqData = {
  queueItemId: id,
  employeeId: id,
  idEmployee: id,
  serviceId: id,
  idService: id,
  groupId: id,
  clientQueueId: id,
  serviceEmployeeId: id,
  id,
};

mock
  .onDelete(`Queue/Group/${id}`).reply(200, returnData)
  .onGet('Queue').reply(200, returnData)
  .onGet(`Queue/${id}`).reply(200, returnData)
  .onGet('Queue/ClientsToday').reply(200, returnData)
  .onGet(`Queue/${id}/ServiceEmployee/${id}/Services`).reply(200, returnData)
  .onGet('Queue/Group').reply(200, returnData)
  .onGet(`Queue/${id}/Service/${id}/Employees`).reply(200, returnData)
  .onGet(`Queue/${id}/ServiceEmployee/${id}/Services`).reply(200, returnData)
  .onGet('Queue/State').reply(200, returnData)
  .onPost('Queue/Group').reply(200, returnData)
  .onPost('Queue/WalkIn/Client').reply(200, returnData)
  .onPost('Queue/Walkin/Walkin').reply(200, returnData)
  .onPut(`Queue/${id}`).reply(200, returnData)
  .onPut(`Queue/${id}/Employee/${id}/Service/${id}/Service`).reply(200, returnData)
  .onPut(`Queue/${id}/Employee/${id}/Service/${id}/Employee`).reply(200, returnData)
  .onPut(`Queue/Group/${id}/Leader/${id}`).reply(200, returnData)
  .onPut(`Queue/${id}/ServiceEmployee/${id}/Employee`).reply(200, returnData)
  .onPut(`Queue/${id}/ServiceEmployee/${id}/Service`).reply(200, returnData)
  .onPut(`Queue/Service/ByEmployee/${id}`).reply(200, returnData);

describe('Queue', () => {
  test('deleteQueueGroup should return correct property', async () => {
    const res = await deleteQueueGroup(id);
    expect(res).toEqual(returnData.response);
  });
  test('getQueue should return correct property', async () => {
    const res = await getQueue();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueById should return correct property', async () => {
    const res = await getQueueById(id);
    expect(res).toEqual(returnData.response);
  });
  test('getQueueClientsToday should return correct property', async () => {
    const res = await getQueueClientsToday();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueEmployeeServices should return correct property', async () => {
    const res = await getQueueEmployeeServices(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('getQueueGroups should return correct property', async () => {
    const res = await getQueueGroups();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueServiceEmployees should return correct property', async () => {
    const res = await getQueueServiceEmployees(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('postQueueGroup should return correct property', async () => {
    const res = await postQueueGroup(id);
    expect(res).toEqual(returnData.response);
  });
  test('postQueueWalkinClient should return correct property', async () => {
    const res = await postQueueWalkinClient(id);
    expect(res).toEqual(returnData.response);
  });
  test('postQueueWalkinWalkin should return correct property', async () => {
    const res = await postQueueWalkinWalkin(id);
    expect(res).toEqual(returnData.response);
  });
  test('putQueue should return correct property', async () => {
    const res = await putQueue(id, id);
    expect(res).toEqual(returnData.response);
  });
  test('putQueueEmployeeService should return correct property', async () => {
    const res = await putQueueEmployeeService(reqData, 'test');
    expect(res).toEqual(returnData.response);
  });
  test('putQueueEmployeeServiceEmployee should return correct property', async () => {
    const res = await putQueueEmployeeServiceEmployee(reqData, 'test');
    expect(res).toEqual(returnData.response);
  });
  test('putQueueGroupLeader should return correct property', async () => {
    const res = await putQueueGroupLeader(reqData, id);
    expect(res).toEqual(returnData.response);
  });
  test('putServiceByEmployee should return correct property', async () => {
    const res = await putServiceByEmployee(id, id);
    expect(res).toEqual(returnData.response);
  });
  test('getQueueState should return correct property', async () => {
    const res = await getQueueState();
    expect(res).toEqual(returnData.response);
  });
  test('getQueueServiceEmployeeServices should return correct property', async () => {
    const res = await getQueueServiceEmployeeServices(reqData);
    expect(res).toEqual(returnData.response);
  });
  test('putQueueServiceEmployeeEmployee should return correct property', async () => {
    const res = await putQueueServiceEmployeeEmployee(id, id, 'testService');
    expect(res).toEqual(returnData.response);
  });
  test('putQueueServiceEmployeeService should return correct property', async () => {
    const res = await putQueueServiceEmployeeService(id, id, 'testService');
    expect(res).toEqual(returnData.response);
  });
});
