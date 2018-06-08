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
import moment from 'moment';

import SalonAvatar from '../../components/SalonAvatar';
import SalonDatePicker from '../../components/modals/SalonDatePicker';
import apiWrapper from '../../utilities/apiWrapper';
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

export const DefaultAvatar = props => (
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

export const RemoveButton = ({ title, onPress }) => (
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

export const SectionTitle = props => (
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

export const SectionDivider = props => (
  <View style={[{ height: 38 }, props.style]} />
);

SectionDivider.propTypes = {
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

SectionDivider.defaultProps = {
  style: false,
};

export const InputDivider = props => (
  <View style={[styles.inputDivider, props.style]} />
);

InputDivider.propTypes = {
  style: ViewPropTypes.style,
};

InputDivider.defaultProps = {
  style: false,
};

export const InputGroup = props => (
  <View style={[styles.inputGroup, props.style]}>
    {props.children}
  </View>
);
InputGroup.propTypes = {
  style: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};
InputGroup.defaultProps = {
  style: false,
  children: null,
};

export const InputButton = props => (
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

export const InputLabel = props => (
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
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <SalonDatePicker
          isVisible={this.state.showModal}
          onPress={(selectedDate) => {
            this.setState({ showModal: false });
            this.props.onPress(selectedDate);
          }}
          selectedDate={this.props.selectedDate}
        />
        <InputButton
          style={{ flex: 1 }}
          valueStyle={this.props.valueStyle}
          onPress={() => {
            this.setState({ showModal: !this.state.showModal });
          }}
          noIcon
          label={this.props.placeholder}
          value={moment.isMoment(this.props.selectedDate) ? this.props.selectedDate.format('YYYY-MM-DD') : this.props.selectedDate}
        />
        {!this.props.noIcon && (
          <SalonTouchableOpacity
            onPress={() => {
              this.props.onPress(null);
            }}
            style={styles.dateCancelButtonStyle}
          >
            <View style={styles.dateCancelStyle}>
              <FontAwesome style={[styles.iconStyle, { marginLeft: 0 }]}>{Icons.timesCircle}</FontAwesome>
            </View>
          </SalonTouchableOpacity>
        )}
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
        { !this.props.textRight ? <Text style={[styles.labelText, this.props.textStyle]}>{this.props.text}</Text> : null }
        <Switch
          onChange={() => { this.setState({ value: !this.state.value }); this.props.onChange(this.state.value); }}
          value={this.state.value}
          style={this.props.switchStyle}
        />
        { this.props.textRight ? <Text style={[styles.labelText, this.props.textStyle]}>{this.props.text}</Text> : null }
      </View>
    );
  }
}

export class ClientInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labelText: 'labelText' in this.props ? this.props.labelText : 'Client',
      selectedClient: 'selectedClient' in this.props ? this.props.selectedClient : null,
    };
  }

  handleClientSelection = (client) => {
    this.setState({ selectedClient: client });
    this.props.onChange(client);
  }

  handlePress = () => {
    if (this.props.onPress) { this.props.onPress(); }

    this.props.navigate(this.props.apptBook ? 'ApptBookClient' : 'ChangeClient', {
      selectedClient: 'selectedClient' in this.state ? this.state.selectedClient : null,
      actionType: 'update',
      dismissOnSelect: true,
      onChangeClient: client => this.handleClientSelection(client),
      headerProps: this.props.headerProps ? this.props.headerProps : {},
    });
  }

  render() {
    let placeholder = 'placeholder' in this.props ? this.props.placeholder : 'Select Client';
    if (this.props.noPlaceholder) {
      placeholder = null;
    }
    const value = this.props.selectedClient ? `${this.props.selectedClient.name} ${this.props.selectedClient.lastName}` : null;
    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }, this.props.style]}
        onPress={this.handlePress}
      >
        {!this.props.noLabel && (
          <Text numberOfLines={1} style={[styles.labelText, this.props.labelStyle]}>{this.state.labelText}</Text>
        )}
        <View style={[{
            flex: 1,
            alignItems: this.props.noLabel ? 'flex-start' : 'flex-end',
            justifyContent: 'center',
          }, this.props.contentStyle,
        ]}
        >
          {value !== null && (
          <Text numberOfLines={1} style={[styles.inputText, this.props.selectedStyle]}>{value}</Text>
          )}
          {value === null && placeholder !== null && (
            <Text numberOfLines={1} style={[styles.labelText, this.props.placeholderStyle]}>{placeholder}</Text>
          )}
        </View>
        {'extraComponents' in this.props && (
          <View style={{ marginHorizontal: 5, flexDirection: 'row' }}>{this.props.extraComponents}</View>
        )}
        <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
      </SalonTouchableOpacity>
    );
  }
}

