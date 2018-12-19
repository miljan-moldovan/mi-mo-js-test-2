import postTurnAway from '../postTurnAway';
import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

const returnData = {
  userMessage: {
    test: 'test',
  },
};

mock.onPost('TurnAway').reply(200, returnData);

describe('postTurnAway', () => {
  test('Should return correct property', async () => {
    const res = await postTurnAway('test');
    expect(res).toEqual(returnData.userMessage);
  });
});
