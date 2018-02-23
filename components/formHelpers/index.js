import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonDateTxt from '../../components/SalonDateTxt';
import SalonDatePicker from '../../components/modals/SalonDatePicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#C0C1C6',
    borderBottomColor: '#C0C1C6',
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingLeft: 16,
  },
  inputRow: {
    height: 44,
    paddingRight: 16,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputDivider: {
    height: 1,
    backgroundColor: '#C0C1C6',
    alignSelf: 'stretch',
  },
  labelText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Regular',
  },
  inputText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#110A24',
    fontFamily: 'Roboto-Medium',

  },
  iconStyle: {
    fontSize: 20,
    color: '#727A8F',
    marginLeft: 10,
  },
  textArea: {
    height: 60,
    paddingVertical: 12,
    paddingTop: 12,
    paddingRight: 16,
  },
});

export const SectionDivider = () => (
  <View style={{ height: 35 }} />
);

export const InputDivider = () => (
  <View style={styles.inputDivider} />
);

export const InputGroup = props => (
  <View style={[styles.inputGroup, props.style]}>
    {props.children}
  </View>
);
InputGroup.propTypes = {
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  children: PropTypes.arrayOf(PropTypes.element),
};
InputGroup.defaultProps = {
  style: false,
  children: null,
};

export const InputButton = props => (
  <TouchableOpacity onPress={props.onPress}>
    <View style={{ alignSelf: 'stretch' }}>
      <View style={styles.inputRow}>
        <Text style={styles.labelText}>{props.placeholder}</Text>
        <View style={{ flexDirection: 'row' }}>
          {props.value && (
            <Text style={styles.inputText}>{props.value}</Text>
          )}
          {!props.noIcon && (
            <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
InputButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  noIcon: PropTypes.bool,
};
InputButton.defaultProps = {
  placeholder: '',
  value: false,
  noIcon: false,
};

export const InputText = props => (
  <View style={{}}>
    <TextInput
      {...props}
      style={styles.textArea}
      multiline
      numberOfLines={2}
      placeholderTextColor="#727A8F"
      maxHeight={60}
      placeholder={props.placeholder}
    />
  </View>
);

export class InputDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  render() {
    return (
      <View>
        <SalonDatePicker
          isVisible={this.state.showModal}
          onPress={(selectedDate) => {
            this.setState({ showModal: false });
            this.props.onPress(selectedDate);
          }}
          selectedDate={this.props.selectedDate}
        />
        <InputButton
          onPress={() => {
            this.setState({ showModal: !this.state.showModal });
          }}
          noIcon
          placeholder={this.props.placeholder}
          value={this.props.selectedDate}
        />
      </View>
    );
  }
}
