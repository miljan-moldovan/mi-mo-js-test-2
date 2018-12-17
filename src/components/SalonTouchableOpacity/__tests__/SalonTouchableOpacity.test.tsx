import * as React from 'react';
import { mount } from 'enzyme';
import { Text } from 'react-native';
import SalonTouchableOpacity from '../';

describe('<SalonTouchableOpacity />', () => {
  jest.useFakeTimers();
  const mockOnPress = jest.fn();

  const defaultProps = {
    onPress: mockOnPress,
    disabled: false,
    wait: undefined,
  };

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  console.error = () => {
  };
  afterAll(() => {
    console.error = origConsole;
  });

  const mountComponent = props =>
    mount(
      <SalonTouchableOpacity {...props}>
        <Text>It works!</Text>
      </SalonTouchableOpacity>,
    );

  describe('Should render childs correctly', () => {
    it('TouchableOpacity', () => {
      const wrappedComponent = mountComponent(defaultProps).find('TouchableOpacity');
      expect(wrappedComponent.length).toBe(1);
    });
    it('Text', () => {
      const wrappedComponent = mountComponent(defaultProps).containsMatchingElement(<Text>It works!</Text>);
      expect(wrappedComponent).toBe(true);
    });
  });

  describe('When `disabled` is', () => {
    afterAll(() => {
      defaultProps.disabled = false;
    });
    beforeEach(() => mockOnPress.mockReset());

    const onPressFunction = mountComponent(defaultProps)
      .find('TouchableOpacity')
      .props().onPress;

    it('False: should call "onPress"', () => {
      defaultProps.disabled = false;
      onPressFunction();

      expect(mockOnPress).toBeCalled();
    });

    it('True: should NOT call "onPress"', () => {
      defaultProps.disabled = true;
      onPressFunction();

      expect(mockOnPress).not.toBeCalled();
    });
  });

  describe('Should prevent double click', () => {
    const onPressFunction = mountComponent(defaultProps)
      .find('TouchableOpacity')
      .props().onPress;

    it('"onPress" is called 1000 times, should run only once', () => {
      // tslint:disable-next-line
      for (let i = 0; i < 1000; i++) {
        onPressFunction();
      }
      jest.runOnlyPendingTimers();

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });
});
