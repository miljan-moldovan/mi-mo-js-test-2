import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import apiWrapper from '../utilities/apiWrapper';

import SalonAvatar from '../components/SalonAvatar';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 39.5,
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
    borderColor: 'rgba(195,214,242,0.5)',
    borderWidth: 1,
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 10,
    marginBottom: 5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    height: 80,
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
});


class queueListItemSummary extends React.Component {
  handlePressService = (service) => {
    this.props.navigation.navigate('Service', {
      service,
      index: 0,
      client: this.props.appointment.client,
      dismissOnSelect: true,
      // onChangeService: data => this.handleServiceSelection(data),
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
        <TouchableOpacity onPress={() => this.handlePressService(this.props.service)}>
          <View style={styles.row}>
            <SalonAvatar
              wrapperStyle={styles.providerRound}
              width={26}
              image={{ uri: apiWrapper.getEmployeePhoto(!this.props.service.isFirstAvailable ? this.props.service.employeeId : 0) }}
              hasBadge
              badgeComponent={
                <FontAwesome style={{ color: '#1DBF12', fontSize: 10 }}>
                  {Icons.lock}
                </FontAwesome>}
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

export default queueListItemSummary;
