import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class ServiceInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labelText: props.labelText || 'Service',
      selectedService: props.selectedService || null,
      addons: props.addons || [],
      recommended: props.recommended || [],
      required: props.required || null,
    };
  }

  handleServiceSelection = (service) => {
    this.setState({
      selectedService: service,
    });
    this.props.onChange(service);
  }

  handlePress = () => {
    const {
      navigate,
      onPress = false,
      apptBook = false,
      selectedClient = null,
      selectedProvider = null,
      actionType = 'service',
      headerProps = {},
    } = this.props;
    const { selectedService } = this.state;
    if (onPress) { onPress(); }

    navigate(apptBook ? 'ApptBookService' : 'Services', {
      actionType,
      headerProps,
      selectedClient,
      selectedService,
      selectedProvider,
      employeeId: selectedProvider.id || false,
      dismissOnSelect: true,
      filterByProvider: !!selectedProvider,
      // selectExtraServices: true,
      onChangeService: service => this.handleServiceSelection(service),
    });
  }

  selectAddons = () => {
    const { selectedService } = this.state;
    const { onPress = false } = this.props;
    if (onPress) { onPress(); }
    if (selectedService && selectedService.addons.length > 0) {
      this.props.navigate('AddonServices', {
        serviceTitle: selectedService.name,
        services: selectedService.addons,
        onSave: (addons) => {
          this.props.onChangeAddons(addons);
          this.setState({
            addons,
          });
        },
      });
    }
    return this;
  }

  selectRecommended = () => {
    const { selectedService } = this.state;
    const { onPress = false } = this.props;
    if (onPress) { onPress(); }
    if (selectedService && selectedService.recommendedServices.length > 0) {
      this.props.navigate('RecommendedServices', {
        serviceTitle: selectedService.name,
        services: selectedService.recommendedServices,
        onSave: (recommended) => {
          this.props.onChangeRecommended(recommended);
          this.setState({
            recommended,
          });
        },
      });
    }
    return this;
  }

  selectRequired = () => {
    const { selectedService } = this.state;
    const { onPress = false } = this.props;
    if (onPress) { onPress(); }
    if (selectedService && selectedService.requiredServices.length > 0) {
      this.props.navigate('RequiredServices', {
        serviceTitle: selectedService.name,
        services: selectedService.requiredServices,
        onSave: (required) => {
          this.props.onChangeRequired(required);
          this.setState({
            required,
          });
        },
      });
    }
    return this;
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
        <View style={{ flexDirection: 'row' }}>
          {selectedService !== null && this.props.showLength && (
            <Text style={[{
              fontSize: 12,
              fontFamily: 'Roboto-Medium',
              lineHeight: 18,
              color: '#727A8F',
              opacity: 0.9,
              marginRight: 10,
            }, this.props.lengthStyle]}
            >
              {`${moment.duration(selectedService.maxDuration).asMinutes()} min`}
            </Text>
          )}
          <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
        </View>
      </SalonTouchableOpacity>
    );
  }
}
