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
  saveQueueService = (service, serviceEmployeeId) => {
    this.props.putQueueServiceEmployeeService(this.props.appointment.id, serviceEmployeeId, {
      newServiceId: service.id,
    }, this.props.loadQueueData);
  }

  saveQueueProvider = (provider, serviceEmployeeId) => {
    this.props.putQueueServiceEmployeeEmployee(this.props.appointment.id, serviceEmployeeId, {
      newEmployeeId: 'isFirstAvailable' in provider ? null : provider.id,
      isFirstAvailable: provider.isFirstAvailable,
    }, () => {
      this.props.loadQueueData();
      this.props.showDialog();
    });
  }

  handlePressService = (service) => {
    this.props.navigation.navigate('ModalServices', {
      service,
      index: 0,
      client: this.props.appointment.client,
      employeeId: service.employeeId,
      dismissOnSelect: true,
      hasCategories: false,
      mode: 'quickQueue',
      queueItem: this.props.item,
      onChangeService: data => this.saveQueueService(data, service.id),
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
      this.props.showDialog();
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
      showFirstAvailable: !!this.props.isWaiting,
      dismissOnSelect: true,
      selectedProvider: employee,
      checkProviderStatus: true,
      // queueList: true,
      queueItem: item,
      mode: 'quickQueue',
      headerProps: { title: 'Providers', ...this.cancelButton() },
      onChangeProvider: data => this.saveQueueProvider(data, service.id),
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
  isWaiting: PropTypes.bool.isRequired,
  services: PropTypes.any.isRequired,
  service: PropTypes.any.isRequired,
  appointment: PropTypes.any.isRequired,
  client: PropTypes.any.isRequired,
  putQueueServiceEmployeeEmployee: PropTypes.any.isRequired,
  putQueueServiceEmployeeService: PropTypes.any.isRequired,
  onDonePress: PropTypes.any.isRequired,
};


export default connect(null, actions)(queueListItemSummary);
