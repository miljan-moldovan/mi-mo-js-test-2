import * as React from 'react';
import { View, ScrollView, Alert, Dimensions } from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import Icon from '@/components/common/Icon';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import ApptointmentHeader from './components/appointment/header';
import BlockHeader from './components/blockTime/header';
import ApptointmentBtn from './components/appointment/buttons';
import BlockTimeBtn from './components/blockTime/buttons';
import AuditInformation from '../../AuditInformation';
import SalonIcon from '../../SalonIcon';
import { Appointment, ScheduleBlocks } from '../../../utilities/apiWrapper';
import { getSelectedAppt } from '../../../redux/selectors/appointmentSelector';
import styles from './styles';
import InputModal from '../../SalonInputModal';
import ActionSheet from './components/CrossedAppointmentsActionSheet';
import toPeriodFormat from './helpers/toPeriodFormatHelper';
import HeightHelper from './helpers/heightHelper';
import PanelbottomAppt from './components/appointment/panelBottom';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
  checkRestrictionsBlockTime, checkRestrictionsCancelAppt,
  checkRestrictionsEditSchedule, checkRestrictionsModifyAppt,
  checkRestrictionsRoomAssignment, getRestrictions,
} from '@/redux/actions/restrictions';
import { restrictionsDisabledSelector, restrictionsLoadingSelector } from '@/redux/selectors/restrictions';
import { Tasks } from '@/constants/Tasks';

const notImplemented = () => Alert.alert('Not implemented');

const { height } = Dimensions.get('window');
const initialHeightOfHeader = 300;

class SalonCardDetailsSlide extends React.Component<any, any> {
  private slidingPanel: null;
  constructor(props) {
    super(props);
    this.state = {
      isLoadingAudits: false,
      appointment: props.appointment,
      auditAppt: [],
      showEditRemarks: false,
      appointmentHasBeenChanged: false,
      scrollHeight: 0,
      previousHeight: 0,
      defaultPosition: 0,
      headerHeight: 0,
    };
    this.slidingPanel = null;
  }

