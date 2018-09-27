import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { get } from 'lodash';
import getEmployeePhotoSource from '../../../utilities/helpers/getEmployeePhotoSource';
import * as actions from '../../../actions/queue';
import SalonAvatar from '../../../components/SalonAvatar';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import Icon from '../../../components/UI/Icon';
import styles from './styles';
import { DefaultAvatar } from '../../../components/formHelpers';


class queueListItemSummary extends Component {
  saveQueueService = (service) => {
    const newServices = [];

    for (let i = 0; i < this.props.services.length; i += 1) {
      const oldService = this.props.services[i];
      const employee = get(oldService, 'employee', null);

      let newService = {
        serviceId: get(oldService, 'serviceId', null),
        employeeId: get(employee, 'id', null),
        promotionCode: get(oldService, 'promo', null),
        isProviderRequested: oldService.isProviderRequested,
        priceEntered: oldService.price,
        isFirstAvailable: oldService.isFirstAvailable,
      };

      if (oldService.id === this.props.service.id) {
        const serviceId = get(service, 'id', null);
        const serviceProvider = get(oldService, 'employee', null);
        const employeeId = get(serviceProvider, 'id', null);
        newService = {
          serviceId,
          employeeId,
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

    this.props.loadQueueData();
  }

  saveQueueProvider = (provider) => {
    const newServices = [];

    for (let i = 0; i < this.props.services.length; i += 1) {
      const service = this.props.services[i];

      let newService = {
        serviceId: service.serviceId,
        employeeId: get(service.employee, 'id', null),
        promotionCode: service.promoCode,
        isProviderRequested: service.isProviderRequested,
        priceEntered: service.price,
        isFirstAvailable: service.isFirstAvailable,
      };

      if (service.id === this.props.service.id) {
        newService = {
          serviceId: service.serviceId,
          employeeId: 'isFirstAvailable' in provider ? null : provider.id,
          promotionCode: this.props.service.promoCode,
          isProviderRequested: this.props.service.isProviderRequested,
          priceEntered: this.props.service.price,
          isFirstAvailable: get(provider, 'isFirstAvailable', false),
        };
      }


      newServices.push(newService);
    }

    this.props.putQueue(this.props.appointment.id, {
      clientId: this.props.appointment.client.id,
      serviceEmployeeClientQueues: newServices,
      productEmployeeClientQueues: [],
    });

    this.props.loadQueueData();
  }

  handlePressService = (service) => {
    this.props.navigation.navigate('ModalServices', {
      service,
      index: 0,
      client: this.props.appointment.client,
      employeeId: service.employeeId,
      dismissOnSelect: true,
      onChangeService: data => this.saveQueueService(data),
      headerProps: {
        title: 'Services',
        rightButton: null,
        rightButtonOnPress: navigation => null,
        ...this.cancelButton(),
      },
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
    const {
      navigation: { navigate },
      service: { employee = null, ...service },
      item,
    } = this.props;

    navigate('ModalProviders', {
      selectedService: { id: service.serviceId },
      showFirstAvailable: false,
      dismissOnSelect: true,
      selectedProvider: employee,
      checkProviderStatus: true,
      queueList: true,
      headerProps: { title: 'Providers', ...this.cancelButton() },
      onChangeProvider: data => this.saveQueueProvider(data),
    });
    this.props.onDonePress();
  };

  render() {
    const { employee, isProviderRequested } = this.props.service;
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
                hasBadge={isProviderRequested}
                badgeComponent={
                  isProviderRequested ?
                    <Icon
                      name="lock"
                      type="solid"
                      size={10}
                      color="#1DBF12"
                    /> : null
                }
                defaultComponent={
                  <DefaultAvatar
                    provider={employee}
                  />
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
