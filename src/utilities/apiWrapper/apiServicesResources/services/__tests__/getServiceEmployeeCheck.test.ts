import getServiceEmployeeCheck from '../getServiceEmployeeCheck';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const query = {
  serviceId: 101,
  employeeId: 101,
  setCancelToken: false,
};

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Services/101/Check/Employee/101').reply(200, returnData);

describe('getServiceEmployeeCheck', () => {
  test('Should return correct property', async () => {
    const res = await getServiceEmployeeCheck(query);
    expect(res).toEqual(returnData.response);
  });
  test('Should cancel request when setCancelToken is true', async () => {
    delete query.setCancelToken;
    await expect(getServiceEmployeeCheck(query)).rejects.toThrow('Cancel');
  });
});
