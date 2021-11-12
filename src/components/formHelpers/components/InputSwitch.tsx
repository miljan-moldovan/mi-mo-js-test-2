import * as React from 'react';
import {
  Text,
  View,
  Switch,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../index';

export default class InputSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  render() {
    return (
      <View style={[styles.inputRow, { justifyContent: 'space-between' }, this.props.style]}>
        {!this.props.textRight ?
          (this.props.text && typeof this.props.text === 'string'
            ? (
              <Text style={[styles.labelText, this.props.textStyle]}>{this.props.text}</Text>
            ) : this.props.text)
          : null}
        <Switch
          onChange={() => { this.setState({ value: !this.state.value }); this.props.onChange(this.state.value); }}
          value={this.state.value}
          style={this.props.switchStyle}
        />

        {this.props.textRight ?
          (this.props.text && typeof this.props.text === 'string'
            ? (
              <Text style={[styles.labelText, this.props.textStyle]}>{this.props.text}</Text>
            ) : this.props.text)
          : null}
      </View>
    );
  }
}
