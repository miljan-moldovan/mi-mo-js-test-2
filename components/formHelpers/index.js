import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
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
    height: 60,
    paddingVertical: 12,
    paddingTop: 12,
    paddingRight: 16,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 22,
    color: '#727A8F',
    fontFamily: 'Roboto-Medium',
    marginLeft: 16,
  },
});

export const SectionTitle = props => (
  <View style={{ height: 38, flexDirection: 'column', justifyContent: 'flex-end' }} >
    <Text style={styles.sectionTitle}>{props.value.toUpperCase()}</Text>
  </View>
);
SectionTitle.propTypes = {
  value: PropTypes.string.isRequired,
};

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
  children: PropTypes.element,
};
InputGroup.defaultProps = {
  style: false,
  children: null,
};

export const InputButton = props => (
  <TouchableOpacity onPress={props.onPress} style={props.style}>
    <View style={{ alignSelf: 'stretch' }}>
      <View style={styles.inputRow}>
        <View style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center' }}>
          <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
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
  style: View.propTypes.style,
  placeholder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element]),
  noIcon: PropTypes.bool,
  children: PropTypes.element,
};
InputButton.defaultProps = {
  style: {},
  placeholder: false,
  value: false,
  noIcon: false,
  children: null,
};

export const InputLabel = props => (
  <View style={[styles.inputRow, { justifyContent: 'center' }]}>
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onPress: PropTypes.func.isRequired,
};
LabeledButton.defaultProps = {
  value: null,
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

export class InputSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: false,
    };
  }

  render() {
    return (
      <View style={[styles.inputRow, { justifyContent: 'space-between' }]}>
        <Text style={styles.labelText}>{this.props.text}</Text>

        <Switch
          onChange={() => { this.setState({ value: !this.state.value }); this.props.onChange(this.state.value); }}
          value={this.state.value}
        />
      </View>
    );
  }
}

export class ServiceInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedService: null,
    };
  }

  handleServiceSelection = (service) => {
    this.setState({ selectedService: service });
    this.props.onChange(service);
  }

  handlePress = () => {
    this.props.navigate('Services', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeService: service => this.handleServiceSelection(service),
    });
  }

  render() {
    const value = this.state.selectedService ? this.state.selectedService.name : null;
    return (
      <TouchableOpacity
        style={[styles.inputRow, {justifyContent: 'center'}]}
        onPress={this.handlePress}
      >
        <Text style={[styles.labelText]}>Service</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={[styles.inputText]}>{value}</Text>
        </View>
        <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
      </TouchableOpacity>
    );
  }
}

export class ProviderInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProvider: null,
    };
  }

  handleProviderSelection = (provider) => {
    this.setState({ selectedProvider: provider });
    this.props.onChange(provider);
  }

  handlePress = () => {
    this.props.navigate('Providers', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeProvider: provider => this.handleProviderSelection(provider),
    });
  }

  render() {
    const value = this.state.selectedProvider ? `${this.state.selectedProvider.name} ${this.state.selectedProvider.lastName}` : null;
    return (
      <TouchableOpacity
        style={[styles.inputRow, {justifyContent: 'center'}]}
        onPress={this.handlePress}
      >
        <Text style={[styles.labelText]}>Provider</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={[styles.inputText]}>{value}</Text>
        </View>
        <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
      </TouchableOpacity>
    );
  }
}

export class PromotionInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPromotion: null,
    };
  }

  handlePromoSelection = (promotion) => {
    this.setState({ selectedPromotion: promotion });
    this.props.onChange(promotion);
  }

  handlePress = () => {
    this.props.navigate('Promotions', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangePromotion: promotion => this.handlePromoSelection(promotion),
    });
  }

  render() {
    const value = this.state.selectedPromotion ? this.state.selectedPromotion.name : null;
    return (
      <TouchableOpacity
        style={[styles.inputRow, {justifyContent: 'center'}]}
        onPress={this.handlePress}
      >
        <Text style={[styles.labelText]}>Promotion</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Text style={[styles.inputText]}>{value}</Text>
        </View>
        <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
      </TouchableOpacity>
    );
  }
}