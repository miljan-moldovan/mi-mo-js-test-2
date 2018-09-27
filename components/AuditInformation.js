import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { reverse, slice } from 'lodash';

import SalonTouchableOpacity from './SalonTouchableOpacity';

const AuditType = {
  NULL: -1,
  Normal: 0,
  Change: 1,
  Cancel: 2,
  ReviewWeb: 10,
};

const DateTime = {
  time: 'HH:mm:ss',
  timeOld: 'HH:mm',
  displayTime: 'hh:mm A',
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DDT00:00:00',
  serverDateTime: 'YYYY-MM-DDTHH:mm:ss',
};

const styles = StyleSheet.create({
  panelInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '92%',
    backgroundColor: '#F1F1F1',
    flex: 1,
    marginBottom: 14,
    paddingVertical: 15,
  },
  panelInfoLine: {
    flex: 1,
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  panelInfoTitle: {
    marginTop: 5,
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelInfoText: {
    color: '#3F3F3F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelInfoDate: {
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelInfoShowMoreText: {
    color: '#115ECD',
    fontSize: 10,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  panelInfoShowMore: {
    borderColor: '#CACBCF',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    width: 100,
    position: 'absolute',
    bottom: 12,
  },
});

export default class AuditInformation extends React.Component {
  constructor(props) {
    super(props);
    const prepareData = this.prepareAudit(props.audit);
    this.state = {
      isOpen: false,
      audit: prepareData.audits,
      isBlockTime: prepareData.isBlockTime,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.audit) {
      const prepareData = this.prepareAudit(nextProps.audit);

      this.setState({
        audit: prepareData.audits,
        isBlockTime: prepareData.isBlockTime,
      });
    }
  }

  getAuditType = (auditType) => {
    let type = '';
    switch (auditType) {
      case AuditType.Normal:
        type = 'BOOKED';
        break;
      case AuditType.Change:
        type = 'MODIFIED';
        break;
      case AuditType.Cancel:
        type = 'CANCEL';
        break;
      case AuditType.ReviewWeb:
        type = 'REVIEW-WEB';
        break;
      default:
        type = '--';
    }

    return type;
  };

  prepareAudit = (audits) => {
    let isBlockTime = false;
    const prepareAudits = audits.map((audit) => {
      let oneAudit = null;
      if (!audit.service) {
        isBlockTime = true;
        oneAudit = {
          appointmentDate: audit.scheduleBlockDate || '',
          appointmentStartTime: audit.scheduleBlockStartTime || '',
          appointmentEndTime: audit.scheduleBlockEndTime || '',
          auditType: audit.auditType,
          auditDateTime: audit.auditDateTime || '',
          auditEmployee: audit.auditEmployee ? audit.auditEmployee.name : '',
        };
      } else {
        oneAudit = {
          appointmentDate: audit.appointmentDate || '',
          appointmentStartTime: audit.appointmentStartTime || '',
          appointmentEndTime: audit.appointmentEndTime || '',
          provider: audit.provider ? audit.provider.name : '',
          service: audit.service ? audit.service.name : '',
          auditType: audit.auditType,
          auditDateTime: audit.auditDateTime || '',
          auditEmployee: audit.auditEmployee ? audit.auditEmployee.name : '',
        };
      }
      return oneAudit;
    });
    return { audits: reverse(prepareAudits), isBlockTime };
  };

  formatDate = date => moment(date, DateTime.date).format('MM/DD/YYYY');

  formatTime = time => moment(time, DateTime.time).format(DateTime.displayTime);

  formatTimeWithMinutes = time =>
    moment(time, DateTime.serverDateTime).format(DateTime.displayTime);

  formatEmployeeName = (employee) => {
    if (!employee) {
      return '';
    }
    const splitName = employee.split(' ');
    switch (splitName.length) {
      case 0:
        return '';
      case 1:
        return splitName[0];
      case 2:
        return `${splitName[0]} ${splitName[1][0]}`;
      default:
        return `${splitName[0]} ${splitName[2][0]}`;
    }
  };

  renderAuditInfo = (audit, isBlockTime, isOpen) => {
    let auditToRender = audit;
    if (!isOpen && !this.props.isLoading && audit && audit.length > 1) {
      auditToRender = slice(auditToRender, 0, 1);
    }
    return auditToRender.map(item => (
      <View key={Math.random()} style={[styles.panelInfoLine, { paddingTop: 5 }]}>
        <Text style={styles.panelInfoTitle}>{this.getAuditType(item.auditType)}</Text>
        {isBlockTime
          ? [
            <Text style={styles.panelInfoText}>
                at {this.formatDate(item.auditDateTime)},{' '}
              {item.auditDateTime ? ` ${this.formatTimeWithMinutes(item.auditDateTime)} ` : ''}
            </Text>,
            <Text style={styles.panelInfoDate}>
              {this.formatEmployeeName(item.auditEmployee)}
            </Text>,
            ]
          : [
            <Text style={styles.panelInfoText}>
              {item.service || ''} with {this.formatEmployeeName(item.provider)} on{' '}
              {this.formatDate(item.appointmentDate)} at{' '}
              {this.formatTime(item.appointmentStartTime)}
            </Text>,
            <Text style={styles.panelInfoDate}>
                by {this.formatEmployeeName(item.auditEmployee)} on{' '}
              {item.auditDateTime ? this.formatDate(item.auditDateTime) : ''}
            </Text>,
            ]}
      </View>
    ));
  };

  render() {
    const { isBlockTime, isOpen } = this.state;
    const { audit } = this.state;
    return this.props.isLoading ? (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    ) : (
      [
        <View style={[styles.panelInfo, isOpen ? {} : { maxHeight: 230 }]}>
          {this.renderAuditInfo(audit, isBlockTime, isOpen)}
        </View>,
        <SalonTouchableOpacity
          style={styles.panelInfoShowMore}
          onPress={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <Text style={styles.panelInfoShowMoreText}>
            {this.state.isOpen ? 'SHOW LESS' : 'SHOW MORE'}
          </Text>
        </SalonTouchableOpacity>,
      ]
    );
  }
}
