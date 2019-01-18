import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { isFunction } from 'lodash';

import SalonAvatar from '../../SalonAvatar';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles, DefaultAvatar } from '../index';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';

export default class ProviderInput extends React.Component<any, any> {
  handleProviderSelection = (provider) => {
    const { onChange = prov => prov } = this.props;
    onChange(provider);
  };

  handlePress = () => {
    const {
      navigate,
      push,
      date = moment(),
      onPress = false,
      apptBook = false,
      headerProps = {},
      queueList = false,
      filterList = false,
      mode = 'employees',
      selectedService = null,
      selectedProvider = null,
      showFirstAvailable = true,
      showAllProviders = false,
      showEstimatedTime = true,
      checkProviderStatus = false,
      walkin = false,
    } = this.props;
    if (isFunction(onPress)) {
      onPress();
    }
    const screenProviders = walkin ? 'ModalProviders' : 'Providers';
    const nav = walkin ? push : navigate;
    nav(apptBook ? 'ApptBookProvider' : screenProviders, {
      mode,
      date,
      queueList,
      filterList,
      headerProps,
      selectedService,
      selectedProvider,
      showFirstAvailable,
      showAllProviders,
      showEstimatedTime,
      checkProviderStatus,
      dismissOnSelect: true,
      onChangeProvider: provider => this.handleProviderSelection(provider),
    });
  };

  render() {
    const { selectedService } = this.props;
    const disabled = this.props.disabled || selectedService && selectedService.isAddon;
    const {
      label = 'Provider',
      selectedProvider = null,
      placeholder = 'Select Provider',
    } = this.props;
    let value = selectedProvider !== null && 'name' in selectedProvider ?
      `${selectedProvider.name} ${selectedProvider.lastName ? selectedProvider.lastName : ''}` : null;

    if (selectedProvider !== null) {
      if ('isFirstAvailable' in selectedProvider) {
        value = 'First Available';
      }
    }

    const disabledAvatarStyles = {
      opacity: disabled ? 0.3 : 1,
    };

    const disabledTextStyle = {
      color: disabled ? '#727A8F' : '#110A24',
    };

    return (
      <SalonTouchableOpacity
        style={[styles.inputRow, { justifyContent: 'center' }, this.props.rootStyle]}
        onPress={this.handlePress}
        disabled={disabled}
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
                  wrapperStyle={[styles.providerRound, disabledAvatarStyles]}
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
                  image={getEmployeePhotoSource(selectedProvider)}
                  defaultComponent={(
                    <DefaultAvatar
                      size={22}
                      fontSize={9}
                      provider={selectedProvider}
                    />
                  )}
                />
              )}
              <Text
                numberOfLines={1}
                style={[styles.inputText, this.props.selectedStyle, disabledTextStyle]}
              >
                {value}
              </Text>
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
        {
          !this.props.noIcon &&
          !disabled &&
          <FontAwesome style={[styles.iconStyle, this.props.iconStyle]}>{Icons.angleRight}</FontAwesome>
        }
      </SalonTouchableOpacity>
    );
  }
}
