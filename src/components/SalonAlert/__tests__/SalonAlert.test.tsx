import * as React from 'react';
import { shallow } from 'enzyme';
import SalonAlert from '../index';
import { Text } from 'react-native';

describe('<SalonAlert />', () => {

  const mountComponent = props =>
    shallow(
      <SalonAlert {...props} />,
    );

  const defaultPropsForRightButton = {
    visible: true,
    onPressRight: () => { return 'on press right button'; },
    btnRightText: 'right Text',
  };

  const defaultPropsForLeftButton = {
    visible: true,
    onPressLeft: () => { return 'on press left button'; },
    btnLeftText: 'left Text',
  };

  describe('Should render button with right text, when render only one button', () => {

    it('render right button', () => {
      const wrappedComponent = mountComponent(defaultPropsForRightButton)
        .containsMatchingElement(<Text>{defaultPropsForRightButton.btnRightText}</Text>);
      expect(wrappedComponent).toBe(true);
    });

    it('do not render right button', () => {
      const wrappedComponent = mountComponent(defaultPropsForLeftButton)
        .containsMatchingElement(<Text>{defaultPropsForRightButton.btnRightText}</Text>);
      expect(wrappedComponent).toBe(false);
    });

    it('render left button', () => {
      const wrappedComponent = mountComponent(defaultPropsForLeftButton)
        .containsMatchingElement(<Text>{defaultPropsForLeftButton.btnLeftText}</Text>);
      expect(wrappedComponent).toBe(true);
    });

    it('do not render left button', () => {
      const wrappedComponent = mountComponent(defaultPropsForRightButton)
        .containsMatchingElement(<Text>{defaultPropsForLeftButton.btnLeftText}</Text>);
      expect(wrappedComponent).toBe(false);
    });
  });

  describe('Should render all button and title', () => {
    const wrappedComponent = mountComponent({ ...defaultPropsForRightButton, ...defaultPropsForLeftButton });

    const rightButton = wrappedComponent
      .containsMatchingElement(<Text>{defaultPropsForRightButton.btnRightText}</Text>);
    const leftButton = wrappedComponent
      .containsMatchingElement(<Text>{defaultPropsForLeftButton.btnLeftText}</Text>);
    const checkRenderTitle = wrappedComponent.find('View');

    it('render right button', () => {
      expect(rightButton).toBe(true);
    });

    it('render left button', () => {
      expect(leftButton).toBe(true);
    });

    it('render title', () => {
      expect(checkRenderTitle).toHaveLength(5);
    });

  });

  describe('Should call right function, when render only one button', () => {
    it('on press right button', () => {
      const result =  mountComponent(defaultPropsForRightButton)
        .find('TouchableOpacity')
        .props().onPress();

      expect(result).toBe('on press right button');
    });

    it('on press left button', () => {
      const result =  mountComponent(defaultPropsForLeftButton)
        .find('TouchableOpacity')
        .props().onPress();

      expect(result).toBe('on press left button');
    });
  });

  describe('Should call right function, when render two button', () => {
    const wrappedComponent = mountComponent({ ...defaultPropsForRightButton, ...defaultPropsForLeftButton });
    const listButton = wrappedComponent.find('TouchableOpacity');

    const resultRightButton = listButton.get(0).props.onPress();
    const resultLeftButton = listButton.get(1).props.onPress();

    it('press right button', () => {
      expect(resultRightButton).toBe('on press left button');
    });

    it('press left button', () => {
      expect(resultLeftButton).toBe('on press right button');
    });
  });
});
