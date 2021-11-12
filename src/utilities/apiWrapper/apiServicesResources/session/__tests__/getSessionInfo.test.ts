import getSessionInfo from '../getSessionInfo';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Session/Info').reply(200, returnData);

describe('getSessionInfo', () => {
  test('Should return correct property', async () => {
    const res = await getSessionInfo();
    expect(res).toEqual(returnData.response);
  });
});
