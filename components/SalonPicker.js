import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Picker from 'react-native-picker';
import PropTypes from 'prop-types';

import SalonTouchableOpacity from './SalonTouchableOpacity';


import arrow from '../assets/images/newClient/icon_arrow_right_xs.png';

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pickerText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D26',
  },
  title: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D2680',
    top: 10,
    position: 'absolute',
  },

});

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
  <SalonTouchableOpacity
    disabled={props.disabled}
    onPress={() => showPicker({
      dataSource: props.dataSource,
      selectedValue: props.selectedValue,
      pickerTitle: props.pickerTitle,
      pickerFontSize: props.pickerFontSize,
      pickerToolBarFontSize: props.pickerToolBarFontSize,
      onPickerConfirm: props.onPickerConfirm,
    })}
    style={styles.btnContainer}
  >
    <View style={styles.container}>
      {props.title ? <Text style={styles.title}>{props.title}</Text> : null }
      <View style={styles.textContainer}>
        <Text style={styles.pickerText}>{props.selectedValue}</Text>
        <Image style={styles.image} source={arrow} />
      </View>
    </View>
  </SalonTouchableOpacity>
);

salonPicker.propTypes = {
  dataSource: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.string)]).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  pickerTitle: PropTypes.string,
  pickerFontSize: PropTypes.number,
  pickerToolBarFontSize: PropTypes.number,
  onPickerConfirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

salonPicker.defaultProps = {
  title: '',
  pickerTitle: '',
  pickerFontSize: 18,
  pickerToolBarFontSize: 18,
  disabled: false,
};

export default salonPicker;
