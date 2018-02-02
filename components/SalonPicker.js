import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Picker from 'react-native-picker';
import PropTypes from 'prop-types';

function showPicker(props) {
  Picker.init({
    pickerData: props.dataSource,
    selectedValue: [props.selectedValue],
    pickerTitleText: props.pickerTitle,
    pickerFontSize: props.pickerFontSize ? props.pickerFontSize : 18,
    pickerToolBarFontSize: props.pickerToolBarFontSize ? props.pickerToolBarFontSize : 18,
    onPickerConfirm: (pickedValue) => {
      props.onPickerConfirm(pickedValue);
    },
  });
  Picker.show();
}

const salonPicker = props => (
  <TouchableOpacity onPress={() => showPicker({
    dataSource: props.dataSource,
    selectedValue: props.selectedValue,
    pickerTitle: props.pickerTitle,
    pickerFontSize: props.pickerFontSize,
    pickerToolBarFontSize: props.pickerToolBarFontSize,
    onPickerConfirm: props.onPickerConfirm,
  })}
  >
    <View>
      {props.title ? <Text>{props.title}</Text> : null }
      <Text>{props.selectedValue}</Text>
    </View>
  </TouchableOpacity>
);

salonPicker.propTypes = {
  dataSource: PropTypes.arrayOfType([PropTypes.number, PropTypes.string]).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  pickerTitle: PropTypes.string,
  pickerFontSize: PropTypes.number,
  pickerToolBarFontSize: PropTypes.number,
  onPickerConfirm: PropTypes.func.isRequired,
};

salonPicker.defaultProps = {
  title: '',
  pickerTitle: '',
  pickerFontSize: 18,
  pickerToolBarFontSize: 18,
};

export default salonPicker;
