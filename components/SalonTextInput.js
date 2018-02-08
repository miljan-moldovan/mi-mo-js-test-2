
import React, { Component } from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';

class SalonTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { placeholder: props.text.length === 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.setState({ placeholder: ev.nativeEvent.text.length === 0 });
    if (this.props.onChange) {
      this.props.onChange(ev);
    }
  }

  render() {
    const {
      placeholderStyle,
      style,
      onChange,
      ...rest
    } = this.props;

    return (
      <TextInput
        {...rest}
        onChange={this.handleChange}
        style={this.state.placeholder ? [style, placeholderStyle] : style}
      />
    );
  }
}

SalonTextInput.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  placeholderStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

SalonTextInput.defaultProps = {
  style: null,
  placeholderStyle: null,
};

export default SalonTextInput;
