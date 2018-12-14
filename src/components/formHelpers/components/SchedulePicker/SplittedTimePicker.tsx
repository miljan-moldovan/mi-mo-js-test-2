import * as React from 'react';
// @ts-ignore
import { DatePicker } from 'react-native-wheel-datepicker';
import styles from './style';
import { ActivityIndicator, View, Alert } from 'react-native';
import Colors from '../../../../constants/Colors';
import moment = require('moment');
import PropTypes from 'prop-types';

type IExpectedRanges = {
  minimumDate: moment.Moment;
  maximumDate: moment.Moment;
};

type IProps = {
  isLoading: boolean;
  isStart: boolean;
  onValueChange: (arg: moment.Moment) => void;
  step: number;
  expectedRanges: [IExpectedRanges];
  maximumDate: moment.Moment;
  minimumDate: moment.Moment;
  selectedValue: moment.Moment;
};

type IState = {
  interval: number;
};

const getMinDate = (minimumDate: moment.Moment, step: number, isStart: boolean) => {
  if (isStart) {
    return minimumDate;
  }
  return moment(minimumDate).add(step, 'minute');
};

const getMaxDate = (maximumDate: moment.Moment, step: number, isStart: boolean) => {
  if (isStart) {
    return moment(maximumDate).subtract(step, 'minute');
  }
  return maximumDate;
};

class SplittedTimePicker extends React.Component<IProps, IState> {
  state = {
    interval: 1,
  };

  static propTypes = {
    isLoading: PropTypes.bool,
    isStart: PropTypes.bool,
    onValueChange: PropTypes.func,
    step: PropTypes.number,
    expectedRanges: PropTypes.array,
    maximumDate: PropTypes.object,
    minimumDate: PropTypes.object,
    selectedValue: PropTypes.object,
  };

  componentDidMount() {
    this.setState({ interval: this.props.step });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ interval: newProps.step });
  }

  onValueChange = selectedValue => {
    const { onValueChange, expectedRanges, isStart, step } = this.props;
    const selectedValueMoment = moment(selectedValue);
    let forbidden = true;

    expectedRanges.forEach(expectedRange => {
      const minDate = getMinDate(expectedRange.minimumDate, step, isStart);
      const maxDate = getMaxDate(expectedRange.maximumDate, step, isStart);

      if (!forbidden) {
        return;
      }
      if (selectedValueMoment.isBetween(minDate, maxDate, null, '[]')) {
        forbidden = false;
      }
    });

    if (!forbidden) {
      return onValueChange(selectedValueMoment);
    }

    Alert.alert('You have chosen not available time');
    const nearestValue = expectedRanges && expectedRanges[0]
      && getMaxDate(expectedRanges[0].maximumDate, step, isStart);
    if (nearestValue) {
      return onValueChange(nearestValue);
    }
  };

  get minimumDate() {
    const { minimumDate, step, isStart } = this.props;
    return getMinDate(minimumDate, step, isStart);
  }

  get maximumDate() {
    const { maximumDate, step, isStart } = this.props;
    return getMaxDate(maximumDate, step, isStart);
  }

  render() {
    return this.props.isLoading ? (
      <View style={[styles.pickerContainer, styles.loadingStyle]}>
        <ActivityIndicator color={Colors.defaultGrey}/>
      </View>
    ) : (
      <View style={styles.pickerContainer}>
        <DatePicker
          style={styles.picker}
          minuteInterval={this.state.interval}
          maximumDate={this.maximumDate.toDate()}
          minimumDate={this.minimumDate.toDate()}
          mode="time"
          date={this.props.selectedValue && this.props.selectedValue.toDate()}
          onDateChange={this.onValueChange}
        />
      </View>
    );
  }
}

export default SplittedTimePicker;
