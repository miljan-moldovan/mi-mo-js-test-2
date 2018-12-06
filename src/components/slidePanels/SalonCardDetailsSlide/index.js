import React from 'react';
import { View, ScrollView } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
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
import InputModal from '../../../components/SalonInputModal';
import ActionSheet from './components/CrossedAppointmentsActionSheet';
import toPeriodFormat from './helpers/toPeriodFormatHelper';
import HeightHelper from './helpers/heightHelper';
import PanelbottomAppt from './components/appointment/panelBottom';

const notImplemented = () => alert('Not implemented');

const headerPaddings = 63;

class SalonCardDetailsSlide extends React.Component {
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
    this.getDefaultPosition();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.updateAppointmentState(nextProps.appointment);
    } else if (this.props.visible && nextProps.visible &&
      this.state.appointment && nextProps.appointment &&
      this.state.appointment.id !== nextProps.appointment.id
    ) {
      this.updateAppointmentState(nextProps.appointment);
    }
  }

  setMinimumPosition = () => {
    this.slidingPanel.transitionTo(this.getDefaultPosition(true));
  }

  setScrollHeight = (height) => {
    requestAnimationFrame(() => {
      this.setState({
        scrollHeight: height,
      });
    });
  }

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
  }

  getDefaultPosition = (shouldBeUpdatedForce) => {
    const forceUpdate = shouldBeUpdatedForce || false;
    const height = HeightHelper.setPositionToMinimalOption();
    if (this.state.defaultPosition === height && !forceUpdate) {
      return this.state.defaultPosition;
    }

    if (this.state.previousHeight !== height) {
      this.setState({
        defaultPosition: height,
        previousHeight: height,
      }, () => {
        this.setScrollHeight(height - this.state.headerHeight - headerPaddings);
      });
    }
    return height;
  }

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
    this.slidingPanel.transitionTo(nextHeight);
    if (nextHeight === 0) {
      this.hidePanel();
    }

    if (this.state.previousHeight !== nextHeight) {
      this.setState({
        previousHeight: nextHeight,
      }, () => {
        this.setScrollHeight(nextHeight - this.state.headerHeight - headerPaddings);
      });
    }
  }

  updateAppointmentState = (appointment) => {
    if (appointment) {
      this.setState({ appointment }, () => {
        this.getAuditInformation();
      });
    }
  }

  hidePanel = () => {
    if (this.state.appointmentHasBeenChanged) {
      this.props.updateAppointments();
    }
    this.props.onHide();
  };

  handleSlideChanged = (index) => {
    this.props.changeAppointment(this.props.crossedAppointments[index]);
  }

  handleActionSheet = () => {
    if (this.actionSheet) {
      this.actionSheet.show();
    }
  }

  handleCancel = () => {
    this.props.goToCancelAppt(this.state.appointment);
  }

  handleCheckin = () => {
    this.props.handleCheckin(this.state.appointment.id, this.state.appointment.date);
  }

  handleCheckout = () => {
    this.props.handleCheckout(this.state.appointment.id);
  }

  handleModify = () => {
    this.props.handleModify(this.state.appointment.id);
  }

  handleRebook = () => {
    this.props.handleRebook(this.state.appointment);
  }

  handleNewAppt = () => {
    const { selectedFilter, selectedProvider } = this.props;
    const { appointment } = this.state
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
  }

  handleRecommendProductPress = () => {
    this.props.navigation.navigate('RecommendProduct', { client: this.state.appointment.client });
    this.hidePanel();
  }

  handleOpenEditRemarks = () => {
    this.setState({ showEditRemarks: true });
  }

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
  }

  handleShowAppt = () => {
    this.props.goToShowAppt(this.state.appointment.client);
  }

  handleCancelInEditRemarks = () => {
    this.setState({ showEditRemarks: false });
  }

  handleHeaderOnLayout = ({ nativeEvent: { layout: { height } } }) => {
    if (!this.state.headerHeight || this.state.headerHeight !== height) {
      this.setState({ headerHeight: height }, () =>
        this.setScrollHeight(this.state.defaultPosition - height - headerPaddings));
    }
  }

  assignActionSheet = (item) => {
    this.actionSheet = item;
  }

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
  }

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
  }

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
    return (
      <View style={{ flex: 1 }}>
        <InputModal
          visible={this.state.showEditRemarks}
          placeholder="Please enter remarks"
          onPressOk={this.handleOkInEditRemarks}
          onPressCancel={this.handleCancelInEditRemarks}
          description={this.remarksMessage}
          title="Edit Appointment Remarks"
          value={appointment.remarks}
        />
        <View style={styles.panelContainer}>
          <View style={{ height: this.state.scrollHeight }}>
            <ScrollView>
              <View style={styles.panelMiddle}>
                <View style={styles.panelIcons}>
                  {appointment.isBlockTime ? (
                    <BlockTimeBtn
                      handleModify={this.handleModify}
                      handleNewAppt={this.handleNewAppt}
                      handleCancel={this.handleCancel}
                    />) : (<ApptointmentBtn
                      appointment={appointment}
                      handleCheckin={this.handleCheckin}
                      handleCheckout={this.handleCheckout}
                      handleModify={this.handleModify}
                      handleCancel={this.handleCancel}
                    />)}
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
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <SlidingUpPanel
        visible={this.props.visible}
        onRequestClose={this.hidePanel}
        showBackdrop={false}
        allowMomentum={false}
        renderDraggableHeader={this.renderHeader}
        onDragEnd={this.hanleOnDragEnd}
        defaultYPosition={this.state.defaultPosition}
        ref={(slidingPanel) => { this.slidingPanel = slidingPanel; }}
      >
        {this.state.appointment && this.renderContent()}
        {this.props.crossedAppointments.length > 0 && (
          <ActionSheet
            ref={this.assignActionSheet}
            appointments={this.props.crossedAppointments}
            handleOnPress={this.props.changeAppointment}
          />
        )}
      </SlidingUpPanel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  appointment: getSelectedAppt(state, props),
});

export default connect(mapStateToProps)(SalonCardDetailsSlide);
