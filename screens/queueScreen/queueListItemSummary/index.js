import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';

import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import * as actions from '../../../actions/queue';
import SalonAvatar from '../../../components/SalonAvatar';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './styles';


class queueListItemSummary extends Component {
  saveQueueService = (service) => {
    const newServices = [];

    for (let i = 0; i < this.props.services.length; i += 1) {
      const oldService = this.props.services[i];

      let newService = {
        serviceId: oldService.serviceId,
        employeeId: oldService.employeeId,
        promotionCode: oldService.promoCode,
        isProviderRequested: oldService.isProviderRequested,
        priceEntered: oldService.price,
        isFirstAvailable: oldService.isFirstAvailable,
      };

      if (oldService.id === this.props.service.id) {
        newService = {
          serviceId: service.id,
          employeeId: this.props.service.employeeId,
          promotionCode: service.promoCode,
          isProviderRequested: this.props.service.isProviderRequested,
          priceEntered: service.price,
          isFirstAvailable: this.props.service.isFirstAvailable,
        };
      }

      newServices.push(newService);
    }


    this.props.putQueue(this.props.appointment.id, {
      clientId: this.props.appointment.client.id,
      serviceEmployeeClientQueues: newServices,
      productEmployeeClientQueues: [],
    });
  }

  saveQueueProvider = (provider) => {
    const newServices = [];

    for (let i = 0; i < this.props.services.length; i += 1) {
      const service = this.props.services[i];

      let newService = {
        serviceId: service.serviceId,
        employeeId: service.employeeId,
        promotionCode: service.promoCode,
        isProviderRequested: service.isProviderRequested,
        priceEntered: service.price,
        isFirstAvailable: service.isFirstAvailable,
      };

      if (service.id === this.props.service.id) {
        newService = {
          serviceId: this.props.service.serviceId,
          employeeId: 'isFirstAvailable' in provider ? 0 : provider.id,
          promotionCode: this.props.service.promoCode,
          isProviderRequested: this.props.service.isProviderRequested,
          priceEntered: this.props.service.price,
          isFirstAvailable: 'isFirstAvailable' in provider,
        };
      }


      newServices.push(newService);
    }

    this.props.putQueue(this.props.appointment.id, {
      clientId: this.props.appointment.client.id,
      serviceEmployeeClientQueues: newServices,
      productEmployeeClientQueues: [],
    });
  }

  handlePressService = (service) => {
    this.props.navigation.navigate('ModalServices', {
      service,
      index: 0,
      client: this.props.appointment.client,
      employeeId: service.employeeId,
      dismissOnSelect: true,
      onChangeService: data => this.saveQueueService(data),
    });
    this.props.onDonePress();
  };


  cancelButton = () => ({
    leftButton: <Text style={styles.cancelButton}>Cancel</Text>,
    leftButtonOnPress: (navigation) => {
      navigation.goBack();
    },
  })


  handlePressProvider = () => {
    this.props.navigation.navigate('Providers', {
      dismissOnSelect: true,
      headerProps: { title: 'Providers', ...this.cancelButton() },
      client: this.props.appointment.client,
      onChangeProvider: data => this.saveQueueProvider(data),
    });

    this.props.onDonePress();
  };

  render() {
    const { employee } = this.props.service;
    const employeeInitials = employee && employee.fullName ? `${employee.name[0]}${employee.lastName[0]}` : '';
    const image = getEmployeePhotoSource(employee);
    return (
      <View>
        <View style={styles.serviceContainer}>
          <SalonTouchableOpacity onPress={() => this.handlePressService(this.props.service)}>
            <View style={[styles.row, styles.rowBorderBottom]}>
              <Text style={styles.textMedium}>{this.props.service.serviceName}</Text>
              <View style={styles.iconContainer}>
                <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
              </View>
            </View>
          </SalonTouchableOpacity>
          <SalonTouchableOpacity onPress={() => this.handlePressProvider(this.props.service)}>
            <View style={styles.row}>
              <SalonAvatar
                borderColor="#FFFFFF"
                borderWidth={2}
                wrapperStyle={styles.providerRound}
                width={26}
                image={image}
                hasBadge
                badgeComponent={
                  <FontAwesome style={{ color: '#1DBF12', fontSize: 10 }}>
                    {Icons.lock}
                  </FontAwesome>}
                defaultComponent={
                  <View style={styles.avatarDefaultComponent}>
                    <Text style={styles.avatarDefaultComponentText}>{!this.props.service.isFirstAvailable ? employeeInitials : 'FA'}</Text>
                  </View>
                }
              />
              <Text style={styles.textNormal}>{!this.props.service.isFirstAvailable && this.props.service.employee.fullName ? `${this.props.service.employee.fullName}` : 'First Available'}</Text>
              <View style={styles.iconContainer}>
                <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
              </View>
            </View>
          </SalonTouchableOpacity>
        </View>
      </View>
    );
  }
}


queueListItemSummary.defaultProps = {

};

queueListItemSummary.propTypes = {
  services: PropTypes.any.isRequired,
  service: PropTypes.any.isRequired,
  appointment: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  putQueue: PropTypes.any.isRequired,
  onDonePress: PropTypes.any.isRequired,
};


export default connect(null, actions)(queueListItemSummary);
