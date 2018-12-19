// tslint:disable:max-line-length
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { reverse, slice } from 'lodash';
import SalonTouchableOpacity from '../SalonTouchableOpacity';
import styles from './styles';
import AuditInfoItem from '../AuditItem';

export default class AuditInformation extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const { audits, isBlockTime } = this.prepareAudit(props.audit);
    this.state = {
      isOpen: false,
      audit: audits,
      isBlockTime,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.audit) {
      const { audits, isBlockTime } = this.prepareAudit(nextProps.audit);

      this.setState({
        audit: audits,
        isBlockTime,
      });
    }
  }

  prepareAudit = audits => {
    let isBlockTime = false;
    const prepareAudits = audits.map(audit => {
      if (!audit.service) {
        isBlockTime = true;
        return {
          appointmentDate: audit.scheduleBlockDate || '',
          appointmentStartTime: audit.scheduleBlockStartTime || '',
          appointmentEndTime: audit.scheduleBlockEndTime || '',
          auditType: audit.auditType,
          auditDateTime: audit.auditDateTime || '',
          auditEmployee: audit.auditEmployee ? audit.auditEmployee.name : '',
        };
      }
      return {
        appointmentDate: audit.appointmentDate || '',
        appointmentStartTime: audit.appointmentStartTime || '',
        appointmentEndTime: audit.appointmentEndTime || '',
        provider: audit.provider ? audit.provider.name : '',
        service: audit.service ? audit.service.name : '',
        auditType: audit.auditType,
        auditDateTime: audit.auditDateTime || '',
        auditEmployee: audit.auditEmployee ? audit.auditEmployee.name : '',
      };
    });
    return { audits: reverse(prepareAudits), isBlockTime };
  };

  renderAuditInfo = (audit, isBlockTime, isOpen) => {
    let auditToRender = audit;
    if (!isOpen && !this.props.isLoading && audit && audit.length > 1) {
      auditToRender = slice(auditToRender, 0, 1);
    }
    return auditToRender.map(item => (
      <AuditInfoItem key={Math.random()} singleAudit={item} isBlockTime={isBlockTime} />
    ));
  };

  render() {
    const { isBlockTime, isOpen, audit } = this.state;

    return this.props.isLoading ?
      (
        <View style={styles.spinner}>
          <ActivityIndicator />
        </View>
      )
    :
      (
        <React.Fragment>
          <View style={[styles.panelInfo, isOpen ? {} : { maxHeight: 230, minHeight: 55 }]}>
            {this.renderAuditInfo(audit, isBlockTime, isOpen)}
          </View>
          {audit.length > 1 &&
            (
              <SalonTouchableOpacity
                style={styles.panelInfoShowMore}
                onPress={() => {
                  this.setState({ isOpen: !this.state.isOpen });
                }}
              >
                <Text style={styles.panelInfoShowMoreText}>
                  {this.state.isOpen ? 'SHOW LESS' : 'SHOW MORE'}
                </Text>
              </SalonTouchableOpacity>
            )
          }
        </React.Fragment>
    );
  }
}
