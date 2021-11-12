import getSettingsByName from '../getSettingsByName';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('Settings/ByName/testName').reply(200, returnData);

describe('getSettingsByName', () => {
  test('Should return correct property', async () => {
    const res = await getSettingsByName('testName');
    expect(res).toEqual(returnData.response);
  });
});
