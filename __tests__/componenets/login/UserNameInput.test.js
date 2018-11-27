import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import UserNameInput from '../../../src/components/login/UserNameInput';

describe('UserNameInput', () => {
  it ('renders correctly', () => {
    const wrapper = shallow(
        <UserNameInput />,
      );
      expect(wrapper.dive()).toMatchSnapshot();
  });
})
