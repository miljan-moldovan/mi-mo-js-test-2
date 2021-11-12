import * as React from 'react';
import { Picker } from 'react-native-wheel-datepicker';
import { InputButton } from '../../index';
import styles from './style';

export interface SalonPickerProps {
  inline?: boolean;
  isOpen: boolean;
  label: string | React.ReactNode;
  placeholder?: string | React.ReactNode;
  selectedValue: string | number;
  pickerData: any[];
  toggle: () => void;
  onChange: (value: string | number, index: number) => void;
}

class SalonPicker extends React.PureComponent<SalonPickerProps> {
  onChange = (value: string | number) => {
    const {
      onChange,
      pickerData,
    } = this.props;
    const index = pickerData.findIndex((item, index) => value === item);
    onChange(value, index);
  }

  render() {
    const {
      label,
      toggle,
      inline,
      isOpen,
      placeholder,
      pickerData,
      selectedValue,
      ...props
    } = this.props;
    return (
      <React.Fragment>
        {!inline && (
          <InputButton
            {...props}
            label={label}
            value={selectedValue}
            placeholder={placeholder}
            onPress={toggle}
            valueStyle={isOpen && styles.openDialog}
            style={styles.noPadding}
          />
        )}
        {(inline || isOpen) && (
          <Picker
            style={styles.picker}
            pickerData={pickerData}
            selectedValue={selectedValue}
            onValueChange={this.onChange}
          />
        )}
      </React.Fragment>
    );
  }
}
export default SalonPicker;