export class ServiceInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labelText: 'labelText' in this.props ? this.props.labelText : 'Service',
      selectedService: 'selectedService' in this.props ? this.props.selectedService : null,
    };
  }

  handleServiceSelection = (service) => {
    this.setState({ selectedService: service });
    this.props.onChange(service);
  }

  handlePress = () => {
    if (this.props.onPress) { this.props.onPress(); }

    this.props.navigate(this.props.apptBook ? 'ApptBookService' : 'Services', {
      selectedService: 'selectedService' in this.state ? this.state.selectedService : null,
      actionType: 'update',
      employeeId: this.props.selectedProvider && this.props.selectedProvider !== null ? this.props.selectedProvider.id : false,
      filterByProvider: !!this.props.filterByProvider,
      selectedProvider: this.props.selectedProvider ? this.props.selectedProvider : null,
      headerProps: this.props.headerProps ? this.props.headerProps : {},
      dismissOnSelect: true,
      onChangeService: service => this.handleServiceSelection(service),
    });
  }

  render() {
    const {
      selectedService,
    } = this.state;
    let placeholder = 'placeholder' in this.props ? this.props.placeholder : 'Select Service';
    if (this.props.noPlaceholder) {
      placeholder = null;
    }

    let value = selectedService && selectedService.name ?
      selectedService.name :
      selectedService && 'serviceName' in selectedService ? selectedService.serviceName : null;
    if (value === null && selectedService !== null) {
      value = selectedService.description;
    }
    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }, this.props.rootStyle]}
        onPress={this.handlePress}
      >
        {!this.props.noLabel && (
          <Text numberOfLines={1} style={[styles.labelText, this.props.labelStyle]}>{this.state.labelText}</Text>
        )}
        <View style={[{ flex: 1, alignItems: this.props.noLabel ? 'flex-start' : 'flex-end' }, this.props.contentStyle]}>
          {value !== null && (
            <Text numberOfLines={1} style={[styles.inputText, this.props.selectedStyle]}>{value}</Text>
          )}
          {value === null && placeholder !== null && (
            <Text numberOfLines={1} style={[styles.labelText, this.props.placeholderStyle]}>{placeholder}</Text>
          )}
        </View>
        <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
      </SalonTouchableOpacity>
    );
  }
}

