import * as React from 'react';
import {
  TextInput,
  View,
  Keyboard
} from 'react-native';

import { styles } from '../index';

export default class InputText extends React.Component<any, any> {


  static defaultProps = {
    autoFocus: false,
    isEditable: true,
    multiline: false,
    placeholder: '',
  };


  constructor(props) {
    super(props);
  }
  input;

  state = {
    editable: true,
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ editable: 'isEditable' in nextProps ? nextProps.isEditable : true });
  }

  componentWillUpdate(nextProps) {

  
    if (nextProps.autoFocus) {
      if (nextProps.isEditable) {
        if (this.input && !this.input.isFocused()) {
          this.input.focus();
        }
      } else {
        this.input.blur();
      }
    }
  }


  onSubmitEditing = () => {
    if (!this.props.multiline) {
      this.input.blur();
    }
  }

  render() {
    return (
      <View pointerEvents={this.state.editable ? 'auto' : 'none'}>
        <TextInput
          ref={(input) => { this.input = input; }}
          {...this.props}
          style={styles.textArea}
          onSubmitEditing={this.onSubmitEditing}
          multiline={this.props.multiline}
          autoGrow
          numberOfLines={2}
          placeholderTextColor="#727A8F"
          placeholder={this.props.placeholder}
        />
      </View>
    );
  }
}
