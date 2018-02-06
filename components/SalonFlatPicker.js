import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    borderRadius: 4,
    height: 30,
    borderColor: '#67A3C7',
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    borderColor: '#67A3C7',
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
    fontFamily: 'OpenSans-Regular',
    color: '#3078A4',
  },
  textSelected: {
    color: '#fff',
  },
  selected: {
    backgroundColor: '#67A3C7',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#1D1D2680',
    marginBottom: 5,
  },
});

function renderBtn(data, index, isSelected, isLast, onItemPress, disabled) {
  let btnStyle = styles.btn;
  let textStyle = styles.text;
  if (isLast) {
    btnStyle = styles.btnLast;
  }

  if (isSelected) {
    btnStyle = [btnStyle, styles.selected];
    textStyle = [textStyle, styles.textSelected];
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
  <View style={styles.container}>
    {props.title ? <Text style={styles.titleStyle}>{props.title}</Text> : null }
    <View style={styles.pickerContainer}>
      {props.dataSource.map((data, index) =>
        renderBtn(
          data, index, index === props.selectedIndex,
          index === props.dataSource.length - 1, props.onItemPress,
          props.disabled,
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
};

salonFlatPicker.defaultProps = {
  selectedIndex: 0,
  title: null,
  disabled: false,
};

export default salonFlatPicker;
