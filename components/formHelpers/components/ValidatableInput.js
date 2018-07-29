import React from 'react';
import { isRegExp } from 'lodash';
import { LabeledTextInput } from '../index';

const ValidatableInput = (props) => {
  const onChangeText = (text) => {
    if (isRegExp(props.regex)) {
      if (props.regex.test(text)) {
        props.onValidated();
      }
    }
    return props.onChangeText(text);
  };
  return (
    <LabeledTextInput
      {...props}
      onChangeText={onChangeText}
    />
  );
};
export default ValidatableInput;
