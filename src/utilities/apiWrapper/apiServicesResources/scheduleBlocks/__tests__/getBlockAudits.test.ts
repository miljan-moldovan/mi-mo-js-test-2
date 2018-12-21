import getBlockAudits from '../getBlockAudits';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  response: {
    test: 'test',
  },
};

mock.onGet('ScheduleBlock/101/Audit').reply(200, returnData);

describe('getBlockAudits', () => {
  test('Should return correct property', async () => {
    const res = await getBlockAudits(101);
    expect(res).toEqual(returnData.response);
  });
});
