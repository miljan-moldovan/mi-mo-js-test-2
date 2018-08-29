import React from 'react';
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { connect } from 'react-redux';

import Icon from '../../UI/Icon';
import SalonTouchableOpacity from '../../SalonTouchableOpacity';
import { AppointmentTime } from '../SalonNewAppointmentSlide';
import {
  InputGroup,
  InputButton,
} from '../../formHelpers';
import AuditInformation from '../../AuditInformation';

import { Appointment } from '../../../utilities/apiWrapper';
import ApptQueueStatus from '../../../constants/apptQueueStatus';
import { getSelectedAppt } from '../../../redux/selectors/appointmentSelector';

import styles from './styles';
import InputModal from '../../../components/SalonInputModal';
import SuccessModal from './components/SuccessModal';

import toPeriodFormat from './helpers/toPeriodFormatHelper';
import HeightHelper from './helpers/heightHelper';

class SalonAppointmentSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingAudits: false,
      appointment: props.appointment,
      auditAppt: [],
      showEditRemarks: false,
      showEditRemarksSuccess: false,
      appointmentHasBeenChanged: false,
      scrollHeight: 0,
      headerHeight: 0,
      previousHeight: 0,
      defaultPosition: 0,
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

  get remarksMessage() {
    const {
      client,
      fromTime,
      date,
      employee,
    } = this.state.appointment;
    const visitDate = moment(date).format('ddd M/DD ');

    return `Remarks for ${client.name} ${client.lastName} Appointment on ${visitDate} ${toPeriodFormat(fromTime)}` +
      ` with ${employee.name} ${employee.lastName.slice(0, 1)}`;
  }

  getAuditInformation = () => {
    const { appointment } = this.state;
    const id = get(appointment, 'id', false);
    if (id) {
      this.setState({ isLoadingAudits: true }, () => {
        Appointment.getApptAudit(id)
          .then(auditAppt => this.setState({ isLoadingAudits: false, auditAppt }))
          .catch(err => console.warn(err));
      });
    }
  }

  setMinimumPosition = () => {
    this.slidingPanel.transitionTo(this.getDefaultPosition(true));
  }

  handleCancel = () => {
    this.props.goToCancelAppt(this.props.appointment);
  }

  handleCheckin = () => {
    this.props.handleCheckin(this.props.appointment.id);
  }

  handleCheckout = () => {
    this.props.handleCheckout(this.props.appointment.id);
  }

  hidePanel = () => {
    if (this.state.appointmentHasBeenChanged) {
      this.props.updateAppointments();
    }
    this.props.onHide();
  };

  keyExtractor = item => item.id;

  goToClientInfo = (client) => {
    this.props.navigation.navigate('ClientInfo', { client });
    this.hidePanel();
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
        this.setScrollHeight(height - this.state.headerHeight);
      });
    }
    return height;
  }

  hideShowEditRemarksSuccess = () => {
    this.setState({ showEditRemarksSuccess: false });
  }

  handelOpenEditRemarks = () => {
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
            showEditRemarksSuccess: true,
          });
        }
      })
      .catch(err => console.warn(err));
    this.setState({
      showEditRemarks: false,
    });
  }

  handleCancelInEditRemarks = () => {
    this.setState({ showEditRemarks: false });
  }

  handleShowAppt = () => {
    this.props.goToShowAppt(this.props.appointment.client);
  }

  handleHeaderOnLayout = ({ nativeEvent: { layout: { height } } }) => {
    const previousHeaderHeight = this.state.headerHeight;
    if (this.state.headerHeight !== height) {
      this.setState({
        headerHeight: height,
      }, () => {
        if (previousHeaderHeight === 0 && this.state.previousHeight !== 0) {
          this.setScrollHeight(this.state.previousHeight - height);
        }
      });
    }
  }

  setScrollHeight = (height) => {
    requestAnimationFrame(() => {
      this.setState({
        scrollHeight: height,
      });
    });
  }

  updateAppointmentState = (appointment) => {
    if (appointment) {
      this.setState({ appointment }, () => {
        this.getAuditInformation();
      });
    }
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
        this.setScrollHeight(nextHeight - this.state.headerHeight);
      });
    }
  }

  handleRecommendProductPress = () => {
    this.props.navigation.navigate('RecommendProduct', { client: this.state.appointment.client });
    this.hidePanel();
  }

  renderHeader = (panHendler) => {
    const { appointment } = this.state;

    return (
      <View
        {...panHendler}
        key={Math.random()}
        style={[styles.panelTop, { justifyContent: 'flex-start' }]}
        onLayout={this.handleHeaderOnLayout}
      >
        <SalonTouchableOpacity
          style={styles.panelTopIcon}
          onPress={this.setMinimumPosition}
        >
          <View
            style={{
              height: 5,
              width: 36,
              opacity: 0.2,
              borderRadius: 5 / 2,
              backgroundColor: '#000000',
            }}
          />
        </SalonTouchableOpacity>
        <View key={Math.random()} style={[styles.panelTopLine]}>
          <View style={styles.panelTopLineLeft} key={Math.random()}>
            <Text style={styles.panelTopName}>{`${appointment.client.name} ${appointment.client.lastName}`}</Text>
            <SalonTouchableOpacity
              onPress={() => this.goToClientInfo(appointment.client)}
            >
              <Icon style={{ paddingLeft: 5 }} name="infoCircle" size={18} color="#115ECD" type="regular" />
            </SalonTouchableOpacity>
          </View>
          <View key={Math.random()} style={styles.panelTopLineRight}>
            <SalonTouchableOpacity onPress={this.hidePanel}>
              <Icon name="timesCircle" size={18} color="#C0C1C6" type="solid" />
            </SalonTouchableOpacity>
          </View>
        </View>
        <View key={Math.random()} style={[styles.panelTopLine]}>
          <View key={Math.random()} style={styles.panelTopLineLeft}>
            <Text style={styles.panelTopService}>{appointment.service.description}</Text>
          </View>
        </View>

        <View key={Math.random()} style={[styles.panelTopLine]}>
          <View key={Math.random()} style={styles.panelTopLineLeft}>
            <AppointmentTime startTime={appointment.fromTime} endTime={appointment.toTime} />
          </View>
        </View>

        {appointment.remarks !== '' &&
        <React.Fragment>
          <View key={Math.random()} style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
            <View style={styles.panelTopLineLeft}>
              <Text style={styles.panelTopRemarksTitle}>Remarks</Text>
            </View>
          </View>
          <View key={Math.random()} style={[styles.panelTopLine, { alignItems: 'center', minHeight: 25, backgroundColor: '#F1F1F1' }]}>
            <View style={[styles.panelTopLineLeft, { paddingLeft: 10 }]}>
              <Text style={styles.panelTopRemarks}>{appointment.remarks}</Text>
            </View>
          </View>
        </React.Fragment>
        }
      </View>
    );
  }


  renderContent = () => {
    const { appointment, auditAppt } = this.state;
    const {
      isCheckingIn,
      isCheckingOut,
      isGridLoading,
    } = this.props;

    const {
      client,
      service,
      employee,
      isNoShow,
      queueStatus,
    } = appointment;

    const isCheckInDisabled = (isGridLoading || isCheckingIn
      || queueStatus !== ApptQueueStatus.NotInQueue || isNoShow);
    const isCheckOutDisabled = (isGridLoading || isCheckingOut
      || queueStatus === ApptQueueStatus.CheckedOut || isNoShow);

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
        <SuccessModal
          text="Remarks Edited"
          show={this.state.showEditRemarksSuccess}
          hide={this.hideShowEditRemarksSuccess}
        />
        <View
          key={Math.random()}
          style={[
            styles.panelContainer,
            { flex: 1 },
          ]}
        >
          <View
            style={{
              height: this.state.scrollHeight,
              backgroundColor: '#FFFFFF',
            }}
          >
            <ScrollView>
              <View style={styles.panelMiddle}>
                <View style={styles.panelIcons}>
                  <View style={styles.panelIcon}>
                    <SalonTouchableOpacity
                      style={isCheckInDisabled ?
                        styles.panelIconBtnDisabled : styles.panelIconBtn}
                      onPress={this.handleCheckin}
                      disabled={isCheckInDisabled}
                    >
                      { isCheckingIn ?
                        <ActivityIndicator />
                        :
                        <Icon name="check" size={18} color="#FFFFFF" type="solid" />
                      }
                    </SalonTouchableOpacity>
                    <Text style={styles.panelIconText}>Check-In</Text>
                  </View>

                  <View key={Math.random()} style={styles.panelIcon}>
                    <SalonTouchableOpacity
                      disabled={isCheckOutDisabled}
                      style={isCheckOutDisabled ?
                        styles.panelIconBtnDisabled : styles.panelIconBtn}
                      onPress={this.handleCheckout}
                    >
                      { isCheckingOut ?
                        <ActivityIndicator />
                        :
                        <Icon name="dollar" size={18} color="#FFFFFF" type="solid" />
                      }
                    </SalonTouchableOpacity>
                    <Text style={styles.panelIconText}>Check-out</Text>
                  </View>
                  <View key={Math.random()} style={styles.panelIcon}>
                    <SalonTouchableOpacity
                      style={styles.panelIconBtn}
                      onPress={this.handleCancel}
                    >
                      <Icon name="calendarO" size={18} color="#FFFFFF" type="solid" />
                      <View style={[
                        styles.plusIconContainer,
                        { top: 19, backgroundColor: '#727A8F' },
                      ]}
                      >
                        <Icon
                          style={styles.subIcon}
                          name="times"
                          size={9}
                          color="#FFFFFF"
                          type="solid"
                        />
                      </View>
                    </SalonTouchableOpacity>
                    <Text style={styles.panelIconText}>Cancel Appt.</Text>
                  </View>
                  <View key={Math.random()} style={styles.panelIcon}>
                    <SalonTouchableOpacity
                      style={styles.panelIconBtn}
                      onPress={this.props.handleModify}
                    >
                      <Icon name="penAlt" size={18} color="#FFFFFF" type="solid" />
                    </SalonTouchableOpacity>
                    <Text style={styles.panelIconText}>Modifiy</Text>
                  </View>
                </View>
                <View
                  key={Math.random()}
                  style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    // justifyContent: 'center',
                  }}
                >
                  <AuditInformation
                    audit={auditAppt}
                    isLoading={this.state.isLoadingAudits}
                  />
                </View>
              </View>
              <View key={Math.random()} style={styles.panelBottom}>
                <InputGroup
                  style={styles.otherOptionsGroup}
                >
                  <InputButton
                    noIcon
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={() => { alert('Not implemented'); }}
                    label="New Appointment"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="calendarO" size={18} color="#115ECD" type="solid" />
                      <View style={styles.plusIconContainer}>
                        <Icon
                          style={styles.subIcon}
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
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={() => { alert('Not implemented'); }}
                    label="Rebook Appointment"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="undo" size={18} color="#115ECD" type="solid" />
                    </View>
                  </InputButton>
                </InputGroup>
              </View>
              <View key={Math.random()} style={styles.panelBottom}>
                <InputGroup
                  key={Math.random()}
                  style={styles.otherOptionsGroup}
                >
                  <InputButton
                    noIcon
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={this.handelOpenEditRemarks}
                    label="Edit Remarks"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="edit" size={18} color="#115ECD" type="solid" />
                    </View>
                  </InputButton>
                  <InputButton
                    noIcon
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={this.handleShowAppt}
                    label="Show Apps. (today.future)"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="calendarO" size={18} color="#115ECD" type="solid" />
                      <View style={styles.plusIconContainer}>
                        <Icon
                          style={styles.subIcon}
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
              <View key={Math.random()} style={[styles.panelBottom, { height: 201 }]}>
                <InputGroup
                  key={Math.random()}
                  style={styles.otherOptionsGroup}
                >
                  <InputButton
                    noIcon
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={() => { alert('Not implemented'); }}
                    label="Email Client"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="envelope" size={18} color="#115ECD" type="solid" />
                    </View>
                  </InputButton>
                  <InputButton
                    noIcon
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={() => { alert('Not implemented'); }}
                    label="SMS Client"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="comments" size={18} color="#115ECD" type="solid" />
                    </View>
                  </InputButton>
                  <InputButton
                    noIcon
                    key={Math.random()}
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={this.handleRecommendProductPress}
                    label="Recommended Products"
                  >
                    <View style={styles.iconContainer}>
                      <Icon name="star" size={18} color="#115ECD" type="solid" />
                    </View>
                  </InputButton>
                </InputGroup>
              </View>
              <View key={Math.random()} style={styles.panelDiff} />
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {
      appointment,
    } = this.state;

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
        {appointment && this.renderContent()}
      </SlidingUpPanel>
    );
  }
}

const mapStateToProps = (state, props) => ({
  appointment: getSelectedAppt(state, props),
  isCheckingIn: state.appointmentReducer.isCheckingIn,
  isCheckingOut: state.appointmentReducer.isCheckingOut,
  isGridLoading: state.appointmentBookReducer.isLoading,
});

SalonAppointmentSlide.defaultProps = {
  appointment: null,
};

SalonAppointmentSlide.propTypes = {
  updateAppointments: PropTypes.func.isRequired,
  handleModify: PropTypes.func.isRequired,
  appointment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    client: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }),
  onHide: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  goToCancelAppt: PropTypes.func.isRequired,
  goToShowAppt: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(SalonAppointmentSlide);
