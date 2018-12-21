import * as React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import moment from 'moment';
import { get, isFunction } from 'lodash';
import { Services } from '../../../utilities/apiWrapper';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { styles } from '../index';

export default class ServiceInput extends React.Component<any, any> {
  get shouldShowExtras() {
    const {
      selectedService = null,
      hasViewedAddons = false,
      hasViewedRequired = false,
      hasViewedRecommended = false,
      selectExtraServices = false,
    } = this.props;
    if (!selectExtraServices) {
      return false;
    }
    const addons = get(selectedService, 'addons', []);
    const requiredServices = get(selectedService, 'requiredServices', []);
    const recommendedServices = get(selectedService, 'recommendedServices', []);

    if (!hasViewedAddons && addons.length > 0) {
      return true;
    }
    if (!hasViewedRecommended && recommendedServices.length > 0) {
      return true;
    }
    if (!hasViewedRequired && requiredServices.length > 0) {
      return true;
    }

    return false;
  }

  handleServiceSelection = (service) => {
    const {
      onChange = srv => srv,
    } = this.props;
    onChange(service);
  }

  handlePress = () => {
    const {
      navigate,
      push,
      onPress = false,
      apptBook = false,
      headerProps = {},
      selectedService = null,
      selectedClient = null,
      selectedProvider = null,
      actionType = 'service',
      walkin = false,
    } = this.props;
    const screenService = walkin ? 'ModalServices' : 'Services';
    if (isFunction(onPress)) { onPress(); }
    const nav = walkin ? push : navigate;
    nav(apptBook ? 'ApptBookService' : screenService, {
      actionType,
      headerProps,
      selectedService,
      dismissOnSelect: true,
      // filterByProvider: !!selectedProvider,
      clientId: get(selectedClient, 'id', null),
      employeeId: get(selectedProvider, 'id', null),
      onChangeService: service => this.handleServiceSelection(service),
    });
  }

  selectExtraServices = () => {
    const {
      afterDone = () => null,
      onChangeAddons = srv => srv,
      onChangeRequired = srv => srv,
      onChangeRecommended = srv => srv,
    } = this.props;
    this.showAddons().then(services => onChangeAddons(services)).catch(() => onChangeAddons([]));
    this.showRecommended().then(services => onChangeRecommended(services)).catch(() => onChangeRecommended([]));
    this.showRequired().then(services => onChangeRequired(services)).catch(() => onChangeRequired([]));
    afterDone();
  }

  showRequired = () => new Promise((resolve, reject) => {
    try {
      const {
        onPress,
        navigate,
        selectedService,
        onCancelExtrasSelection = () => null,
      } = this.props;
      if (isFunction(onPress)) {
        onPress();
      }
      if (selectedService && selectedService.requiredServices.length > 0) {
        if (selectedService.requiredServices.length === 1) {
          const [fullServiceObject] = this.getServicesById(selectedService.requiredServices);
          resolve(fullServiceObject);
        } else {
          navigate('RequiredServices', {
            serviceTitle: selectedService.name,
            services: selectedService.requiredServices,
            onNavigateBack: onCancelExtrasSelection,
            showCancelButton: this.state.hasViewedRequired,
            onSave: service => resolve(service),
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  })

  showAddons = () => new Promise((resolve, reject) => {
    try {
      const {
        onPress,
        navigate,
        selectedService,
        onCancelExtrasSelection = () => null,
      } = this.props;
      if (isFunction(onPress)) {
        onPress();
      }
      if (selectedService && selectedService.addons.length > 0) {
        navigate('AddonServices', {
          serviceTitle: selectedService.name,
          services: selectedService.addons,
          onNavigateBack: onCancelExtrasSelection,
          showCancelButton: this.state.hasViewedAddons,
          onSave: services => resolve(services),
        });
      }
    } catch (err) {
      reject(err);
    }
  })

  showRecommended = () => new Promise((resolve, reject) => {
    try {
      const {
        onPress,
        navigate,
        selectedService,
        onCancelExtrasSelection = () => null,
      } = this.props;
      if (isFunction(onPress)) {
        onPress();
      }
      if (selectedService && selectedService.recommendedServices.length > 0) {
        navigate('RecommendedServices', {
          serviceTitle: selectedService.name,
          services: selectedService.recommendedServices,
          onNavigateBack: onCancelExtrasSelection,
          showCancelButton: this.state.hasViewedRecommended,
          onSave: services => resolve(services),
        });
      }
    } catch (err) {
      reject(err);
    }
  })

  render() {
    const {
      selectedService,
      showLength = false,
      nameKey = 'name',
      label = 'Service',
    } = this.props;

    let placeholder = 'placeholder' in this.props ? this.props.placeholder : 'Select Service';
    if (this.props.noPlaceholder) {
      placeholder = null;
    }

    const value = get(selectedService, nameKey, null);
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
        <View style={[{ flex: 1, alignItems: !label ? 'flex-start' : 'flex-end' }, this.props.contentStyle]}>
          {value && (
            <Text numberOfLines={1} style={[styles.inputText, this.props.selectedStyle]}>{value}</Text>
          )}
          {!value && placeholder && (
            <Text numberOfLines={1} style={[styles.labelText, this.props.placeholderStyle]}>{placeholder}</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {selectedService !== null && showLength && (
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
