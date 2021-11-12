import * as React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment, { isMoment } from 'moment';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Picker } from 'react-native-wheel-datepicker';

import Colors from '../../../constants/Colors';
import scheduleActions from '../../../redux/actions/schedule';
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

class ProviderSchedulePicker extends React.Component {
  componentDidMount() {
    const { date, employee, scheduleActions } = this.props;
    scheduleActions.getEmployeeScheduleForDate(
      get(employee, 'id', null),
      moment(date).format('YYYY-MM-DD')
    );
  }

  componentWillReceiveProps(newProps) {
    const { date, employee, scheduleActions } = this.props;
    if (!date || !employee || !newProps.date || !newProps.employee) {
      return;
    }
    if (
      date !== newProps.date ||
      employee.id !== get(newProps.employee, 'id')
    ) {
      scheduleActions.getEmployeeScheduleForDate(
        get(newProps.employee, 'id', null),
        moment(newProps.date).format('YYYY-MM-DD')
      );
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

  get pickerData() {
    const {
      date,
      employee,
      excludeLast,
      scheduleState: { schedules },
    } = this.props;
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
    const { scheduleState: { isLoading } } = this.props;
    const loadingStyle = { height: 100 };
    return isLoading
      ? <View style={[styles.pickerContainer, loadingStyle]}>
        <ActivityIndicator color={Colors.defaultGrey} />
      </View>
      : <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          pickerData={this.pickerData}
          selectedValue={this.selectedTime}
          onValueChange={this.onValueChange}
        />
      </View>;
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
    return inline
      ? this.renderPicker()
      : <React.Fragment>
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
      </React.Fragment>;
  }
}
// ProviderSchedulePicker.propTypes = {
//   value: PropTypes.string.isRequired,
//   date: PropTypes.any,
//   format: PropTypes.string,
//   inline: PropTypes.bool,
//   scheduleState: PropTypes.shape({
//     schedules: PropTypes.array,
//     isLoading: PropTypes.bool,
//   }).isRequired,
//   label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
//   isOpen: PropTypes.bool.isRequired,
//   toggle: PropTypes.func.isRequired,
//   schedule: PropTypes.arrayOf(PropTypes.object).isRequired,
//   placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
//   getSchedule: PropTypes.func.isRequired,
//   onChange: PropTypes.func.isRequired,
//   excludeLast: PropTypes.bool,
// };
// ProviderSchedulePicker.defaultProps = {
//   date: moment(),
//   inline: false,
//   label: '',
//   format: 'hh:mm A',
//   placeholder: '',
//   excludeLast: true,
// };

const mapStateToProps = state => ({
  scheduleState: state.scheduleState,
});
const mapDispatchToProps = dispatch => ({
  scheduleActions: bindActionCreators({ ...scheduleActions }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(
  ProviderSchedulePicker
);
