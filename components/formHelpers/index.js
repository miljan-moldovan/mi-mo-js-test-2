import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  ActivityIndicator,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import ClientInput from './components/ClientInput';
import InputDate from './components/InputDate';
import InputNumber from './components/InputNumber';
import InputSwitch from './components/InputSwitch';
import ServiceInput from './components/ServiceInput';
import ProviderInput from './components/ProviderInput';
import PromotionInput from './components/PromotionInput';
import ProductInput from './components/ProductInput';

import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C0C1C6',
    borderBottomColor: '#C0C1C6',
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingLeft: 16,
    justifyContent: 'flex-start',
  },
  inputRow: {
    height: 43.5,
    paddingRight: 16,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  inputDivider: {
    height: StyleSheet.hairlineWidth,
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
    lineHeight: 43,
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
  providerRound: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginRight: 10,
  },
  inputNumber: {
    borderColor: '#1DBF12',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 101,
    height: 28,
    borderRadius: 5,
  },
  inputNumberButton: {
    width: 50,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputNumberLabelText: {
    fontSize: 32,
    color: '#1DBF12',
    fontFamily: 'Roboto-Light',
    lineHeight: 40,
  },
  avatarDefaultComponent: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#115ECD',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDefaultComponentText: {
    fontSize: 10,
    color: '#115ECD',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});


const DefaultAvatar = props => (
  <View style={styles.avatarDefaultComponent}>
    <Text style={styles.avatarDefaultComponentText}>
      {
        props.provider && !props.provider.isFirstAvailable
        ? `${props.provider.name[0]}${props.provider.lastName[0]}`
        : 'FA'
      }
    </Text>
  </View>
);

const RemoveButton = ({ title, onPress }) => (
  <SalonTouchableOpacity
    style={{
        height: 44,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
      }}
    onPress={onPress}
  >
    <Text style={{
        fontSize: 14,
        lineHeight: 22,
        color: '#D1242A',
        fontFamily: 'Roboto-Medium',
      }}
    >{title}
    </Text>
  </SalonTouchableOpacity>
);

const SectionTitle = props => (
  <View style={[{ height: 38, flexDirection: 'column', justifyContent: 'center' }, props.style]} >
    <Text style={[styles.sectionTitle, props.sectionTitleStyle]}>{props.case === 'upper' ? props.value.toUpperCase() : (props.case === 'lower' ? props.value.toLowerCase() : props.value)}</Text>
  </View>
);
SectionTitle.propTypes = {
  value: PropTypes.string.isRequired,
  case: PropTypes.string,
};

SectionTitle.defaultProps = {
  case: 'upper',
};

const SectionDivider = props => (
  <View style={[{ height: 38 }, props.style]} />
);

SectionDivider.propTypes = {
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

SectionDivider.defaultProps = {
  style: false,
};

const InputDivider = props => (
  <View style={[styles.inputDivider, props.style]} />
);

InputDivider.propTypes = {
  style: ViewPropTypes.style,
};

InputDivider.defaultProps = {
  style: false,
};

const InputGroup = props => (
  <View style={[styles.inputGroup, props.style]}>
    {props.children}
  </View>
);
InputGroup.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.node,
};
InputGroup.defaultProps = {
  style: false,
  children: [],
};

const InputButton = props => (
  <SalonTouchableOpacity
    style={[styles.inputRow, { justifyContent: 'center' }, props.style]}
    onPress={props.onPress}
  >
    { props.label && typeof props.label === 'string'
    ? (
      <Text style={[styles.labelText, props.labelStyle]}>{props.label}</Text>
    ) : props.label }
    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
      {
        typeof props.value === 'string'
        ? (
          <Text numberOfLines={1} style={[styles.inputText, props.valueStyle]}>{props.value}</Text>
        ) :
          props.value
      }
      {props.children}
    </View>
    {!props.noIcon && (
      <FontAwesome style={[styles.iconStyle, props.iconStyle]}>{Icons.angleRight}</FontAwesome>
    )}
  </SalonTouchableOpacity>
);
InputButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
  valueStyle: Text.propTypes.style,
  label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  noIcon: PropTypes.bool,
  children: PropTypes.element,
  iconStyle: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};
InputButton.defaultProps = {
  style: {},
  labelStyle: {},
  valueStyle: {},
  label: false,
  value: false,
  noIcon: false,
  children: null,
  iconStyle: {},
};

const InputLabel = props => (
  <View style={[styles.inputRow, { justifyContent: 'center' }, props.style]}>
    <Text style={[styles.labelText]}>{props.label}</Text>
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text style={[styles.inputText]}>{props.value}</Text>
    </View>
  </View>
);
InputLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
InputLabel.defaultProps = {
  value: null,
};

const LabeledButton = props => (
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onPress: PropTypes.func.isRequired,
};
LabeledButton.defaultProps = {
  value: null,
};

const LabeledTextInput = props => (
  <View style={[styles.inputRow, { justifyContent: 'space-between' }, props.style]}>
    <Text style={[styles.labelText]}>{props.label}</Text>
    <TextInput
      {...props}
      style={[styles.inputText, { textAlign: 'right', flex: 1 }]}
      numberOfLines={1}
      value={props.value}
      placeholder={props.placeholder}
      placeholderTextColor="#727A8F"
    />
  </View>
);

const InputText = props => (
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


export {
  styles,
  DefaultAvatar,
  RemoveButton,
  SectionTitle,
  InputButton,
  InputDate,
  InputDivider,
  InputGroup,
  InputText,
  InputLabel,
  InputNumber,
  InputSwitch,
  SectionDivider,
  LabeledButton,
  LabeledTextInput,
  ClientInput,
  ServiceInput,
  ProviderInput,
  PromotionInput,
  ProductInput,
};
// export default formHelpers;
