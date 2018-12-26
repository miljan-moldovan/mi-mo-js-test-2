import getEmployeesByService from '../getEmployeesByService';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const query = {
  a: {
    b: 'hello',
  },
};

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Services/101/Employees?a%5Bb%5D=hello').reply(200, returnData);

describe('getEmployeesByService', () => {
  test('Should return correct property', async () => {
    const res = await getEmployeesByService(101, query);
    expect(res).toEqual(returnData.response);
  });
});
