import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ViewPropTypes,
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
    borderTopWidth: 1 / 2,
    borderBottomWidth: 1 / 2,
    borderTopColor: '#C0C1C6',
    borderBottomColor: '#C0C1C6',
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingLeft: 16,
    justifyContent: 'flex-start',
  },
  inputRow: {
    height: 44,
    paddingRight: 16,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    minHeight: 60,
    paddingVertical: 12,
    paddingTop: 12,
    paddingRight: 16,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto',
    marginLeft: 16,
    marginTop: 7,
  },
  dateCancelButtonStyle: {
    width: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateCancelStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const SectionTitle = props => (
  <View style={[{ height: 38, flexDirection: 'column', justifyContent: 'center' }, props.style]} >
    <Text style={styles.sectionTitle}>{props.value.toUpperCase()}</Text>
  </View>
);
SectionTitle.propTypes = {
  value: PropTypes.string.isRequired,
};

export const SectionDivider = props => (
  <View style={[{ height: 35 }, props.style]} />
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
  <TouchableOpacity onPress={props.onPress} style={props.style}>
    <View style={{ alignSelf: 'stretch' }}>
      <View style={styles.inputRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            { props.placeholder && (
              <Text style={styles.labelText}>{props.placeholder}</Text>
            )}
            {
              typeof props.value === 'string'
              ? (
                <Text style={styles.inputText}>{props.value}</Text>
              ) :
                props.value
            }

          </View>
          {props.children}
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
  style: ViewPropTypes.style,
  placeholder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  noIcon: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
};
InputButton.defaultProps = {
  style: {},
  placeholder: false,
  value: false,
  noIcon: false,
  children: [],
};

export const InputLabel = props => (
  <View style={[styles.inputRow, { flexDirection: 'row', alignSelf: 'stretch' }]}>
    <Text style={[styles.labelText, { alignSelf: 'flex-start' }]}>{props.label}</Text>
    <Text style={[styles.inputText, { alignSelf: 'flex-end' }]}>{props.value}</Text>
  </View>
);
InputLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export const LabeledButton = props => (
  <InputButton
    style={{ alignSelf: 'stretch' }}
    onPress={props.onPress}
  >
    <InputLabel
      label={props.label}
      value={props.value}
    />
  </InputButton>
);
LabeledButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onPress: PropTypes.func.isRequired,
};

export const InputText = props => (
  <View style={{}}>
    <TextInput
      {...props}
      style={styles.textArea}
      multiline
      autoGrow
      numberOfLines={2}
      placeholderTextColor="#727A8F"
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
      <View style={{ flexDirection: 'row' }}>
        <SalonDatePicker
          isVisible={this.state.showModal}
          onPress={(selectedDate) => {
            this.setState({ showModal: false });
            this.props.onPress(selectedDate);
          }}
          selectedDate={this.props.selectedDate}
        />
        <InputButton
          style={{ width: '90%' }}
          onPress={() => {
            this.setState({ showModal: !this.state.showModal });
          }}
          noIcon
          placeholder={this.props.placeholder}
          value={this.props.selectedDate}
        />
        <TouchableOpacity
          onPress={() => {
            this.props.onPress(null);
          }}
          style={styles.dateCancelButtonStyle}
        >
          <View style={styles.dateCancelStyle}>
            <FontAwesome style={[styles.iconStyle, { marginLeft: 0 }]}>{Icons.timesCircle}</FontAwesome>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export class InputSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  render() {
    return (
      <View style={[styles.inputRow, { justifyContent: 'space-between' }, this.props.style]}>
        <Text style={[styles.labelText, this.props.textStyle]}>{this.props.text}</Text>

        <Switch
          onChange={() => { this.setState({ value: !this.state.value }); this.props.onChange(this.state.value); }}
          value={this.state.value}
        />
      </View>
    );
  }
}
