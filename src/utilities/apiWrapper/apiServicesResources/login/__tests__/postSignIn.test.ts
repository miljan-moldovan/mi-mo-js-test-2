import postSignIn from '../postSignIn';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

const returnData = {
  response: {
    data: 'test',
  },
};

mock
  .onPost('MobilePos/SignIn').replyOnce(200, returnData)
  .onPost('MobilePos/SignIn').replyOnce(501, returnData)
  .onPost('MobilePos/SignIn').networkError();

describe('postSignIn', () => {
  test('Should return correct property', async () => {
    const res = await postSignIn('url', 'username', 'password');
    expect(res).toEqual(returnData);
  });
  test('Should not throw if request failed, resolves to error message', async () => {
    await expect(postSignIn('url', 'username', 'password'))
            .resolves.toEqual(returnData);
    await expect(postSignIn('url', 'username', 'password'))
            .resolves.toEqual(Error('Network Error'));
  });
});
