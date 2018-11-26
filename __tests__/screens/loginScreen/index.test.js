import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';

import LoginScreen from '../../../src/screens/loginScreen';

const mockStore = configureStore();

const initialState = {
  auth: {
    url: '',
    username: '',
    loggedIn: false,
    userId: null,
    guardUserId: 0,
    centralEmployeeId: 0,
    employeeId: 0,
    storeKey: 0,
    baseHost: '',
    currentEmployee: null,
  }
};

describe('LoginScreen', () => {
  it ('renders correctly', () => {
    const wrapper = shallow(
        <LoginScreen />,
        { context: { store: mockStore(initialState) } },
      );
      expect(wrapper.dive()).toMatchSnapshot();
  });
})
