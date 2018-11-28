import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ErrorsView from '../../src/components/ErrorsView';

describe('ErrorView', () => {
  it ('renders correctly', () => {
    const wrapper = shallow(
        <ErrorsView />,
      );
      expect(wrapper.dive()).toMatchSnapshot();
  });
})
