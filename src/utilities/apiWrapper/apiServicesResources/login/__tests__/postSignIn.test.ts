import postSignIn from '../postSignIn';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

const returnData = {
  response: {
    data: 'test',
  },
};

mock.onPost('MobilePos/SignIn').reply(200, returnData);

describe('postSignIn', () => {
  test('Should return correct property', async () => {
    const res = await postSignIn('url', 'username', 'password');
    expect(res).toEqual(returnData);
  });
});
