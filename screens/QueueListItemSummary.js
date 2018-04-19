import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import apiWrapper from '../utilities/apiWrapper';
import * as actions from '../actions/queue';
import SalonAvatar from '../components/SalonAvatar';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  textMedium: {
    fontSize: 14,
    color: '#111415',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  textNormal: {
    fontSize: 14,
    color: '#111415',
    fontFamily: 'Roboto',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  serviceContainer: {
    borderRadius: 4,
    borderColor: 'rgba(195,214,242,0.2)',
    borderWidth: 1,
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 10,
    marginBottom: 3,
    justifyContent: 'center',
    shadowColor: 'rgba(192,192,192,0.9)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    height: 82,
  },
  angleIcon: {
    fontSize: 20,
    color: '#115ECD',
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderColor: 'rgba(195,214,242,0.5)',
  },
  imageContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  providerRound: {
    width: 26,
    marginRight: 14.5,
  },
  firstAvailable: {
    backgroundColor: '#C3D6F2',
    borderRadius: 13,
    height: 26,
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  firstAvailableText: {
    marginLeft: 5,
    color: '#115ECD',
    fontSize: 9,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  avatarDefaultComponent: {
    width: 24,
    height: 24,
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
      console.log(error);
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
      console.log(error);
    });
  }

  handlePressService = (service) => {
    this.props.navigation.navigate('Services', {
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
  this.props.navigation.navigate('Providers', {
    index: 0,
    client: this.props.appointment.client,
    dismissOnSelect: true,
    onChangeProvider: data => this.saveQueueProvider(data),
  });
  this.props.onDonePress();
};
render() {
  return (<View>
    <View style={styles.serviceContainer}>
      <TouchableOpacity onPress={() => this.handlePressService(this.props.service)}>
        <View style={[styles.row, styles.rowBorderBottom]}>
          <Text style={styles.textMedium}>{this.props.service.serviceName}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.handlePressProvider(this.props.service)}>
        <View style={styles.row}>
          <SalonAvatar
            borderColor="#FFFFFF"
            borderWidth={2}
            wrapperStyle={styles.providerRound}
            width={26}
            image={{ uri: apiWrapper.getEmployeePhoto(!this.props.service.isFirstAvailable ? this.props.service.employeeId : 0) }}
            hasBadge
            badgeComponent={
              <FontAwesome style={{ color: '#1DBF12', fontSize: 10 }}>
                {Icons.lock}
              </FontAwesome>}
            defaultComponent={
              <View style={styles.avatarDefaultComponent}>
                <Text style={styles.avatarDefaultComponentText}>{!this.props.service.isFirstAvailable ? `${this.props.service.employeeFirstName[0]}${this.props.service.employeeLastName[0]}` : 'FA'}</Text>
              </View>
}
          />
          <Text style={styles.textNormal}>{!this.props.service.isFirstAvailable ? `${this.props.service.employeeFirstName} ${this.props.service.employeeLastName}` : 'First Available'}</Text>
          <View style={styles.iconContainer}>
            <FontAwesome style={styles.angleIcon}>{Icons.angleRight}</FontAwesome>
          </View>
        </View>
      </TouchableOpacity>
    </View>
          </View>);
}
}

// export default queueListItemSummary;

export default connect(null, actions)(queueListItemSummary);
