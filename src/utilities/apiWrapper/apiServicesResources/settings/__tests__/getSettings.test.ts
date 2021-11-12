import getSettings from '../getSettings';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Settings').reply(200, returnData);

describe('getSettings', () => {
  test('Should return correct property', async () => {
    const res = await getSettings();
    expect(res).toEqual(returnData.response);
  });
});
