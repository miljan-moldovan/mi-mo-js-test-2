import getServices from '../getServices';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Services').reply(200, returnData);

describe('getServices', () => {
  test('Should return correct property', async () => {
    const res = await getServices();
    expect(res).toEqual(returnData.response);
  });
});
