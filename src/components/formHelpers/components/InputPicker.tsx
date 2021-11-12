import * as React from 'react';
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
      selectedOption: props.defaultOption ? props.defaultOption : null,
      options: props.options,
    };
  }

  state = {
    options: null,
    selectedOption: null,
  }

  componentDidMount() {
    
    if (this.props.required) {
      this.validate(this.state.selectedOption, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedOption: nextProps.value ? nextProps.value : null, options: nextProps.options });

    if(nextProps.tooglePicker){
      this.pickerToogle();
    }
  }


  onChangeOption = (option) => {
    this.setState({ selectedOption: option });

    if (this.props.required) {
      this.validate(option, false);
    }

    this.props.onChange(option);
  }

  validate = (selectedOption, isFirstValidation = false) => {
    
    const isValid = selectedOption !== null && selectedOption !== undefined;
    this.props.onValidated(isValid, isFirstValidation);
  };

  pickerToogle = () => {
    this.setState(
      { selectedOption: this.state.selectedOption ? this.state.selectedOption : this.state.options[0] },
      () => {
        this.singlePicker.show();
      },
    );
  };

  render() {
    const labelStyle = this.props.required ? (this.props.isValid ? {} : { color: '#D1242A' }) : {};
    const noValueStyle = this.props.noValueStyle ? this.props.noValueStyle : {};
    const placeholder = this.props.placeholder !== undefined ? this.props.placeholder : 'Select';
    return (
      <React.Fragment>
        <InputButton
          labelStyle={labelStyle}
          icon={this.props.noIcon ? false : 'default'}
          label={this.props.label}
          value={this.state.selectedOption ? this.state.selectedOption.value : placeholder}
          valueStyle={this.state.selectedOption ? {} : noValueStyle}
          onPress={this.pickerToogle}
          style={styles.noPadding}
        />

        {this.state.selectedOption ?
          <SinglePicker
            buttonCancelStyle={{ color: 'transparent' }}
            buttonAcceptStyle={{
              color: '#0076FF', paddingRight: 10, fontSize: 14, fontWeight: '500',
            }}
            langs={{
              BTN_CONFIRM: 'Done',
              BTN_CANCEL: 'Cancel',
            }}
            // leftItem={<Icon name="chevronLeft" color="#D0021B" size={33} />}
            // rightItem={<Icon name="chevronRight" color="#D0021B" size={33} />}
            headerStyle={{ backgroundColor: '#FAFAF8', borderBottomColor: 'transparent' }}
            defaultSelectedValue={this.state && this.state.selectedOption && this.state.selectedOption.key || ''}
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
          : null}

      </React.Fragment>
    );
  }
}
