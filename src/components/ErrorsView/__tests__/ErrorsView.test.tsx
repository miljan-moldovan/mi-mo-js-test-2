import * as React from 'react';
import { shallow, mount } from 'enzyme';

import ErrorsView from '../';

describe('ErrorView', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <ErrorsView/>,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
