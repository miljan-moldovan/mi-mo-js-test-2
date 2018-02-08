import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontFamily: 'OpenSans-Regular',
    color: '#1D1D2680',
    fontSize: 12,
    top: 10,
    position: 'absolute',
  },
  input: {
    flex: 1,
    color: '#1D1D26',
    fontSize: 18,
    marginTop: 20,
  },
});

const salonMaterialTextInput = props => (
  <View style={[styles.container, props.rootStyle]}>
    {props.title ? <Text style={[styles.title, props.titleStyle]}>{props.title}</Text> : null }
    <TextInput
      editable={props.editable}
      style={[styles.input, props.inputStyle]}
      value={props.value}
    />
  </View>
);

salonMaterialTextInput.propTypes = {
  rootStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  title: PropTypes.string,
  value: PropTypes.string,
  editable: PropTypes.bool,
};

salonMaterialTextInput.defaultProps = {
  rootStyle: null,
  titleStyle: null,
  inputStyle: null,
  title: null,
  value: '',
  editable: true,
};

export default salonMaterialTextInput;
