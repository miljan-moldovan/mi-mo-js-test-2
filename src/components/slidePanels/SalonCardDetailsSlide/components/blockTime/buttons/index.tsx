import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import SalonTouchableOpacity from '../../../../../SalonTouchableOpacity';
import Icon from '@/components/common/Icon';
import styles from './styles';

const blockButtons = ({
                        handleNewAppt, handleModify, handleCancel,
                        modifyApptIsLoading, cancelApptIsLoading,
                      }) => (
  <React.Fragment>
    <View style={styles.panelIcon}>
      <SalonTouchableOpacity
        style={styles.panelIconBtn}
        onPress={handleNewAppt}
      >
        <Icon name="plusCircle" size={18} color="#FFFFFF" fontWeight="300" />
      </SalonTouchableOpacity>
      <Text style={styles.panelIconText}>New Appt.</Text>
    </View>
    <View style={styles.panelIcon}>
      <SalonTouchableOpacity
        style={styles.panelIconBtn}
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
      <Text style={styles.panelIconText}>Cancel</Text>
    </View>
    <View style={styles.panelIcon}>
      <SalonTouchableOpacity
        style={styles.panelIconBtn}
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

blockButtons.propTypes = {
  handleModify: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleNewAppt: PropTypes.func.isRequired,
  modifyApptIsLoading: PropTypes.bool,
  cancelApptIsLoading: PropTypes.bool,
};

export default blockButtons;
