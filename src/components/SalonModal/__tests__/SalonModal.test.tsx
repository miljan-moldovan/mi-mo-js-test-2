import * as React from 'react';
import { mount, render, shallow } from 'enzyme';
import { Text } from 'react-native';
import SalonModal from '../index';

describe('<SalonModal />', () => {

  const defaultProps = {
    isVisible: true,
    closeModal: () => {},
    showTail: true,
  };

  const mountComponent = props =>
    shallow(
      <SalonModal {...props}>
        <Text>It works</Text>
      </SalonModal>,
    );

  describe('Should render childs correctly', () => {
    it('Text', () => {
      const wrapped = mountComponent(defaultProps).containsMatchingElement(<Text>It works</Text>);
      expect(wrapped).toBe(true);
    });
  });

  describe('Render tail correctly', () => {
    it('render tail', () => {
      const wrapped = mountComponent(defaultProps);
      expect(wrapped.find('View')).toHaveLength(4);
      wrapped.setProps({ showTail: false });
      expect(wrapped.find('View')).toHaveLength(2);
    });
  });
});
