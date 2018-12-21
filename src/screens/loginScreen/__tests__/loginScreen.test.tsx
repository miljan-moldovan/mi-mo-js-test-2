import * as React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import LoginScreen from '../';

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
  },
};
const navigation = { navigate: jest.fn() };

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <LoginScreen navigation={navigation}/>,
      { context: { store: mockStore(initialState) } },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
