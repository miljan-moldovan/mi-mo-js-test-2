import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  InputGroup,
  InputButton,
} from '../../../../../formHelpers';
import Icon from '@/components/common/Icon';
import styles from './styles';

const apptPanelBottom = ({
  handleOpenEditRemarks,
  handleShowAppt,
  handleRecommendProductPress,
  handleNewAppt,
  handleRebook,
  handleEmailClient,
  handleSMSClient,
}) => (
  <React.Fragment>
    <View style={styles.panelBottom}>
      <InputGroup
        style={styles.otherOptionsGroup}
      >
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleNewAppt}
          label="New Appointment"
        >
          <View style={styles.iconContainer}>
            <Icon name="calendarO" size={18} color="#115ECD" type="solid" />
            <View style={styles.plusIconContainer}>
              <Icon
                name="plus"
                size={9}
                color="#115ECD"
                type="solid"
              />
            </View>
          </View>
        </InputButton>
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleRebook}
          label="Rebook Appointment"
        >
          <View style={styles.iconContainer}>
            <Icon name="undo" size={18} color="#115ECD" type="solid" />
          </View>
        </InputButton>
      </InputGroup>
    </View>
    <View style={styles.panelBottom}>
      <InputGroup
        style={styles.otherOptionsGroup}
      >
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleOpenEditRemarks}
          label="Edit Remarks"
        >
          <View style={styles.iconContainer}>
            <Icon name="edit" size={18} color="#115ECD" type="solid" />
          </View>
        </InputButton>
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleShowAppt}
          label="Show Apps. (today/future)"
        >
          <View style={styles.iconContainer}>
            <Icon name="calendarO" size={18} color="#115ECD" type="solid" />
            <View style={styles.plusIconContainer}>
              <Icon
                name="search"
                size={9}
                color="#115ECD"
                type="solid"
              />
            </View>
          </View>
        </InputButton>
      </InputGroup>
    </View>
    <View style={styles.panelBottomOf3}>
      <InputGroup
        style={styles.otherOptionsGroup}
      >
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleEmailClient}
          label="Email Client"
        >
          <View style={styles.iconContainer}>
            <Icon name="envelope" size={18} color="#115ECD" type="solid" />
          </View>
        </InputButton>
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleSMSClient}
          label="SMS Client"
        >
          <View style={styles.iconContainer}>
            <Icon name="comments" size={18} color="#115ECD" type="solid" />
          </View>
        </InputButton>
        <InputButton
          noIcon
          style={styles.otherOptionsBtn}
          labelStyle={styles.otherOptionsLabels}
          onPress={handleRecommendProductPress}
          label="Recommended Products"
        >
          <View style={styles.iconContainer}>
            <Icon name="star" size={18} color="#115ECD" type="solid" />
          </View>
        </InputButton>
      </InputGroup>
    </View>
  </React.Fragment>
);

apptPanelBottom.propTypes = {
  handleOpenEditRemarks: PropTypes.func.isRequired,
  handleShowAppt: PropTypes.func.isRequired,
  handleRecommendProductPress: PropTypes.func.isRequired,
  handleNewAppt: PropTypes.func.isRequired,
  handleRebook: PropTypes.func.isRequired,
  handleEmailClient: PropTypes.func.isRequired,
  handleSMSClient: PropTypes.func.isRequired,
};

export default apptPanelBottom;
