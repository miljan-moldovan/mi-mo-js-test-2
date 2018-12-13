import * as React from 'react';
import { connect } from 'react-redux';
import moment, { isMoment } from 'moment';
import PropTypes from 'prop-types';
import SplittedTimePicker from './SplittedTimePicker';
import storeActions from '../../../../redux/actions/store';
import { InputButton } from '../../index';
import rangeTimeSelector from '../../../../redux/selectors/rangeTimeSelector';
import styles from './style';

class SchedulePicker extends React.Component<any, any> {
  static propTypes = {
    value: PropTypes.string.isRequired,
    date: PropTypes.any,
    format: PropTypes.string,
    inline: PropTypes.bool,
    storeState: PropTypes.shape({
      isLoading: PropTypes.bool,
    }).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    schedule: PropTypes.arrayOf(PropTypes.object).isRequired,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    getSchedule: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    excludeLast: PropTypes.bool,
  };

  static defaultProps = {
    date: moment(),
    inline: false,
    label: '',
    format: 'hh:mm A',
    placeholder: '',
    excludeLast: true,
  };

  componentDidMount() {
    const { date, getSchedule } = this.props;
    getSchedule(moment(date).format('YYYY-MM-DD'));
  }

  componentWillReceiveProps(newProps) {
    const { date, getSchedule } = this.props;
    if (moment(date).format('YYYY-MM-DD') !== moment(newProps.date).format('YYYY-MM-DD')) {
      getSchedule(moment(newProps.date).format('YYYY-MM-DD'));
    }
  }

  onValueChange = selectedValue => {
    const momentObj = moment(selectedValue, this.format);
    this.props.onChange(momentObj);
  };

  get format() {
    const { format } = this.props;
    return format;
  }

  get selectedTimeString() {
    const { value } = this.props;
    const defValue = this.selectedTime;
    return isMoment(value) ? defValue.format(this.format) : '';
  }

  get selectedTime() {
    const { value } = this.props;
    const { minimumDate, maximumDate } = this.props.rangeTimes;
    const defValue = this.props.isStart ? minimumDate : maximumDate;
    return isMoment(value) ? value : defValue;
  }

  render() {
    const {
      label,
      toggle,
      inline,
      isOpen,
      placeholder,
      isStart,
      storeState: { isLoading },
      ...props
    } = this.props;

    return (
      <React.Fragment>
        {!inline && (
          <InputButton
            {...props}
            label={label}
            value={this.selectedTimeString}
            placeholder={placeholder}
            onPress={toggle}
            valueStyle={isOpen && styles.openDialog}
            style={styles.noPadding}
          />
        )}
        {(inline || isOpen) && (
          <SplittedTimePicker
            isStart={isStart}
            isLoading={isLoading}
            step={this.props.rangeTimes && this.props.rangeTimes.step}
            minimumDate={this.props.minimumDate || this.props.rangeTimes && this.props.rangeTimes.minimumDate}
            maximumDate={this.props.rangeTimes && this.props.rangeTimes.maximumDate}
            expectedRanges={this.props.rangeTimes && this.props.rangeTimes.expectedRanges}
            selectedValue={this.selectedTime}
            onValueChange={this.onValueChange}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  rangeTimes: rangeTimeSelector(state),
  storeState: state.storeReducer,
});
const mapDispatchToProps = dispatch => ({
  getSchedule: date => dispatch(storeActions.getScheduleForDate(date)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SchedulePicker);
