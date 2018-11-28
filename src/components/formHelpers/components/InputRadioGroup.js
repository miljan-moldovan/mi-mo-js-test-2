import React from 'react';
import {
  Text,
} from 'react-native';
import Icon from '@/components/common/Icon';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles, InputDivider } from '../index';

export default class InputRadioGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: props.defaultOption,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedOption: nextProps.defaultOption });
  }

  state = {
    selectedOption: null,
  }

  onPress = (option, index) => {
    this.setState({ selectedOption: option });
    this.props.onPress(option, index);
  }

  renderOption = (option, index, length) => {
    const isLastOne = length === index + 1;
    const selected = this.state.selectedOption && this.state.selectedOption.id === option.id;
    return (
      <React.Fragment key={index}>
        <SalonTouchableOpacity
          key={index}
          style={[styles.inputRow, { justifyContent: 'space-between' }]}
          onPress={() => { this.onPress(option, index); }}
        >
          { option.name && typeof option.name === 'string'
        ? (
          <Text style={[styles.labelText, { color: '#110A24' }]}>{option.name}</Text>
        ) : this.props.renderOption(option) }
          {selected ?
            <Icon
              name="checkCircle"
              type="solid"
              size={14}
              color="#2BBA11"
            /> :
            null
        }
        </SalonTouchableOpacity>
        {!isLastOne ? <InputDivider /> : null}
      </React.Fragment>);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.options.map((option, index) => this.renderOption(option, index, this.props.options.length))}
      </React.Fragment>
    );
  }
}
