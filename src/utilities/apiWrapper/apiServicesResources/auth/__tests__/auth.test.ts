import ResetPassword from '../resetPassword';

import axios from 'axios';

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

const incorrectUrl = 'pleaseTestMe';
const correctUrl = 'sportclips';
const username = 'Vasiliy';

const responses = {
  error: {
    result: 2,
    userMessage: 'username is incorrect',
  },
  incorrectUrl: {
    result: 1,
  },
  correct: {
    result: 1,
  },
};

const returnedData = {
  error: {
    errorMessages: [
      'username is incorrect',
      'Url is incorrect',
    ],
    errors: {
      urlError: true,
      usernameError: true,
    },
    success: false,
  },
  incorrectUrl: {
    errorMessages: [
      'Url is incorrect',
    ],
    errors: {
      urlError: true,
      usernameError: false,
    },
    success: false,
  },
  correct: {
    errorMessages: [],
    errors: {
      urlError: false,
      usernameError: false,
    },
    success: true,
  },
};

mock
  .onPost('/MobilePos/ResetPassword', { username, url: correctUrl }).reply(200, responses.correct)
  .onPost('/MobilePos/ResetPassword', { username }).reply(200, responses.incorrectUrl)
  .onPost('/MobilePos/ResetPassword').reply(503, responses.error);


describe('Auth', () => {
  test('ResetPassword returns correct data', async () => {
    const res = await ResetPassword({ url: correctUrl, username });
    expect(res).toEqual(returnedData.correct);
  });
  test('ResetPassword returns error messages when req failed', async () => {
    const res = await ResetPassword({ url: incorrectUrl, username });
    expect(res).toEqual(returnedData.incorrectUrl);
  });
  test('ResetPassword returns error messages when req had thrown', async () => {
    const res = await ResetPassword({ url: incorrectUrl, username: 'ERROR' });
    expect(res).toEqual(returnedData.error);
  });
});
