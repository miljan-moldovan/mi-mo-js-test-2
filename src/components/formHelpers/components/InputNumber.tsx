import * as React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles, InputLabel } from '../index';

export default class InputNumber extends React.Component {
  handleSubstractPress = () => {
    const min = this.props.min ? this.props.min : 0;
    const step = this.props.step || 1;
    if (this.props.value > min) {
      const value = this.props.value - step;
      this.props.onChange('subtract', value);
    }
  }

  handleAddPress = () => {
    const step = this.props.step || 1;
    if (this.props.max) {
      if (this.props.value < this.props.max) {
        const value = this.props.value + step;
        this.props.onChange('add', value);
      }
    } else {
      const value = this.props.value + step;
      this.props.onChange('add', value);
    }
  }

  renderCounterComponent = () => this.props.counterComponent(this.props.value)

  render() {
    const text = this.props.value > 1 ? this.props.pluralText : this.props.singularText;
    const valueText = `${this.props.value} ${text}`;
    const countComponent = 'label' in this.props ? (
      <InputLabel
        style={{ flex: 1 }}
        label={this.props.label}
        value={valueText}
      />
    ) : (
        <Text style={[styles.labelText, this.props.textStyle]}>{valueText}</Text>
      );

    return (
      <View style={[styles.inputRow, { justifyContent: 'space-between' }, this.props.style]}>
        {countComponent}
        <View style={[styles.inputNumber, this.props.inputNumberStyle]}>
          <TouchableOpacity
            style={[styles.inputNumberButton, {
              borderRightColor: '#1DBF12',
              borderRightWidth: 1,
            }]}
            onPress={this.handleSubstractPress}
          >
            <Text style={[styles.inputNumberLabelText]}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.inputNumberButton]}
            onPress={this.handleAddPress}
          >
            <Text style={[styles.inputNumberLabelText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
