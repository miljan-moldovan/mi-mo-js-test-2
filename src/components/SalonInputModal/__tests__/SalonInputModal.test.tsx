import * as React from 'react';
import { shallow } from 'enzyme';
import { Text, StyleSheet } from 'react-native';
import SalonInputModal from '../index';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';

const styles = StyleSheet.create({
  textInput: {
    height: 30,
    paddingVertical: 5,
    paddingRight: 5,
  },
  textArea: {
    height: 123,
    paddingVertical: 5,
    paddingRight: 5,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    color: '#115ECD',
    fontFamily: 'Roboto',
    paddingHorizontal: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  titleWithDescription: {
    marginBottom: 5,
  },
});

describe('<SalonInputModal />', () => {

  jest.useFakeTimers();
  const mockOnPressOk = jest.fn(value => value);
  const mockOnPressCancel = jest.fn();

  const mountComponent = props =>
    shallow(<SalonInputModal {...props}/>);

  const defaultProps = {
    description: 'test description',
    visible: true,
    title: 'render title',
    isTextArea: false,
    placeholder: 'placeholder',
    onPressOk: mockOnPressOk,
    onPressCancel: mockOnPressCancel,
  };

  const propsForHidden = {
    description: 'test description',
    visible: false,
    onPressOk: () => {},
    onPressCancel: () => {},
    title: 'render title',
  };

  describe('Render correctly', () => {
    it('render description', () => {
      const expectedComponent = mountComponent(defaultProps)
        .containsMatchingElement(<Text>{defaultProps.description}</Text>);
      expect(expectedComponent).toBe(true);

      const expectedComponentWithoutDescription = mountComponent({ ...defaultProps, description: '' })
        .containsMatchingElement(<Text>{defaultProps.description}</Text>);
      expect(expectedComponentWithoutDescription).toBe(false);
    });

    it('render title', () => {
      const component = mountComponent(defaultProps);
      const componentWithoutDescription = mountComponent({ ...defaultProps, description: '' });

      expect(component.containsMatchingElement(<Text>{defaultProps.title}</Text>)).toBe(true);
      expect(component.find('Text').get(0).props.style).toEqual([styles.title, styles.titleWithDescription]);
      expect(componentWithoutDescription.find('Text').get(0).props.style).toEqual([styles.title, {}]);
    });

    it('hidden modal', () => {
      const component = mountComponent(propsForHidden).find('Modal');
      expect(component).toHaveLength(0);
    });

    it('render text input correctly', () => {
      const component = mountComponent(defaultProps);

      expect(component.find('TextInput').props().numberOfLines).toBe(1);
      expect(component.find('TextInput').props().style).toEqual(styles.textInput);
      expect(component.find('TextInput').props().multiline).toBe(false);
      expect(component.find('TextInput').props().placeholder).toEqual(defaultProps.placeholder);
      expect(component.find('TextInput').props().value).toEqual('');
      component.setState({ value: 'test value' });
      component.update();
      expect(component.find('TextInput').props().value).toEqual('test value');

      const textArea = mountComponent({ ...defaultProps, isTextArea: true })
        .find('TextInput').props();
      expect(textArea.numberOfLines).toBe(20);
      expect(textArea.style).toEqual(styles.textArea);
      expect(textArea.multiline).toBe(true);
    });
  });

  describe('test attribute with function', () => {
    beforeEach(() => {
      mockOnPressOk.mockReset();
      mockOnPressCancel.mockReset();
    });

    it('onChangeText at textInput', () => {
      const component = mountComponent(defaultProps);

      expect(component.state().value).toBe('');
      component.find('TextInput').simulate('changeText', 'test text');
      expect(component.state().value).toBe('test text');
    });

    it('handle OK button', () => {
      const component = mountComponent(defaultProps);

      component.setState({ value: 'test press ok' });
      component.update();
      component.find(SalonTouchableOpacity).get(1).props.onPress();

      expect(mockOnPressOk).toHaveBeenCalledTimes(1);
      expect(mockOnPressOk).toHaveBeenCalledWith('test press ok');
    });

    it('handle cancel button', () => {
      const component = mountComponent(defaultProps);

      component.setState({ value: 'test press cancel' });
      component.update();
      component.find(SalonTouchableOpacity).get(0).props.onPress();

      expect(mockOnPressCancel).toHaveBeenCalledTimes(1);
      expect(component.state().value).toBe('');
    });
  });
});
