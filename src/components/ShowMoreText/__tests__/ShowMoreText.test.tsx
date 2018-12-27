import * as React from 'react';
import { mount, configure } from 'enzyme';
import ShowMoreText from '../index';

describe('<ShowMoreText />', () => {
  let defaultProps;

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  const mountComponent = (props = defaultProps) => {
    return mount(<ShowMoreText {...props} />);
  };

  beforeEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = () => {};
    defaultProps = {
      maxLength: 20,
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut laoreet quam dolor. \
        Praesent nunc ante, interdum eget elementum rhoncus, vulputate et ante. \
        Aenean a semper urna, at maximus ligula posuere.',
    };
  });
  afterEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = origConsole;
  });

  it('renders correctly', () => {
    expect(mountComponent()).toMatchSnapshot();
  });

  describe('Should properly cut down text if its length exceeds max length', () => {
    it('text exceeds max length', () => {
      const renderedText = mountComponent()
        .find('Text')
        .first()
        .text();
      expect(renderedText.length).toBe(defaultProps.maxLength);
    });
    it('text does not (!) exceed max length', () => {
      defaultProps.text = 'hello this is dog';
      const renderedText = mountComponent()
        .find('Text')
        .first()
        .text();
      expect(renderedText.length).toBe(defaultProps.text.length);
    });
  });

  describe('Should update state when text from props change', () => {
    it('new text is the same as old', () => {
      const component = mountComponent();
      const oldState = component.state();
      component.setProps({ ...defaultProps });
      expect(component.state()).toEqual(oldState);
    });
    it('new text is not the same', () => {
      const component = mountComponent();
      const oldState = component.state();
      component.setProps({ ...defaultProps, text: 'hello this is dog' });
      expect(component.state()).not.toEqual(oldState);
    });
    it('new text is cut down to maxLength', () => {
      const component = mountComponent();
      component.setProps({ ...defaultProps, text: 'abcdefghijklmnopqrstuvwxyz' });
      expect(component.state('text').length).toEqual(defaultProps.maxLength);
    });
  });

  describe('Should properly render `show more/less` button', () => {
    it('text exceeds max length => SHOULD render button', () => {
      const button = mountComponent().exists('SalonTouchableOpacity(TouchableOpacity)');
      expect(button).toEqual(true);
    });
    it('text does not (!) exceed max length => SHOULD NOT render button', () => {
      defaultProps.text = 'hello this is dog';
      const button = mountComponent().exists('SalonTouchableOpacity(TouchableOpacity)');
      expect(button).toEqual(false);
    });
  });

  describe('Buttons should properly toggle state', () => {
    it('state toggles', () => {
      const component = mountComponent();

      component.instance().onPressShowMore();
      expect(component.state('showMore')).toEqual(false);

      component.instance().onPressShowLess();
      expect(component.state('showMore')).toEqual(true);
    });
  });
});
