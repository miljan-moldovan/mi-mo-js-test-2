import * as React from 'react';
import { shallow } from 'enzyme';

import UserNameInput from '../';

describe('UserNameInput', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <UserNameInput
        loggedIn
        handleUsernameChange={jest.fn()}
        username="test"
        userNameError
      />,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
