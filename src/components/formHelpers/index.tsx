import * as React from 'react';
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
import {get, isString} from 'lodash';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import TextInputMask from 'react-native-text-input-mask';
import ValidatableInput from './components/ValidatableInput';
import ClientInput from './components/ClientInput';
import InputDate from './components/InputDate';
import InputNumber from './components/InputNumber';
import InputText from './components/InputText';
import InputSwitch from './components/InputSwitch';
import ServiceInput from './components/ServiceInput';
import ProviderInput from './components/ProviderInput';
import PromotionInput from './components/PromotionInput';
import ProductInput from './components/ProductInput';
import SalonTimePicker from './components/SalonTimePicker';
import InputRadioGroup from './components/InputRadioGroup';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import BlockTimesReasonInput from './components/BlockTimesReasonInput';
import InputPicker from './components/InputPicker';
import SchedulePicker from './components/SchedulePicker';
import styles from './styles';

const DefaultAvatar = props => (
  <View
    style={[
      styles.avatarDefaultComponent,
      props.size ? {width: props.size, height: props.size} : '',
    ]}
  >
    <Text
      style={[
        styles.avatarDefaultComponentText,
        props.fontSize ? {fontSize: props.fontSize} : '',
      ]}
    >
      {props.provider && !props.provider.isFirstAvailable
        ? `${get (props.provider, 'name[0]', '')}${get (props.provider, 'lastName[0]', '')}`
        : 'FA'}
    </Text>
  </View>
);

const LabeledTextarea = props => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
    }}
  >
    <Text
      style={{
        fontSize: 14,
        lineHeight: 22,
        color: '#110A24',
        fontFamily: 'Roboto',
      }}
    >
      {props.label}
    </Text>
    <InputText
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      {...props}
    />
  </View>
);

const RemoveButton = ({title, onPress}) => (
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
    <Text
      style={{
        fontSize: 14,
        lineHeight: 22,
        color: '#D1242A',
        fontFamily: 'Roboto-Medium',
      }}
    >
      {title}
    </Text>
  </SalonTouchableOpacity>
);

const SectionTitle = props => (
  <View
    style={[
      {height: 38, flexDirection: 'column', justifyContent: 'center'},
      props.style,
    ]}
  >
    <Text style={[styles.sectionTitle, props.sectionTitleStyle]}>
      {props.case === 'upper'
        ? props.value.toUpperCase ()
        : props.case === 'lower' ? props.value.toLowerCase () : props.value}
    </Text>
  </View>
);
SectionTitle.propTypes = {
  value: PropTypes.string.isRequired,
  case: PropTypes.string,
};

SectionTitle.defaultProps = {
  case: 'upper',
};

const SectionDivider = props => <View style={[{height: 38}, props.style]} />;

SectionDivider.propTypes = {
  style: PropTypes.oneOfType ([PropTypes.bool, PropTypes.object]),
};

SectionDivider.defaultProps = {
  style: false,
};

const InputDivider = props => {
  const style = props.fullWidth ? {width: '100%'} : {};
  return <View style={[styles.inputDivider, style, props.style]} />;
};

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

const InputButton = props => {
  const icon = props.icon === 'default'
    ? <FontAwesome style={[styles.iconStyle, props.iconStyle]}>
        {Icons.angleRight}
      </FontAwesome>
    : props.icon;

  return (
    <SalonTouchableOpacity
      style={[styles.inputRow, {justifyContent: 'center'}, props.style]}
      onPress={props.onPress}
      disabled={props.disabled || false}
    >
      {props.label && typeof props.label === 'string'
        ? <Text style={[styles.labelText, props.labelStyle]}>
            {props.label}
          </Text>
        : props.label}
      <View
        style={[
          {flex: 1, justifyContent: 'flex-end', flexDirection: 'row'},
          props.childrenContainerStyle,
        ]}
      >
        {typeof props.value === 'string'
          ? <Text
              numberOfLines={1}
              style={[styles.inputText, props.valueStyle]}
            >
              {props.value}
            </Text>
          : props.value}
        {props.children}
      </View>
      {props.icon ? icon : null}
    </SalonTouchableOpacity>
  );
};
export const propTypesObj = {
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
  valueStyle: Text.propTypes.style,
  label: PropTypes.oneOfType ([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.element,
  ]),
  value: PropTypes.oneOfType ([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.element,
  ]),
  children: PropTypes.element,
  icon: PropTypes.oneOfType ([PropTypes.element, PropTypes.bool]),
  iconStyle: PropTypes.oneOfType ([PropTypes.bool, PropTypes.object]),
};
export const defaultPropsObj = {
  style: {},
  labelStyle: {},
  valueStyle: {},
  label: false,
  value: false,
  noIcon: false,
  children: null,
  iconStyle: {},
  icon: null,
  placeholder: false,
};
InputButton.propTypes = propTypesObj;
InputButton.defaultProps = defaultPropsObj;

const InputLabel = props => (
  <View style={[styles.inputRow, {justifyContent: 'center'}, props.style]}>
    <Text style={[styles.labelText]}>{props.label}</Text>
    <View style={{flex: 1, alignItems: 'flex-end'}}>
      <Text style={[styles.inputText]}>{props.value}</Text>
    </View>
  </View>
);
InputLabel.propTypes = {
  label: PropTypes.oneOfType ([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType ([PropTypes.string, PropTypes.element]),
};
InputLabel.defaultProps = {
  value: null,
};

const LabeledButton = props => (
  <InputButton style={{alignSelf: 'stretch'}} onPress={props.onPress}>
    <InputLabel label={props.label} value={props.value} />
  </InputButton>
);
LabeledButton.propTypes = {
  label: PropTypes.oneOfType ([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType ([PropTypes.string, PropTypes.element]),
  onPress: PropTypes.func.isRequired,
};
LabeledButton.defaultProps = {
  value: null,
};

const LabeledTextInput = props => (
  <View
    style={[styles.inputRow, {justifyContent: 'space-between'}, props.style]}
  >
    <Text style={[styles.labelText, props.labelStyle]}>{props.label}</Text>
    {props.mask
      ? <TextInputMask
          {...props}
          style={[
            styles.inputText,
            {textAlign: 'right', flex: 1},
            props.inputStyle,
          ]}
          numberOfLines={1}
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor="#727A8F"
        />
      : <TextInput
          {...props}
          style={[
            styles.inputText,
            {textAlign: 'right', flex: 1},
            props.inputStyle,
          ]}
          numberOfLines={1}
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor="#727A8F"
        />}

    {props.icon}

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
  SalonTimePicker,
  InputRadioGroup,
  BlockTimesReasonInput,
  ValidatableInput,
  LabeledTextarea,
  InputPicker,
  SchedulePicker,
};
