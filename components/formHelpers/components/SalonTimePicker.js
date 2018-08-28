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

const convertLocalDateToUTCDate = (dateString, toUTC) => {
  let date = new Date(dateString);
  // Local time converted to UTC
  const localOffset = date.getTimezoneOffset() * 60000;
  const localTime = date.getTime();
  if (toUTC) {
    date = localTime + localOffset;
  } else {
    date = localTime - localOffset;
  }
  date = new Date(date);
  return date;
};

const SalonTimePicker = (props) => {
  const format = props.format || 'HH:mm A';
  const value = moment(props.value).isValid() ? moment(props.value).format(format) : props.placeholder || '-';
  let date = moment(props.value).isValid() ? props.value : new Date().toString();
  date = convertLocalDateToUTCDate(date, false);
  const dateObject = new Date(date);

  const valueStyle = props.isOpen ? { color: '#1B65CF' } : null;
  return (
    <React.Fragment>
      <InputButton
        noIcon={props.noIcon}
        label={props.label}
        value={value}
        valueStyle={valueStyle}
        onPress={props.toggle}
        style={styles.noPadding}
      />
      {props.isOpen && (
        <View style={styles.pickerContainer}>
          <DatePicker
            style={styles.container}
            itemStyle={styles.whiteBg}
            date={dateObject}
            mode={props.mode || 'time'}
            onDateChange={(date) => { props.onChange(convertLocalDateToUTCDate(date, true)); }}
          />
        </View>
      )}
    </React.Fragment>
  );
};

export default SalonTimePicker;