  componentDidMount() {
    this.getAuditInformation();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.props.getRestrictions();
      this.updateAppointmentState(nextProps.appointment);
    } else if (this.props.visible && nextProps.visible &&
      this.state.appointment && nextProps.appointment
    ) {
      this.updateAppointmentState(nextProps.appointment);
    }
  }

  setMinimumPosition = () => {
    this.slidingPanel.transitionTo(initialHeightOfHeader);
  };

  getAuditInformation = () => {
    const { appointment } = this.state;
    const id = get(appointment, 'id', false);
    if (id) {
      this.setState({ isLoadingAudits: true }, () => {
        if (appointment.isBlockTime) {
          ScheduleBlocks.getBlockAudits(id)
            .then(auditAppt => this.setState({ isLoadingAudits: false, auditAppt }))
            .catch(err => console.warn(err));
        } else {
          Appointment.getApptAudit(id)
            .then(auditAppt => this.setState({ isLoadingAudits: false, auditAppt }))
            .catch(err => console.warn(err));
        }
      });
    }
  };

  get remarksMessage() {
    const {
      client,
      fromTime,
      date,
      employee,
      isBlockTime,
      reason,
    } = this.state.appointment;
    const visitDate = moment(date).format('ddd M/DD ');
    if (isBlockTime) {
      return `Remarks for ${reason.name} Block Time on ${visitDate} ${toPeriodFormat(fromTime)}` +
        ` with ${employee.name} ${employee.lastName.slice(0, 1)}`;
    }
    return `Remarks for ${client.name} ${client.lastName} Appointment on ${visitDate} ${toPeriodFormat(fromTime)}` +
      ` with ${employee.name} ${employee.lastName.slice(0, 1)}`;
  }

  hanleOnDragEnd = (params) => {
    const nextHeight = HeightHelper.getHeightPointFromDragHeight(params);
    const diffBetweenScreenHeightAndWorkHeight = height - this.props.workHeight;
    const newStatePreviousHeight = this.props.workHeight - (nextHeight - diffBetweenScreenHeightAndWorkHeight);

    const config = {
      toValue: nextHeight,
      onAnimationEnd: () => this.setState({
        previousHeight: nextHeight === 0 ? 0 : newStatePreviousHeight,
      }),
    };
    this.slidingPanel.transitionTo(config);

    if (nextHeight === 0) {
      this.hidePanel();
    }
  };

  updateAppointmentState = (appointment) => {
    if (appointment) {
      this.setState({ appointment }, () => {
        this.getAuditInformation();
      });
    }
  };

  hidePanel = () => {
    if (this.state.appointmentHasBeenChanged) {
      this.props.updateAppointments();
    }
    this.props.onHide();
  };

  handleSlideChanged = (index) => {
    this.props.changeAppointment(this.props.crossedAppointments[index]);
  };

  handleActionSheet = () => {
    if (this.actionSheet) {
      this.actionSheet.show();
    }
  };

  handleCancel = () => {
    this.props.goToCancelAppt(this.state.appointment);
  };

  handleCheckin = () => {
    this.props.handleCheckin(this.state.appointment.id, this.state.appointment.date);
  };

  handleCheckout = () => {
    this.props.handleCheckout(this.state.appointment.id);
    this.props.onHide();
  };

  handleModify = () => {
    this.props.handleModify(this.state.appointment.id);
  };

  handleRebook = () => {
    this.props.handleRebook(this.state.appointment);
  };

  handleNewAppt = () => {
    const { selectedFilter, selectedProvider } = this.props;
    const { appointment } = this.state;
    const startTime = moment(appointment.fromTime, 'HH:mm').format('HH:mm A');
    let data = null;
    if (
      selectedFilter === 'providers' ||
      selectedFilter === 'deskStaff' ||
      selectedFilter === 'rebookAppointment'
    ) {
      if (selectedProvider === 'all') {
        data = appointment.employee;
      } else {
        data = appointment.date;
      }
    }
    this.props.handleNewAppt(startTime, data);
  };

  handleRecommendProductPress = () => {
    this.props.navigation.navigate('RecommendProduct', { client: this.state.appointment.client });
    this.hidePanel();
  };

  handleOpenEditRemarks = () => {
    this.setState({ showEditRemarks: true });
  };

  handleOkInEditRemarks = (remarks) => {
    Appointment.putAppointmentRemarks(this.props.appointment.id, remarks)
      .then((response) => {
        if (response.result === 1) {
          const { appointment } = this.state;
          appointment.remarks = remarks;
          this.setState({
            appointmentHasBeenChanged: true,
            appointment,
          }, () => {
            this.props.showToast({
              description: 'Remarks edited',
              type: 'green',
              btnRightText: 'DISMISS',
            });
          });
        }
      })
      .catch(err => console.warn(err));
    this.setState({
      showEditRemarks: false,
    });
  };

  handleShowAppt = () => {
    this.props.goToShowAppt(this.state.appointment.client);
  };

  handleCancelInEditRemarks = () => {
    this.setState({ showEditRemarks: false });
  };

  handleHeaderOnLayout = ({ nativeEvent: { layout: { height } } }) => {
    this.setState({ headerHeight: height });
  };

  assignActionSheet = (item) => {
    this.actionSheet = item;
  };

  renderStart = () => {
    this.setState({ previousHeight: 0 });
  };

  modifyIsDisabled = (appointment) => {
    const isBefore = moment(appointment.date).startOf('day').isBefore(moment().startOf('day'));
    if (isBefore) {
      return true;
    }
    if (appointment && appointment.badgeData) {
      return appointment.badgeData.isNoShow || appointment.badgeData.isCashedOut || false;
    }
    return false;
  };

  cancelIsDisabled = appointment => {
    return appointment && moment(appointment.date).isBefore(moment(), 'day');
  };

  getDefaultHeight = () => {
    if (isIphoneX()) {
      return this.calculateHeight(0.3, 0.35);
    }
    return this.calculateHeight(0.38, 0.44);
  };

  calculateHeight = (firstFactor, secondFactor) => {
    const { crossedAppointments } = this.props;
    return crossedAppointments.length < 2 ? height * firstFactor : height * secondFactor;
  };

  renderHeaderSlide = () => {
    const { crossedAppointments } = this.props;

    const { appointment } = this.state;
    const index = crossedAppointments.indexOf(appointment);
    if (crossedAppointments.length < 2) {
      return (
        <View style={[styles.slidePanelWrapper, {
          zIndex: 9999, height: 20, position: 'absolute', top: 10,
        }]}
        >
          <View style={[styles.swipablePanelIconRight, { marginBottom: 0 }]}>
            <SalonTouchableOpacity onPress={this.hidePanel}>
              <Icon name="timesCircle" size={18} color="#C0C1C6" type="solid" />
            </SalonTouchableOpacity>
          </View>
        </View>);
    }
    return (
      <React.Fragment>
        <View style={styles.slidePanel}>
          <View style={styles.slidePanelWrapper}>
            <React.Fragment>
              <SalonTouchableOpacity
                style={styles.swipablePanelIconLeft}
                onPress={this.handleActionSheet}
              >
                <SalonIcon
                  size={20}
                  icon="barsIcon"
                  style={styles.barsIcon}
                />
              </SalonTouchableOpacity>
              <Swiper
                showsPagination
                index={index}
                onIndexChanged={this.handleSlideChanged}
              >
                {crossedAppointments.map(() => (
                  <View style={styles.crossedAppointmentSliderItem} />
                ))}
              </Swiper>
            </React.Fragment>
            <View style={styles.swipablePanelIconRight}>
              <SalonTouchableOpacity onPress={this.hidePanel}>
                <Icon name="timesCircle" size={18} color="#C0C1C6" type="solid" />
              </SalonTouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.topBorder} />
      </React.Fragment>
    );
  };

  renderHeaderData = () => {
    const { appointment } = this.state;
    if (!appointment) {
      return null;
    }
    return !appointment.isBlockTime ? (
      <ApptointmentHeader
        navigation={this.props.navigation}
        appointment={appointment}
        appointments={this.props.appointments}
      />) : (
      <BlockHeader appointment={appointment} />
    );
  };

  renderHeader = panHendler => (
    <View
      onLayout={this.handleHeaderOnLayout}
      pointerEvents="box-none"
      {...panHendler}
      style={styles.panelTop}
    >
      <SalonTouchableOpacity
        style={styles.panelTopIcon}
        onPress={this.setMinimumPosition}
      >
        <View
          style={styles.topIcon}
        />
      </SalonTouchableOpacity>

      {this.renderHeaderSlide()}

      <View style={styles.headerPanelWithSlider}>
        {this.renderHeaderData()}
      </View>
    </View>
  );

  renderContent = () => {
    const { appointment, auditAppt } = this.state;
    const disabledModify = this.props.modifyApptIsDisabled || this.modifyIsDisabled(appointment);
    const disabledCancel = this.props.cancelApptIsDisabled || this.cancelIsDisabled(appointment);

    return (
      <ScrollView style={{ backgroundColor: '#FFF' }}>
        <View style={styles.panelMiddle}>
          <View style={styles.panelIcons}>
            {
              appointment.isBlockTime
                ? (
                  <BlockTimeBtn
                    handleModify={() => this.props.checkRestrictionsModifyAppt(this.handleModify)}
                    modifyApptIsLoading={this.props.modifyApptIsLoading}
                    handleNewAppt={this.handleNewAppt}
                    handleCancel={() => this.props.checkRestrictionsCancelAppt(this.handleCancel)}
                    cancelApptIsLoading={this.props.cancelApptIsLoading}
                  />
                )
                : (
                  <ApptointmentBtn
                    appointment={appointment}
                    handleCheckin={this.handleCheckin}
                    handleCheckout={this.handleCheckout}
                    modifyApptIsLoading={this.props.modifyApptIsLoading}
                    handleModify={() => this.props.checkRestrictionsModifyAppt(this.handleModify)}
                    disabledModify={disabledModify}
                    handleCancel={() => this.props.checkRestrictionsCancelAppt(this.handleCancel)}
                    cancelApptIsLoading={this.props.cancelApptIsLoading}
                    disabledCancel={disabledCancel}
                  />
                )
            }
          </View>
          <View style={styles.auditContainer}>
            <AuditInformation
              audit={auditAppt}
              isLoading={this.state.isLoadingAudits}
            />
          </View>
        </View>
        {!appointment.isBlockTime ?
          <PanelbottomAppt
            handleOpenEditRemarks={this.handleOpenEditRemarks}
            handleShowAppt={this.handleShowAppt}
            handleRecommendProductPress={this.handleRecommendProductPress}
            handleNewAppt={this.handleNewAppt}
            handleRebook={this.handleRebook}
            handleEmailClient={notImplemented}
            handleSMSClient={notImplemented}
          /> : null}
        <InputModal
          visible={this.state.showEditRemarks}
          placeholder="Please enter remarks"
          onPressOk={this.handleOkInEditRemarks}
          onPressCancel={this.handleCancelInEditRemarks}
          description={this.remarksMessage}
          title="Edit Appointment Remarks"
          value={appointment.remarks}
        />
      </ScrollView>
    );
  };

  render() {
    const defaultHeight = this.getDefaultHeight();
    return (
      <SlidingUpPanel
        visible={this.props.visible}
        onRequestClose={this.hidePanel}
        showBackdrop={false}
        allowMomentum={false}
        renderDraggableHeader={this.renderHeader}
        onDragEnd={this.hanleOnDragEnd}
        defaultYPosition={defaultHeight}
        onDragStart={this.renderStart}
        height={this.props.workHeight - this.state.previousHeight}
        ref={(slidingPanel) => {
          this.slidingPanel = slidingPanel;
          this.props.getRefsSlidePanel(slidingPanel);
        }}
      >
        {this.state.appointment && this.renderContent()}
        {this.props.crossedAppointments.length > 0 && (
          <ActionSheet
            previousPosition={this.state.previousHeight}
            slidingUpPanelRefs={this.slidingPanel}
            ref={this.assignActionSheet}
            appointments={this.props.crossedAppointments}
            handleOnPress={this.props.changeAppointment}
          />
        )}
      </SlidingUpPanel>
    );
  }
}

const mapActionsToProps = dispatch => ({
  getRestrictions: () => dispatch(getRestrictions([Tasks.Appt_ModifyAppt, Tasks.Appt_Cancel])),
  checkRestrictionsModifyAppt: (callback) => dispatch(checkRestrictionsModifyAppt(callback)),
  checkRestrictionsCancelAppt: (callback) => dispatch(checkRestrictionsCancelAppt(callback)),
});

const mapStateToProps = (state, props) => ({
  appointment: getSelectedAppt(state, props),
  modifyApptIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_ModifyAppt),
  modifyApptIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_ModifyAppt),
  cancelApptIsDisabled: restrictionsDisabledSelector(state, Tasks.Appt_Cancel),
  cancelApptIsLoading: restrictionsLoadingSelector(state, Tasks.Appt_Cancel),
});

export default connect(mapStateToProps, mapActionsToProps)(SalonCardDetailsSlide);
