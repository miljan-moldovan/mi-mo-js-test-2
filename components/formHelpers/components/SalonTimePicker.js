import React from 'react';
import {
  View,
  Text,
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

const SalonTimePicker = (props) => {
  const format = props.format || 'HH:mm A';
  const value = moment(props.value).isValid() ? moment(props.value).format(format) : props.placeholder || '-';
  const dateObject = moment(props.value).isValid() ? moment(props.value).toDate() : new Date();
  const valueStyle = props.isOpen ? { color: '#1B65CF' } : null;
  return (
    <React.Fragment>
      <InputButton
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
            onDateChange={props.onChange}
          />
        </View>
      )}
    </React.Fragment>
  );
};

export default SalonTimePicker;
