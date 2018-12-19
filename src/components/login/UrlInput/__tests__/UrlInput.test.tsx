import * as React from 'react';
import { shallow, mount } from 'enzyme';

import UrlInput from '../';

const mockProptypes = {
  url: 'http://test.com',
  loggedIn: true,
  handleURLChange: jest.fn(),
  showSuccess: true,
  showFail: true,
};
describe('UrlInput', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <UrlInput {...mockProptypes} />,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
