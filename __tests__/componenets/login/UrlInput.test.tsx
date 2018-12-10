import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import UrlInput from '../../../src/components/login/UrlInput';

describe('UrlInput', () => {
  it ('renders correctly', () => {
    const wrapper = shallow(
        <UrlInput />,
      );
      expect(wrapper.dive()).toMatchSnapshot();
  });

  // it ('onchange succesfully', () => {
  //   const wrapper = mount(
  //       <UrlInput />,
  //     );
  //   const urlInput = wrapper.find('Input');
  //   const aux = sinon.spy(UrlInput, 'handleURLChange');
  //   urlInput.find.simulate('valueChange');
  //   expect(aux.calledOnce).toBe(true);
  //
  // });
})
