import * as React from 'react';
import PropTypes from 'prop-types';
import { isRegExp, isFunction } from 'lodash';
import { LabeledTextInput } from '../index';

class ValidatableInput extends React.Component {
  componentDidMount() {
    this.validate(this.props.value, true);
  }

  onChangeText = (text) => {
    // if (this.props.validateOnChange) {
    //   this.validate(text);
    // }
    return this.props.onChangeText(text);
  };

  validate = (text, isFirstValidation = false) => {
    let isValid = false;
    if (isRegExp(this.props.validation)) {
      isValid = this.props.validation.test(text);
    } else if (isFunction(this.props.validation)) {
      isValid = this.props.validation(text);
    }
    this.props.onValidated(isValid, isFirstValidation);
  };

  render() {
    const labelStyle = this.props.isValid ? {} : { color: '#D1242A' };
    return (
      <LabeledTextInput
        {...this.props}
        labelStyle={labelStyle}
        onBlur={() => this.validate(this.props.value)}
        onChangeText={this.onChangeText}
      />
    );
  }
}
ValidatableInput.propTypes = {
  isValid: PropTypes.bool.isRequired,
  onValidated: PropTypes.func.isRequired,
  validation: PropTypes.oneOfType([PropTypes.func, RegExp]).isRequired,
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  validateOnChange: PropTypes.bool,
};
ValidatableInput.defaultProps = {
  validateOnChange: false,
};
export default ValidatableInput;
