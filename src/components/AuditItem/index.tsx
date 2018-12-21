import * as React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { getAuditType, formatDate, formatTime, formatTimeWithMinutes, formatEmployeeName } from './helperFunctions';

const AuditInfoItem = ({ singleAudit, isBlockTime }) => (
  <View style={styles.auditInfo}>
    <Text style={styles.auditInfoHeader}>{getAuditType(singleAudit.auditType)}</Text>
    {isBlockTime
    ?
      (
        <React.Fragment>
          {
            singleAudit.auditDateTime &&
            <Text style={styles.auditInfoText}>
              at {formatDate(singleAudit.auditDateTime)}, {formatTimeWithMinutes(singleAudit.auditDateTime)}
            </Text>
          }
          <Text style={styles.auditDateText}>{formatEmployeeName(singleAudit.auditEmployee)}</Text>
        </React.Fragment>
      )
    :
      (
        <React.Fragment>
          <Text style={styles.auditInfoText}>
            {singleAudit.service || ''} with {formatEmployeeName(singleAudit.provider)} on {
              formatDate(singleAudit.appointmentDate)} at {' '}
            {formatTime(singleAudit.appointmentStartTime)}
          </Text>
          {
            singleAudit.auditDateTime &&
            <Text style={styles.auditDateText}>
              by {formatEmployeeName(singleAudit.auditEmployee)} on {formatDate(singleAudit.auditDateTime)}
            </Text>
          }
        </React.Fragment>
      )
    }
  </View>
);

AuditInfoItem.propTypes = {
  singleAudit: PropTypes.object,
  isBlockTime: PropTypes.bool,
};

export default AuditInfoItem;
