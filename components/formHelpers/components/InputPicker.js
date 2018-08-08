import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import SinglePicker from 'mkp-react-native-picker';
import { InputButton } from '../index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noPadding: { paddingLeft: 0 },
});

export default class InputPicker extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      selectedOption: props.defaultOption ? props.defaultOption : props.options[0],
      options: props.options,
    };
  }

  state = {
    options: [{ key: -1, value: 'NULL' }],
    selectedOption: { key: -1, value: 'NULL' },
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedOption: nextProps.value ? nextProps.value : null });// nextProps.options[0]
  }

  pickerToogle = () => {
    this.setState(
      { selectedOption: this.state.options[0] },
      () => {
        this.singlePicker.show();
      },
    );
  };

  onChangeOption = (option) => {
    this.setState({ selectedOption: option });
    this.props.onChange(option);
  }

  render() {
    return (
      <React.Fragment>
        <InputButton
          noIcon={this.props.noIcon}
          label={this.props.label}
          value={this.state.selectedOption ? this.state.selectedOption.value : 'Select'}
          onPress={this.pickerToogle}
          style={styles.noPadding}
        />

        {this.state.selectedOption ?
          <SinglePicker
            buttonCancelStyle={{ color: 'transparent' }}
            buttonAcceptStyle={{ color: '#D0021B', paddingRight: 10, fontSize: 14 }}
            langs={{
              BTN_CONFIRM: 'Done',
              BTN_CANCEL: 'Cancel',
          }}
          // leftItem={<Icon name="chevronLeft" color="#D0021B" size={33} />}
          // rightItem={<Icon name="chevronRight" color="#D0021B" size={33} />}
            headerStyle={{ backgroundColor: '#FAFAF8', borderBottomColor: 'transparent' }}
            defaultSelectedValue={this.state.selectedOption.key}
            style={{ justifyContent: 'flex-end', backgroundColor: '#FFF' }}
            lang="en-US"
            ref={ref => this.singlePicker = ref}
            onConfirm={(option) => {
            if (option) {
              this.onChangeOption(option);
            }
          }}
            options={this.state.options}
          />
        : null }

      </React.Fragment>
    );
  }
}
