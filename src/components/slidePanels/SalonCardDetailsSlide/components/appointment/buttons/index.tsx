import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SalonTouchableOpacity from '../../../../../SalonTouchableOpacity';
import Icon from '@/components/common/Icon';
import ApptQueueStatus from '../../../../../../constants/apptQueueStatus';
import styles from './styles';

const appointmentButtons = (props) => {
  const {
    isCheckInDisabled, isCheckOutDisabled, isCheckingIn,
    isCheckingOut, handleCheckin, handleCheckout, handleModify, handleCancel,
    disabledModify, disabledCancel,
  } = props;

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
          onPress={handleCheckout}
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
          <Icon name="calendarO" size={18} color="#FFFFFF" type="solid" />
          <View style={styles.plusIconContainer}>
            <Icon
              name="times"
              size={9}
              color="#FFFFFF"
              type="solid"
            />
          </View>
        </SalonTouchableOpacity>
        <Text style={styles.panelIconText}>Cancel Appt.</Text>
      </View>
      <View style={styles.panelIcon}>
        <SalonTouchableOpacity
          disabled={disabledModify}
          style={disabledModify ? styles.panelIconBtnDisabled : styles.panelIconBtn}
          onPress={handleModify}
        >
          <Icon name="penAlt" size={18} color="#FFFFFF" type="solid" />
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
      || appointment.queueStatus !== ApptQueueStatus.NotInQueue || appointment.isNoShow,
    isCheckOutDisabled: state.appointmentReducer.isCheckingOut ||
      appointment.queueStatus === ApptQueueStatus.CheckedOut
      || appointment.isNoShow || appointment.isFirstAvailable,
  };
};

export default connect(mapStateToProps)(appointmentButtons);
