import React from 'react';
import { ScrollView, Text, Animated, View, StyleSheet } from 'react-native';
import Icon from './../UI/Icon';
import SalonTouchableOpacity from './../SalonTouchableOpacity';


import SlidingUpPanel from 'rn-sliding-up-panel';
import Modal from 'react-native-modal';

import {
  InputGroup,
  InputButton,
} from '../../components/formHelpers';

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
    flex: 1,
  },
  panelContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  panelBlurredSection: {
    height: 47,
    backgroundColor: 'transparent',
  },
  panelTopIcon: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    height: 355,
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
    paddingTop: 5,
    paddingRight: 0,
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
    fontSize: 18,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  panelTopService: {
    color: '#111415',
    fontSize: 12,
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

export default class SalonAppointmentSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  state:{
    visible: false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel = () => {
    this.setState({ visible: false });
    this.props.onHide();
  }

  keyExtractor = (item, index) => item.id;

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        style={styles.modal}
      >
        <SlidingUpPanel
          showBackdrop={false}
          visible={this.state.visible}
          style={styles.slide}
          onRequestClose={() => this.setState({ visible: false })}
          allowDragging={false}
        >
          <View style={styles.panel} key={Math.random()}>
            <View style={styles.panelBlurredSection} />
            <View style={styles.panelContainer}>
              <SalonTouchableOpacity style={styles.panelTopIcon} onPress={() => this.setState({ visible: false })}>
                <Icon name="minus" size={45} color="#CCCCCC" type="solid" />
              </SalonTouchableOpacity>
              <View style={styles.panelTop}>
                <View style={[styles.panelTopLine, { flex: 1 }]}>
                  <View style={styles.panelTopLineLeft}>
                    <Text style={styles.panelTopName}>Francis Perci</Text>
                    <Icon style={{ paddingLeft: 5 }} name="infoCircle" size={18} color="#115ECD" type="solid" />
                  </View>
                  <View style={styles.panelTopLineRight}>
                    <SalonTouchableOpacity onPress={() => this.setState({ visible: false })}>
                      <Icon name="timesCircle" size={18} color="#C0C1C6" type="solid" />
                    </SalonTouchableOpacity>
                  </View>
                </View>
                <View style={[styles.panelTopLine, { flex: 1 }]}>
                  <View style={styles.panelTopLineLeft}>
                    <Text style={styles.panelTopService}>Pedicure</Text>
                  </View>
                </View>

                <View style={[styles.panelTopLine, { flex: 1 }]}>
                  <View style={styles.panelTopLineLeft}>
                    <Icon style={{ paddingTop: 4 }} name="clockO" size={12} color="#AAB3BA" type="solid" />
                    <Text style={styles.panelTopTimeText}>
                      {'11:00 AM > 11:15 AM'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.panelTopLine, { alignItems: 'flex-end' }]}>
                  <View style={styles.panelTopLineLeft}>
                    <Text style={styles.panelTopRemarksTitle}>Remarks</Text>
                  </View>
                </View>

                <View style={[styles.panelTopLine, { alignItems: 'center', height: 25, backgroundColor: '#F1F1F1' }]}>
                  <View style={[styles.panelTopLineLeft, { paddingLeft: 10 }]}>
                    <Text style={styles.panelTopRemarks}>Text of remarks goes here</Text>
                  </View>
                </View>
              </View>

              <View style={{ height: 600, backgroundColor: '#FFFFFF' }}>
                <ScrollView >
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
                          <SalonTouchableOpacity style={styles.panelIconBtn} onPress={() => { alert('Not implemented'); }}>
                            <Icon name="calendarO" size={18} color="#FFFFFF" type="solid" />
                            <View style={styles.plusIconContainer}>
                              <Icon
                                style={styles.subIcon}
                                name="plus"
                                size={9}
                                color="#FFFFFF"
                                type="solid"
                              />
                            </View>
                          </SalonTouchableOpacity>
                          <Text style={styles.panelIconText}>Cancel Appt.</Text>
                        </View>

                        <View style={styles.panelIcon}>
                          <SalonTouchableOpacity style={styles.panelIconBtn} onPress={() => { alert('Not implemented'); }}>
                            <Icon name="penAlt" size={18} color="#FFFFFF" type="solid" />
                          </SalonTouchableOpacity>
                          <Text style={styles.panelIconText}>Modifiy</Text>
                        </View>
                      </View>
                      <View style={styles.panelInfo}>
                        <View style={[styles.panelInfoLine, { paddingTop: 5 }]}>
                          <Text style={styles.panelInfoTitle}>BOOKED</Text>
                          <Text style={styles.panelInfoText}>Womans haircut with Susan A. on 04/04 at 9AM</Text>
                          <Text style={styles.panelInfoDate}>by jada C on 04/02 at 7:58Am</Text>
                        </View>

                        <View style={styles.panelInfoLine}>
                          <Text style={styles.panelInfoTitle}>MODIFIED</Text>
                          <Text style={styles.panelInfoText}>Beard trim with Susan A. on 04/04 at 9AM</Text>
                          <Text style={styles.panelInfoDate}>by jada C on 04/02 at 7:58Am</Text>
                        </View>

                        <View style={styles.panelInfoLine}>
                          <Text style={styles.panelInfoTitle}>MODIFIED</Text>
                          <Text style={styles.panelInfoText}>Womans haircut with Susan A. on 04/04 at 9AM</Text>
                          <Text style={styles.panelInfoDate}>by jada C on 04/02 at 7:58Am</Text>
                        </View>

                      </View>
                      <SalonTouchableOpacity style={styles.panelInfoShowMore} onPress={() => { alert('Not implemented'); }}>
                        <Text style={styles.panelInfoShowMoreText}>SHOW MORE</Text>
                      </SalonTouchableOpacity>
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
                            {[<View style={styles.iconContainer}><Icon name="envelope" size={18} color="#115ECD" type="solid" />
                              </View>]}
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
                </ScrollView>
              </View>
            </View>
          </View>
        </SlidingUpPanel>
      </Modal>);
  }
}
