import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get, isFunction } from 'lodash';
import SalonAvatar from '../../SalonAvatar';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles, DefaultAvatar } from '../index';

export default class ProviderInput extends React.Component {
  handleProviderSelection = (provider) => {
    const { onChange = prov => prov } = this.props;
    onChange(provider);
  }

  handlePress = () => {
    const {
      navigate,
      onPress = false,
      apptBook = false,
      headerProps = {},
      filterList = false,
      selectedService = null,
      selectedProvider = null,
      showFirstAvailable = true,
    } = this.props;
    if (isFunction(onPress)) { onPress(); }
    navigate(apptBook ? 'ApptBookProvider' : 'Providers', {
      filterList,
      headerProps,
      selectedService,
      selectedProvider,
      showFirstAvailable,
      dismissOnSelect: true,
      onChangeProvider: provider => this.handleProviderSelection(provider),
    });
  }

  render() {
    const {
      label = 'Provider',
      selectedProvider = null,
      placeholder = 'Select Provider',
    } = this.props;
    let value = selectedProvider !== null && 'name' in selectedProvider ?
      `${selectedProvider.name} ${selectedProvider.lastName}` : null;

    if (selectedProvider !== null) {
      if ('isFirstAvailable' in selectedProvider) {
        value = 'First Available';
      }
    }
    const employeePhoto = get(selectedProvider, 'imagePath', null);
    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }, this.props.rootStyle]}
        onPress={this.handlePress}
      >
        {
          label && (
            <Text numberOfLines={1} style={[styles.labelText, this.props.labelStyle]}>{label}</Text>
          )
        }
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
                  width={'avatarSize' in this.props ? this.props.avatarSize : 20}
                  borderWidth={1}
                  borderColor="transparent"
                  hasBadge={this.props.isRequested}
                  badgeComponent={(
                    <FontAwesome style={{
                      color: '#1DBF12', fontSize: 10,
                    }}
                    >{Icons.lock}
                    </FontAwesome>
                  )}
                  image={{ uri: employeePhoto }}
                  defaultComponent={(
                    <DefaultAvatar
                      size={22}
                      fontSize={9}
                      provider={selectedProvider}
                    />
                  )}
                />
              )}
              <Text numberOfLines={1} style={[styles.inputText, this.props.selectedStyle]}>{value}</Text>
            </View>
          )}
          {
            !value && placeholder && (
              <Text
                numberOfLines={1}
                style={[styles.labelText, this.props.placeholderStyle]}
              >
                {placeholder}
              </Text>
            )
          }
        </View>
        <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
      </SalonTouchableOpacity>
    );
  }
}
