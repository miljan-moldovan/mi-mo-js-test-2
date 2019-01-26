import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as selectActions from '../';
import axios from 'axios';
import { AT } from '../';
import { Tasks } from '@/constants/Tasks';

const middlewares = [thunk];

const mockStore = configureStore(middlewares);
const store = mockStore();

const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);

const response = {
  result: 1,
  response: 'token',
};

const responseFailure = {
  result: 2,
  response: 'token',
  userMessage: 'test',
};


const url = 'https://test.com';
const username = 'test';
const password = 'password';

const processErrorMock = {
  error: { response: { data: { errors: ['test'], loginError: true, message: 'test' } } },
  message: 'The server has returned an error. test',
  type: 'SERVER',
};
const errorMock = { response: { data: { errors: ['test'], loginError: true, message: 'test' } } };
describe('login_actions', () => {
  beforeEach(() => { // Runs before each test in the suite
    store.clearActions();
    mock.onGet(`Session/Task/${Tasks.Mobile_PosApp}/IsAllowed`).reply(200, {
      response: {
        data: 1,
      },
    });
  });

  afterEach(() => {
    mock.reset();
  });

  test('Dispatch login', () => {
    const callback = jest.fn();
    mock.onPost('MobilePos/SignIn').reply(200, response);
    return store.dispatch(selectActions.login(url, username, password, callback)).then(() => {
      expect(callback).toBeCalled();
      expect(callback).toBeCalledWith(true);
    });
  });

  test('Dispatch login failure', () => {
    const callback = jest.fn();
    mock.onPost('MobilePos/SignIn').reply(200, responseFailure);
    const expectedActions = [
      {
        type: AT.LOGIN_FAILURE,
        data: { errorMessage: `The server has returned an error. ${responseFailure.userMessage}` },
      },
    ];
    return store.dispatch(selectActions.login(url, username, password, callback)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(callback).toBeCalled();
      expect(callback).toBeCalledWith(false, processErrorMock, errorMock);
    });
  });
});
