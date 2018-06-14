import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class ServiceInput extends React.Component {
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
