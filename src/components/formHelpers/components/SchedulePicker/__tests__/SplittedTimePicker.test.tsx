import * as React from 'react';
import { mount } from 'enzyme';
import SplittedTimePicker from '../SplittedTimePicker';
import moment = require('moment');
import { ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

describe('SplittedTimePicker', () => {
  let props;
  let mountedSplittedTimePicker;

  // just for remove error with depend using react-dom for render. Need it before use adapter for RN
  const origConsole = console.error;
  const splittedTimePicker = () => {
    if (!mountedSplittedTimePicker) {
      mountedSplittedTimePicker = mount(
        <SplittedTimePicker {...props} />,
      );
    }
    return mountedSplittedTimePicker;
  };

  beforeEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = () => {
    };
    props = {
      isLoading: false,
      isStart: true,
      onValueChange: undefined,
      step: 15,
      expectedRanges: [],
      maximumDate: moment('23:00:00', 'hh:mm:ss'),
      minimumDate: moment('05:00:00', 'hh:mm:ss'),
      selectedValue: undefined,
    };
    mountedSplittedTimePicker = undefined;
  });
  afterEach(() => {
    // just for remove error with depend using react-dom for render. Need it before use adapter for RN
    console.error = origConsole;
  });

  it('Should render DatePicker when `isLoading` is false', () => {
    const component = splittedTimePicker().find('DatePicker');
    expect(component.length).toBe(1);
  });


  describe('when `isStart` is false', () => {
    beforeEach(() => {
      props.isStart = false;
      props.maximumDate = moment('23:00:00', 'hh:mm:ss');
      props.minimumDate = moment('05:00:00', 'hh:mm:ss');
      props.step = 15;
    });
    it('Should return correct minimumDate', () => {
      const wrapper = splittedTimePicker().instance().minimumDate;
      expect(wrapper.toDate()).toEqual(moment('05:15:00', 'hh:mm:ss').toDate());
    });
    it('Should return correct maximumDate', () => {
      const wrapper = splittedTimePicker().instance().maximumDate;
      expect(wrapper.toDate()).toEqual(moment('23:00:00', 'hh:mm:ss').toDate());
    });
  });

  describe('when `isStart` is true', () => {
    beforeEach(() => {
      props.isStart = true;
      props.maximumDate = moment('23:00:00', 'hh:mm:ss');
      props.minimumDate = moment('05:00:00', 'hh:mm:ss');
      props.step = 15;
    });
    it('Should return correct minimumDate', () => {
      const wrapper = splittedTimePicker().instance().minimumDate;
      expect(wrapper.toDate()).toEqual(moment('05:00:00', 'hh:mm:ss').toDate());
    });
    it('Should return correct maximumDate', () => {
      const wrapper = splittedTimePicker().instance().maximumDate;
      expect(wrapper.toDate()).toEqual(moment('22:45:00', 'hh:mm:ss').toDate());
    });
  });

  describe('when `isLoading` is true', () => {
    beforeEach(() => {
      props.isLoading = true;
    });

    it('Should not render DatePicker', () => {
      const component = splittedTimePicker().find('DatePicker');
      expect(component.length).toBe(0);
    });

    it('Should render ActivityIndicator', () => {
      const component = splittedTimePicker().contains(<ActivityIndicator color={Colors.defaultGrey}/>);
      expect(component).toBeTruthy();
    });
  });

  describe('After call componentDidMount', () => {
    beforeEach(() => {
      props.step = 30;
    });
    it('Check if set correct minuteInterval', () => {
      const state = splittedTimePicker().state();
      expect(state.interval).toBe(30);
    });
  });
});
