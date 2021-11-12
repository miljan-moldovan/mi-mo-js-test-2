import getService from '../getService';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Services/101').reply(200, returnData);

describe('getService', () => {
  test('Should return correct property', async () => {
    const res = await getService(101);
    expect(res).toEqual(returnData.response);
  });
});
