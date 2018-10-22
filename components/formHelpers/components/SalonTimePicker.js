import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import moment, { isMoment } from 'moment';
import { Picker, DatePicker } from 'react-native-wheel-datepicker';
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
  whiteBg: { backgroundColor: 'white' },
});

class SalonTimePicker extends React.Component {
  componentDidMount() {
    if (this.props.required) {
      this.validate(this.props.selectedDate, true);
    }
  }

  onPressDatePicker = (selectedDate) => {
    if (this.props.required) {
      this.validate(selectedDate, false);
    }
    this.props.onChange(selectedDate);
  }


  validate = (selectedDate, isFirstValidation = false) => {
    const isValid = moment(selectedDate).isValid();
    this.props.onValidated(isValid, isFirstValidation);
  };

  render() {
    const labelStyle = this.props.required ? (this.props.isValid ? {} : { color: '#D1242A' }) : {};
    const format = this.props.format || 'HH:mm A';
    const value = moment(this.props.value).isValid() ? moment(this.props.value).format(format) : this.props.placeholder || '-';
    const date = moment(this.props.value).isValid() ? moment(this.props.value).toDate() : new Date();
    const valueStyle = this.props.isOpen ? { color: '#1B65CF' } : this.props.valueStyle || null;
    const icon = this.props.icon || 'default';
    return (
      <React.Fragment>
        <InputButton
          labelStyle={labelStyle}
          icon={this.props.noIcon ? false : icon}
          label={this.props.label}
          value={value}
          valueStyle={valueStyle}
          onPress={this.props.toggle}
          style={styles.noPadding}
        />
        {this.props.isOpen && (
        <View style={styles.pickerContainer}>
          <DatePicker
            style={styles.container}
            itemStyle={styles.whiteBg}
            date={date}
            mode={this.props.mode || 'time'}
            onDateChange={this.onPressDatePicker}
            minimumDate={this.props.minimumDate || null}
          />
        </View>
      )}
      </React.Fragment>
    );
  }
}
export default SalonTimePicker;
