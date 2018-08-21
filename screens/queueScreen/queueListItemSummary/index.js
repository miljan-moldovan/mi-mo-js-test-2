import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import FontAwesome, { Icons } from 'react-native-fontawesome';
import { getEmployeePhoto } from '../../../utilities/apiWrapper';
import * as actions from '../../../actions/queue';
import SalonAvatar from '../../../components/SalonAvatar';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import styles from './styles';


class queueListItemSummary extends React.Component {
  saveQueueService = (service) => {
    const newServices = [];

    for (let i = 0; i < this.props.services.length; i++) {
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
    }).then((response) => {


    }).catch((error) => {
    });
  }

  saveQueueProvider = (provider) => {
    const newServices = [];

    for (let i = 0; i < this.props.services.length; i++) {
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
    }).then((response) => {


    }).catch((error) => {
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

handlePressProvider = (service) => {
  this.props.navigation.navigate('ModalProviders', {
    index: 0,
    client: this.props.appointment.client,
    dismissOnSelect: true,
    onChangeProvider: data => this.saveQueueProvider(data),
  });
  this.props.onDonePress();
};

render() {
  const employeeInitials = this.props.service.employeeFirstName ? `${this.props.service.employeeFirstName[0]}${this.props.service.employeeLastName[0]}` : '';
  return (<View>
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
            image={{ uri: getEmployeePhoto(!this.props.service.isFirstAvailable ? this.props.service.employeeId : 0) }}
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
          <Text style={styles.textNormal}>{!this.props.service.isFirstAvailable && this.props.service.employeeFirstName ? `${this.props.service.employeeFirstName} ${this.props.service.employeeLastName}` : 'First Available'}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
      </SalonTouchableOpacity>
    </View>
          </View>);
}
}

// export default queueListItemSummary;

export default connect(null, actions)(queueListItemSummary);
