import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import moment, { isMoment } from 'moment';
import PropTypes from 'prop-types';
import { Picker } from 'react-native-wheel-datepicker';

import chunkedScheduleSelector from '../../../redux/selectors/chunkedScheduleSelector';
import Colors from '../../../constants/Colors';
import storeActions from '../../../actions/store';
import { InputButton } from '../index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPadding: { paddingLeft: 0 },
  pickerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    backgroundColor: 'white',
  },
  pickerItem: {
    backgroundColor: 'white',
  },
});

class SchedulePicker extends React.Component {
  componentDidMount() {
    const {
      date,
      getSchedule,
    } = this.props;
    getSchedule(moment(date).format('YYYY-MM-DD'));
  }

  componentWillReceiveProps(newProps) {
    const {
      date,
      getSchedule,
    } = this.props;
    if (date !== newProps.date) {
      getSchedule(moment(newProps.date).format('YYYY-MM-DD'));
    }
  }

  onValueChange = (selectedValue) => {
    const momentObj = moment(selectedValue, this.format);
    this.props.onChange(momentObj);
  }

  get format() {
    const { format } = this.props;
    return format;
  }

  get pickerData() {
    const { excludeLast, schedule } = this.props;
    const pickerData = [...schedule];
    if (excludeLast) {
      pickerData.pop();
    }
    return pickerData.map(time => time.format(this.format));
  }

  get selectedTime() {
    const { value } = this.props;
    return isMoment(value) ? value.format(this.format) : '';
  }

  renderPicker = () => {
    const { storeState: { isLoading } } = this.props;
    const loadingStyle = { height: 100 };
    return isLoading ?
      (
        <View style={[styles.pickerContainer, loadingStyle]}>
          <ActivityIndicator color={Colors.defaultGrey} />
        </View>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            pickerData={this.pickerData}
            selectedValue={this.selectedTime}
            onValueChange={this.onValueChange}
          />
        </View>
      );
  };

  render() {
    const {
      label,
      toggle,
      inline,
      isOpen,
      schedule,
      placeholder,
      ...props
    } = this.props;
    const valueStyle = isOpen ? { color: Colors.secondaryLightBlue } : null;
    return inline ? this.renderPicker() : (
      <React.Fragment>
        <InputButton
          {...props}
          label={label}
          value={this.selectedTime}
          placeholder={placeholder}
          onPress={toggle}
          valueStyle={valueStyle}
          style={styles.noPadding}
        />
        {isOpen ? this.renderPicker() : null}
      </React.Fragment>
    );
  }
}
SchedulePicker.propTypes = {
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
SchedulePicker.defaultProps = {
  date: moment(),
  inline: false,
  label: '',
  format: 'hh:mm A',
  placeholder: '',
  excludeLast: true,
};

const mapStateToProps = state => ({
  schedule: chunkedScheduleSelector(state),
  storeState: state.storeReducer,
});
const mapDispatchToProps = dispatch => ({
  getSchedule: date => dispatch(storeActions.getScheduleForDate(date)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePicker);
