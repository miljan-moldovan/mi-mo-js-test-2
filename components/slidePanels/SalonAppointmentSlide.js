import React from 'react';
import { ScrollView, Text, Animated, View, StyleSheet } from 'react-native';
import { get } from 'lodash';

import Icon from './../UI/Icon';
import SalonTouchableOpacity from './../SalonTouchableOpacity';
import ModalBox from './ModalBox';
import { AppointmentTime } from './SalonNewAppointmentSlide';
import {
  InputGroup,
  InputButton,
} from '../../components/formHelpers';
import AuditInformation from '../AuditInformation';

import { Appointment } from '../../utilities/apiWrapper';

const styles = StyleSheet.create({
  modal: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 99991,
  },
  slide: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 99991,
  },
  panel: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  panelContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  panelBlurredSection: {
    backgroundColor: 'transparent',
  },
  panelTopIcon: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 13,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
  },
  panelTop: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 124,
    // paddingVertical: 5,
    paddingBottom: 18,
    borderBottomColor: '#CACBCF',
    borderBottomWidth: 1 / 2,
  },
  panelMiddle: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 200,
    borderBottomColor: '#CACBCF',
    borderBottomWidth: 1 / 2,
  },
  panelBottom: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 133,
    borderBottomColor: '#CACBCF',
    borderBottomWidth: 1 / 2,
  },
  panelFooter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 124,
    borderBottomColor: '#CACBCF',
    borderBottomWidth: 1 / 2,

  },
  panelDiff: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  otherOptionsBtn: { height: 67, paddingRight: 0 },
  otherOptionsLabels: { color: '#115ECD', fontSize: 15 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherOptionsGroup: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
    // paddingHorizontal: 10,
    width: '92%',
    paddingLeft: 0,
  },
  plusIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    // marginTop: 105,
    paddingVertical: 1,
    paddingHorizontal: 2,
    // paddingRight: 0,
  },
  panelIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 105,
  },
  panelIcon: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelIconBtn: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: '#727A8F',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  panelIconText: {
    marginTop: 7,
    color: '#727A8F',
    fontSize: 9,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '92%',
    backgroundColor: '#F1F1F1',
    // minHeight: 200,
    height: 230,
    marginBottom: 14,
  },
  panelInfoLine: {
    // paddingLeft: 30,
    flex: 1,
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '90%',
  },
  panelInfoTitle: {
    marginTop: 5,
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelInfoText: {
    // marginTop: 5,
    color: '#3F3F3F',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelInfoDate: {
    // marginTop: 5,
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelTopLine: {
    // flex: 1,
    // paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '90%',
  },
  panelTopLineLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  panelTopLineRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  panelTopTimeText: {
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    paddingTop: 4,
    paddingLeft: 4,
  },
  panelTopName: {
    color: '#111415',
    fontSize: 16,
    paddingTop: 2,
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'transparent',
  },
  panelTopService: {
    color: '#111415',
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelTopRemarks: {
    color: '#110A24',
    fontSize: 12,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelTopRemarksTitle: {
    color: '#727A8F',
    fontSize: 12,
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

const AdaptableView = ({ isOpen, children }) => (
  isOpen ? <ScrollView>{children}</ScrollView> : <View>{children}</View>
);

export default class SalonAppointmentSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingAudits: false,
      auditAppt: [],
      isOpen: true,
      visible: props.visible,
    };
  }

  componentDidMount() {
    this.getAuditInformation();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    }, this.getAuditInformation);
  }

  getAuditInformation = () => {
    const { appointment } = this.props;
    const id = get(appointment, 'id', false);
    if (id) {
      this.setState({ isLoadingAudits: true }, () => {
        Appointment.getApptAudit(id)
          .then(auditAppt => this.setState({ isLoadingAudits: false, auditAppt }))
          .catch(err => console.warn(err));
      });
    }
  }

  handleCancel = () => {
    this.props.goToCancelAppt(this.props.appointment);
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel = () => this.props.onHide();

  keyExtractor = (item, index) => item.id;

  render() {
    const {
      appointment,
    } = this.props;
    if (appointment === null) {
      return null;
    }
    const {
      client,
      service,
      employee,
    } = appointment;
    const { isOpen, auditAppt } = this.state;

    return this.props.appointment && (
      <ModalBox
        isOpen={this.props.visible}
        coverScreen
        onClosingState={() => this.hidePanel()}
        backdrop
        style={{ flex: 1 }}
      >
        <View
          style={[styles.panel, { flex: 1 }]}
          key={Math.random()}
        >
          <View style={[
              styles.panelBlurredSection,
              { flex: isOpen ? 1 / 15 : 3 / 5 },
            ]}
          />
          <View style={[
            styles.panelContainer,
            { flex: isOpen ? 14 / 15 : 2 / 5 },
          ]}
          >
            <SalonTouchableOpacity
              style={styles.panelTopIcon}
              onPress={() => this.setState({ isOpen: !isOpen })}
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
            <View style={[styles.panelTop, { justifyContent: 'flex-start' }]}>
              <View style={[styles.panelTopLine]}>
                <View style={styles.panelTopLineLeft}>
                  <Text style={styles.panelTopName}>{`${client.name} ${client.lastName}`}</Text>
                  <Icon style={{ paddingLeft: 5 }} name="infoCircle" size={18} color="#115ECD" type="regular" />
                </View>
                <View style={styles.panelTopLineRight}>
                  <SalonTouchableOpacity onPress={() => this.hidePanel()}>
                    <Icon name="timesCircle" size={18} color="#C0C1C6" type="solid" />
                  </SalonTouchableOpacity>
                </View>
              </View>
              <View style={[styles.panelTopLine]}>
                <View style={styles.panelTopLineLeft}>
                  <Text style={styles.panelTopService}>{service.description}</Text>
                </View>
              </View>

              <View style={[styles.panelTopLine]}>
                <View style={styles.panelTopLineLeft}>
                  <AppointmentTime startTime={appointment.fromTime} endTime={appointment.toTime} />
                </View>
              </View>

              {appointment.remarks !== '' && [
                <View style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
                  <View style={styles.panelTopLineLeft}>
                    <Text style={styles.panelTopRemarksTitle}>Remarks</Text>
                  </View>
                </View>,
                <View style={[styles.panelTopLine, { alignItems: 'center', minHeight: 25, backgroundColor: '#F1F1F1' }]}>
                  <View style={[styles.panelTopLineLeft, { paddingLeft: 10 }]}>
                    <Text style={styles.panelTopRemarks}>{appointment.remarks}</Text>
                  </View>
                </View>,
              ]}
            </View>

            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
              <AdaptableView isOpen={isOpen}>
                <SalonTouchableOpacity activeOpacity={1}>
                  <View style={styles.panelMiddle}>
                    <View style={styles.panelIcons}>
                      <View style={styles.panelIcon}>
                        <SalonTouchableOpacity style={styles.panelIconBtn} onPress={() => { alert('Not implemented'); }}>
                          <Icon name="check" size={18} color="#FFFFFF" type="solid" />
                        </SalonTouchableOpacity>
                        <Text style={styles.panelIconText}>Check-In</Text>
                      </View>

                      <View style={styles.panelIcon}>
                        <SalonTouchableOpacity style={styles.panelIconBtn} onPress={() => { alert('Not implemented'); }}>
                          <Icon name="dollar" size={18} color="#FFFFFF" type="solid" />
                        </SalonTouchableOpacity>
                        <Text style={styles.panelIconText}>Check-out</Text>
                      </View>

                      <View style={styles.panelIcon}>
                        <SalonTouchableOpacity style={styles.panelIconBtn} onPress={this.handleCancel}>
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

                      <View style={styles.panelIcon}>
                        <SalonTouchableOpacity style={styles.panelIconBtn} onPress={this.props.handleModify}>
                          <Icon name="penAlt" size={18} color="#FFFFFF" type="solid" />
                        </SalonTouchableOpacity>
                        <Text style={styles.panelIconText}>Modifiy</Text>
                      </View>
                    </View>
                    <View
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
                  <View style={styles.panelBottom}>
                    <InputGroup
                      style={styles.otherOptionsGroup}
                    >
                      {[
                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="New Appointment"
                        >
                          {[<View style={styles.iconContainer}>
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
                            </View>]}
                        </InputButton>,

                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="Rebook Appointment"
                        >
                          {[<View style={styles.iconContainer}><Icon name="undo" size={18} color="#115ECD" type="solid" />
                          </View>]}
                        </InputButton>,
                        ]}
                    </InputGroup>
                  </View>

                  <View style={styles.panelBottom}>
                    <InputGroup
                      style={styles.otherOptionsGroup}
                    >
                      {[
                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="Edit Remarks"
                        >
                          {[<View style={styles.iconContainer}><Icon name="edit" size={18} color="#115ECD" type="solid" />
                            </View>]}
                        </InputButton>,

                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="Show Apps. (today.future)"
                        >
                          {[<View style={styles.iconContainer}>
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
                            </View>]}
                        </InputButton>,
                        ]}
                    </InputGroup>
                  </View>


                  <View style={[styles.panelBottom, { height: 201 }]}>
                    <InputGroup
                      style={styles.otherOptionsGroup}
                    >
                      {[
                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="Email Client"
                        >
                          {[
                            <View style={styles.iconContainer}>
                              <Icon name="envelope" size={18} color="#115ECD" type="solid" />
                            </View>,
                          ]}
                        </InputButton>,
                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="SMS Client"
                        >
                          {[<View style={styles.iconContainer}><Icon name="comments" size={18} color="#115ECD" type="solid" />
                          </View>]}
                        </InputButton>,
                        <InputButton
                          noIcon
                          style={styles.otherOptionsBtn}
                          labelStyle={styles.otherOptionsLabels}
                          onPress={() => { alert('Not implemented'); }}
                          label="Recommended Products"
                        >
                          {[<View style={styles.iconContainer}><Icon name="star" size={18} color="#115ECD" type="solid" />
                          </View>]}
                        </InputButton>,

                        ]}
                    </InputGroup>
                  </View>
                  <View style={styles.panelDiff} />
                </SalonTouchableOpacity>
              </AdaptableView>
            </View>
          </View>
        </View>

      </ModalBox>);
  }
}