export class ProviderInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labelText: 'labelText' in this.props ? this.props.labelText : 'Provider',
      selectedProvider: 'selectedProvider' in this.props ? this.props.selectedProvider : null,
    };
  }

  handleProviderSelection = (provider) => {
    this.setState({ selectedProvider: provider, selectedProviderId: provider.id });
    this.props.onChange(provider);
  }

  handlePress = () => {
    if (this.props.onPress) { this.props.onPress(); }

    this.props.navigate(this.props.apptBook ? 'ApptBookProvider' : 'Providers', {
      selectedProvider: this.state.selectedProvider,
      actionType: 'update',
      dismissOnSelect: true,
      filterByService: !!this.props.filterByService,
      filterList: this.props.filterList ? this.props.filterList : false,
      onChangeProvider: provider => this.handleProviderSelection(provider),
      headerProps: this.props.headerProps ? this.props.headerProps : {},
    });
  }

  render() {
    let placeholder = 'placeholder' in this.props ? this.props.placeholder : 'Select Provider';
    if (this.props.noPlaceholder) {
      placeholder = null;
    }
    let value = this.state.selectedProvider !== null && 'name' in this.state.selectedProvider ?
      `${this.state.selectedProvider.name} ${this.state.selectedProvider.lastName}` : null;

    if (this.state.selectedProvider !== null) {
      if ('isFirstAvailable' in this.state.selectedProvider) {
        value = 'First Available';
      }
    }

    const employeePhoto = this.state.selectedProvider ? apiWrapper.getEmployeePhoto(this.state.selectedProvider !== null && !this.state.selectedProvider.isFirstAvailable ? this.state.selectedProvider.id : 0) : '';

    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }, this.props.rootStyle]}
        onPress={this.handlePress}
      >
        {!this.props.noLabel && (
          <Text numberOfLines={1} style={[styles.labelText, this.props.labelStyle]}>{this.state.labelText}</Text>
        )}
        <View style={[
          { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
          this.props.contentStyle,
        ]}
        >
          {value !== null && (
            <View style={{ flexDirection: 'row' }}>
              {!this.props.noAvatar && (
                <SalonAvatar
                  wrapperStyle={styles.providerRound}
                  width={'avatarSize' in this.props ? this.props.avatarSize : 30}
                  borderWidth={1}
                  borderColor="transparent"
                  image={{ uri: employeePhoto }}
                  defaultComponent={<ActivityIndicator />}
                />
              )}
              <Text numberOfLines={1} style={[styles.inputText, this.props.selectedStyle]}>{value}</Text>
            </View>
          )}
          {value === null && placeholder !== null && (
            <Text numberOfLines={1} style={[styles.labelText, this.props.placeholderStyle]}>{placeholder}</Text>
          )}
        </View>
        <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
      </SalonTouchableOpacity>
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
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }]}
        onPress={this.handlePress}
      >
        <Text style={[styles.labelText]}>Promotion</Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text numberOfLines={1} style={[styles.inputText]}>{value}</Text>
        </View>
        <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
      </SalonTouchableOpacity>
    );
  }
}

export class ProductInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedProduct: 'selectedProduct' in this.props ? this.props.selectedProduct : null,
    };
  }

  handleProductSelection = (product) => {
    this.setState({ selectedProduct: product });
    this.props.onChange(product);
  }

  handlePress = () => {
    this.props.navigate('Products', {
      actionType: 'update',
      dismissOnSelect: true,
      onChangeProduct: product => this.handleProductSelection(product),
    });
  }

  render() {
    const value = this.state.selectedProduct ? this.state.selectedProduct.name : null;
    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }]}
        onPress={this.handlePress}
      >
        <Text style={[styles.labelText]}>Product</Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={[styles.inputText]}>{value}</Text>
        </View>
        <FontAwesome style={styles.iconStyle}>{Icons.angleRight}</FontAwesome>
      </SalonTouchableOpacity>
    );
  }
}

export class InputNumber extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubstractPress = () => {
    const min = this.props.min ? this.props.min : 0;
    if (this.props.value > min) {
      const value = this.props.value - 1;
      this.props.onChange('subtract', value);
    }
  }

  handleAddPress = () => {
    if (this.props.max) {
      if (this.props.value < this.props.max) {
        const value = this.props.value + 1;
        this.props.onChange('add', value);
      }
    } else {
      const value = this.props.value + 1;
      this.props.onChange('add', value);
    }
  }

  renderCounterComponent = () => this.props.counterComponent(this.props.value)

  render() {
    const text = this.props.value > 1 ? this.props.pluralText : this.props.singularText;
    const valueText = `${this.props.value} ${text}`;
    const countComponent = 'label' in this.props ? (
      <InputLabel
        style={{ flex: 1 }}
        label={this.props.label}
        value={valueText}
      />
    ) : (
      <Text style={[styles.labelText, this.props.textStyle]}>{valueText}</Text>
    );

    return (
      <View style={[styles.inputRow, { justifyContent: 'space-between' }, this.props.style]}>
        {countComponent}
        <View style={[styles.inputNumber, this.props.inputNumberStyle]}>
          <SalonTouchableOpacity
            style={[styles.inputNumberButton, {
              borderRightColor: '#1DBF12',
              borderRightWidth: 1,
            }]}
            onPress={this.handleSubstractPress}
          >
            <Text style={[styles.inputNumberLabelText]}>-</Text>
          </SalonTouchableOpacity>
          <SalonTouchableOpacity
            style={[styles.inputNumberButton]}
            onPress={this.handleAddPress}
          >
            <Text style={[styles.inputNumberLabelText]}>+</Text>
          </SalonTouchableOpacity>
        </View>
      </View>
    );
  }
}
