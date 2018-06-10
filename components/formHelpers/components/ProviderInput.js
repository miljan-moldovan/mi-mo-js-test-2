import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import apiWrapper from '../../../utilities/apiWrapper';
import SalonAvatar from '../../SalonAvatar';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class ProviderInput extends React.Component {
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
