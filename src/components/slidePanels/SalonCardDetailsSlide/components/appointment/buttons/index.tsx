import * as React from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SalonTouchableOpacity from '../../../../../SalonTouchableOpacity';
import Icon from '@/components/common/Icon';
import ApptQueueStatus from '../../../../../../constants/apptQueueStatus';
import styles from './styles';

const alertStartServiceFirst = () => Alert.alert('You should first start service');

const appointmentButtons = (props) => {
  const {
    isCheckInDisabled, isCheckOutDisabled, isCheckingIn,
    isCheckingOut, handleCheckin, handleCheckout, handleModify, handleCancel,
    disabledModify, disabledCancel, appointment, modifyApptIsLoading, cancelApptIsLoading,
  } = props;

  const { badgeData } = appointment;

  const { isWaiting } = badgeData;

  const checkOut = isWaiting ? alertStartServiceFirst : handleCheckout;

  return (
    <React.Fragment>
      <View style={styles.panelIcon}>
        <SalonTouchableOpacity
          style={isCheckInDisabled ? styles.panelIconBtnDisabled : styles.panelIconBtn}
          onPress={handleCheckin}
          disabled={isCheckInDisabled}
        >
          {
            isCheckingIn
              ? <ActivityIndicator />
              : <Icon name="check" size={18} color="#FFFFFF" type="solid" />
          }
        </SalonTouchableOpacity>
        <Text style={styles.panelIconText}>Check-In</Text>
      </View>
      <View style={styles.panelIcon}>
        <SalonTouchableOpacity
          disabled={isCheckOutDisabled}
          style={isCheckOutDisabled ? styles.panelIconBtnDisabled : styles.panelIconBtn}
          onPress={checkOut}
        >
          {
            isCheckingOut
              ? <ActivityIndicator />
              : <Icon name="dollar" size={18} color="#FFFFFF" type="solid" />
          }
        </SalonTouchableOpacity>
        <Text style={styles.panelIconText}>Check-out</Text>
      </View>
      <View style={styles.panelIcon}>
        <SalonTouchableOpacity
          disabled={disabledCancel}
          style={disabledCancel ? styles.panelIconBtnDisabled : styles.panelIconBtn}
          onPress={handleCancel}
        >
          {
            cancelApptIsLoading ? <ActivityIndicator /> :
            (
              <React.Fragment>
                <Icon name="calendarO" size={18} color="#FFFFFF" type="solid" />
                <View style={styles.plusIconContainer}>
                  <Icon
                    name="times"
                    size={9}
                    color="#FFFFFF"
                    type="solid"
                  />
                </View>
              </React.Fragment>
            )
          }
        </SalonTouchableOpacity>
        <Text style={styles.panelIconText}>Cancel Appt.</Text>
      </View>
      <View style={styles.panelIcon}>
        <SalonTouchableOpacity
          disabled={disabledModify}
          style={disabledModify ? styles.panelIconBtnDisabled : styles.panelIconBtn}
          onPress={handleModify}
        >
          {
            modifyApptIsLoading ? <ActivityIndicator /> :
              <Icon name="penAlt" size={18} color="#FFFFFF" type="solid" />
          }
        </SalonTouchableOpacity>
        <Text style={styles.panelIconText}>Modifiy</Text>
      </View>
    </React.Fragment>
  );
};

appointmentButtons.propTypes = {
  isCheckInDisabled: PropTypes.bool.isRequired,
  isCheckOutDisabled: PropTypes.bool.isRequired,
  isCheckingIn: PropTypes.bool.isRequired,
  isCheckingOut: PropTypes.bool.isRequired,
  handleCheckin: PropTypes.func.isRequired,
  handleCheckout: PropTypes.func.isRequired,
  handleModify: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  disabledModify: PropTypes.bool,
  disabledCancel: PropTypes.bool,
};

const mapStateToProps = (state, { appointment }) => {

  return {
    isCheckingIn: state.appointmentReducer.isCheckingIn,
    isCheckingOut: state.appointmentReducer.isCheckingOut,
    isGridLoading: state.appointmentBookReducer.isLoading,
    isCheckInDisabled: state.appointmentReducer.isCheckingIn
    || appointment.queueStatus === ApptQueueStatus.CheckedOut ||
    appointment.queueStatus === ApptQueueStatus.Waiting ||
    appointment.isNoShow,
    isCheckOutDisabled: state.appointmentReducer.isCheckingOut ||
      appointment.queueStatus === ApptQueueStatus.CheckedOut ||
      appointment.isNoShow || appointment.isFirstAvailable,
  };
};

export default connect(mapStateToProps)(appointmentButtons);
