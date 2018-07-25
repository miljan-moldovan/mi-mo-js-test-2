import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import moment, { isMoment } from 'moment';
import { DatePicker } from 'react-native-wheel-datepicker';
import { InputButton } from '../index';

const SalonTimePicker = (props) => {
  const format = props.format || 'HH:mm A';
  const value = moment(props.value).isValid() ? moment(props.value).format(format) : props.placeholder || '-';
  return (
    <React.Fragment>
      <InputButton
        noIcon={props.noIcon}
        label={props.label}
        value={value}
        valueStyle={props.isOpen ? { color: '#1B65CF' } : null}
        onPress={props.toggle}
        style={{ paddingLeft: 0 }}
      />
      {props.isOpen && (
        <View style={{
          flexDirection: 'row',
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        >
          <DatePicker
            style={{ flex: 1 }}
            itemStyle={{ backgroundColor: 'white' }}
            date={moment(props.value).isValid() ? props.value.toDate() : new Date()}
            mode="time"
            onDateChange={props.onChange}
          />
        </View>
      )}
    </React.Fragment>
  );
};

export default SalonTimePicker;
