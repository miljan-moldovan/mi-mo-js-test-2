import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    borderRadius: 4,
    height: 26,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  btnLast: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  // textSelected: {
  //   color: '#fff',
  // },
  // selected: {
  //   backgroundColor: '#67A3C7',
  // },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#1D1D2680',
    marginBottom: 5,
  },
});

function renderBtn(
  data, index, isSelected, isLast, onItemPress,
  disabled, selectedColor, selectedTextColor, unSelectedTextColor,
) {
  let btnStyle = styles.btn;
  let textStyle = styles.text;
  if (isLast) {
    btnStyle = styles.btnLast;
  }

  if (isSelected) {
    btnStyle = [btnStyle, { backgroundColor: selectedColor, borderColor: selectedColor }];
    textStyle = [textStyle, { color: selectedTextColor }];
  } else {
    textStyle = [textStyle, { color: unSelectedTextColor }];
    btnStyle = [btnStyle, { borderColor: 'transparent' }];
  }


  return (
    <TouchableOpacity
      style={btnStyle}
      key={`${data}${index}`}
      onPress={ev => onItemPress(ev, index)}
      disabled={disabled}
    >
      <View style={styles.textContainer}>
        <Text style={textStyle}>
          {data}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const salonFlatPicker = props => (
  <View style={[styles.container, props.rootStyle]}>
    {props.title ? <Text style={styles.titleStyle}>{props.title}</Text> : null }
    <View style={[styles.pickerContainer, props.containerStyle, { borderColor: props.selectedColor }]}>
      {props.dataSource.map((data, index) =>
        renderBtn(
          data, index, index === props.selectedIndex,
          index === props.dataSource.length - 1, props.onItemPress,
          props.disabled,
          props.selectedColor,
          props.selectedTextColor,
          props.unSelectedTextColor,
        ))}
    </View>
  </View>
);

salonFlatPicker.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIndex: PropTypes.number,
  onItemPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  selectedColor: PropTypes.string,
  selectedTextColor: PropTypes.string,
  unSelectedTextColor: PropTypes.string,
};

salonFlatPicker.defaultProps = {
  selectedIndex: 0,
  title: null,
  disabled: false,
  selectedColor: '#67A3C7',
  selectedTextColor: '#fff',
  unSelectedTextColor: '#67A3C7',
};

export default salonFlatPicker;
