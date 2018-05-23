import React from 'react';
import { Text, Animated, Dimensions, ScrollView, View, StyleSheet } from 'react-native';
import moment from 'moment';

import Icon from './../UI/Icon';
import ModalBox from './ModalBox';
import SalonFlatPicker from '../SalonFlatPicker';

import SalonTouchableOpacity from './../SalonTouchableOpacity';
import {
  InputGroup,
  InputButton,
  InputSwitch,
  InputDivider,
  ProviderInput,
} from '../../components/formHelpers';

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 99999,
  },
  panelContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    height: 462,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  tab: {
    flex: 1,
    marginHorizontal: 16,
    width: '100%',
    height: 462,
  },
  panelBlurredSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panelTopSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    // justifyContent: 'center',
    flexDirection: 'column',
    height: 70,
  },
  panelBottomSection: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  //  height: 300,
  },
  btnTop: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 12,
  },
  btnBottom: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  panelTop: {
    backgroundColor: '#115ECD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cancelButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },

  doneButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  pickerBar: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatPicker: {
    width: 190,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueButtonContainer: {
    width: '100%',
    height: 46,
    backgroundColor: '#115ECD',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#115ECD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueButtonContainerDisabled: {
    backgroundColor: '#c0c0c0',
    borderColor: '#86868a',
  },
  blueButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    backgroundColor: 'transparent',
  },
  whiteButtonContainer: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderColor: '#B4B4B4',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteButtonText: {
    color: '#115ECD',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 37,
    height: 37,
    borderRadius: 37 / 2,
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subIcon: {
    backgroundColor: '#E5E5E5',
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
  },
  dateText: {
    color: '#000000',
    fontSize: 16,
    lineHeight: 30,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    paddingTop: 4,
    paddingLeft: 4,
  },
  timeText: {
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    paddingTop: 2,
    paddingLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  penIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingTop: 5,
  },
  banIconContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingRight: 15,
  },
  bookApptContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherOptionsBtn: { height: 67, paddingRight: 0 },
  middleSectionGroup: {
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderColor: '#F4F7FC',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#F4F7FC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 1,
    width: '90%',
  },
  middleSectionDivider: { width: '95%', backgroundColor: '#DDE6F4' },
  apptGroup: {
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    height: 55,
    paddingLeft: 0,
    paddingRight: 0,
    width: '90%',
  },
  lengthGroup: {
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderColor: '#F1F1F1',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#F1F1F1',
    height: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '90%',
  },
  otherOptionsLabels: { color: '#115ECD', fontSize: 16 },
  conflictBox: {
    height: 32,
    width: 343,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    backgroundColor: '#FFF7CC',
    paddingHorizontal: 10,
    marginVertical: 12,
  },
  conflictBoxText: {
    fontSize: 11,
    lineHeight: 22,
    color: '#2F3142',
    marginLeft: 7,
  },
  conflictBoxLink: {
    fontSize: 11,
    lineHeight: 22,
    color: '#D1242A',
    textDecorationLine: 'underline',
  },
  placeholderText: {
    fontSize: 14,
    color: '#727A8F',
    lineHeight: 22,
  },
  lengthLabel: {
    fontSize: 13,
    lineHeight: 22,
    color: '#2F3142',
  },
  lengthText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#2F3142',
    fontStyle: 'italic',
    opacity: 0.5,
  },
  lengthTextExists: {
    fontSize: 13,
    lineHeight: 22,
    color: '#2F3142',
    fontFamily: 'Roboto-Bold',
  },
});

const BookNow = props => (
  <SalonTouchableOpacity
    style={styles.bookApptContainer}
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <View
      style={props.disabled ?
        [styles.blueButtonContainer, styles.blueButtonContainerDisabled] :
        styles.blueButtonContainer
      }
    >
      <Text style={styles.blueButtonText}>
      BOOK APPOINTMENT
      </Text>
    </View>
  </SalonTouchableOpacity>
);

export default class SalonNewAppointmentSlide extends React.Component {
  static defaultProps = {
    draggableRange: {
      top: Dimensions.get('window').height,
      bottom: 0,
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      selectedFilter: 'selectedFilter' in this.props ? this.props.selectedFilter : 0,
      startTime: 'startTime' in this.props ? this.props.startTime : null,
      endTime: 'endTime' in this.props ? this.props.endTime : null,
      client: 'selectedClient' in this.props ? this.props.selectedClient : null,
      service: 'selectedService' in this.props ? this.props.selectedService : null,
      provider: 'selectedProvider' in this.props ? this.props.selectedProvider : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      date: nextProps.date,
      selected: nextProps.selectedDate,
      selectedFilter: 'selectedFilter' in this.props ? this.props.selectedFilter : null,
      startTime: 'startTime' in this.props ? this.props.startTime : null,
      endTime: 'endTime' in this.props ? this.props.endTime : null,
      client: 'selectedClient' in this.props ? this.props.selectedClient : null,
      service: 'selectedService' in this.props ? this.props.selectedService : null,
      provider: 'selectedProvider' in this.props ? this.props.selectedProvider : null,
    });
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel = () => {
    this.setState({ visible: false });
    this.props.onHide();
  }

  handleTypeChange=(ev, selectedFilter) => {
    this.setState({ selectedFilter });
  }

  handleClientSelection = (client) => {
    this.setState({ client });
  }

  handleServiceSelection = (service) => {
    this.setState({ service });
  }

  handleProviderSelection = (provider) => {
    this.setState({ provider });
  }

  render() {
    const length = this.props.service !== null ? `${moment.duration(this.props.service.maxDuration).asMinutes()} min` : false;
    const lengthStyle = length ? styles.lengthTextExists : styles.lengthText;
    const lengthText = (
      <Text style={styles.lengthLabel}>
        Length <Text style={lengthStyle}>{length || 'select a service first'}</Text>
      </Text>
    );
    const bookButtonEnabled =
      this.props.service !== null &&
      this.props.client !== null &&
      this.props.provider !== null;

    return (
      <ModalBox
        coverScreen
        isOpen={this.props.visible}
        onClosingState={() => this.hidePanel()}
      >
        <View style={styles.panel}>
          <View style={styles.panelBlurredSection} />

          <View style={styles.panelContainer}>
            <View style={styles.panelTop}>

              <SalonTouchableOpacity style={{ flex: 1 }} onPress={this.hidePanel}>
                <View style={styles.cancelButtonContainer}>
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </View>
              </SalonTouchableOpacity>

              <View style={styles.pickerBar}>
                <View style={styles.flatPicker}>
                  <SalonFlatPicker
                    dataSource={['New Appt.', 'Other']}
                    selectedColor="#FFFFFF"
                    selectedTextColor="#115ECD"
                    unSelectedTextColor="#FFFFFF"
                    onItemPress={this.handleTypeChange}
                    selectedIndex={this.state.selectedFilter}
                  />
                </View>
              </View>

              <SalonTouchableOpacity style={{ flex: 1 }} onPress={this.hidePanel}>
                <View style={styles.doneButtonContainer}>
                  <Text style={styles.doneButtonText}>
                    Done
                  </Text>
                </View>
              </SalonTouchableOpacity>
            </View>

            {this.state.selectedFilter === 0 &&
              <ScrollView style={styles.tab} >
                <View style={styles.panelTopSection}>
                  <Text style={styles.dateText}>
                    {moment(this.props.date).format('ddd, MMM D')}
                  </Text>

                  <View style={styles.clockIconContainer}>
                    <Icon style={{ paddingTop: 5, paddingLeft: 4 }} name="clockO" size={14} color="#AAB3BA" type="light" />
                    <Text style={styles.timeText}>{moment(this.props.startTime, 'HH:mm').format('HH:mm A')}</Text>
                    <Icon
                      name="angleRight"
                      size={15}
                      style={{ paddingTop: 4, paddingLeft: 4 }}
                      color="#000000"
                      type="light"
                    />
                    <Text style={styles.timeText}>{moment(this.props.endTime, 'HH:mm').format('HH:mm A')}</Text>
                  </View>
                </View>

                <View style={styles.panelMiddleSection}>
                  <InputGroup
                    style={styles.middleSectionGroup}
                  >
                    {[
                      <InputButton
                        style={{ height: 39 }}
                        labelStyle={{ fontSize: 14, color: this.props.client ? '#000000' : '#727A8F' }}
                        // onPress={this.props.handlePressClient}
                        onPress={() => { this.hidePanel(); this.props.handlePressClient(); }}
                        label={this.props.client ? `${this.props.client.name} ${this.props.client.lastName}` : 'Select Client'}
                        iconStyle={{ color: '#115ECD' }}
                      />,
                      <InputDivider style={styles.middleSectionDivider} />,
                      <InputButton
                        style={{ height: 39 }}
                        labelStyle={{ fontSize: 14, color: this.props.service ? '#000000' : '#727A8F' }}
                        value={(
                          <Text style={{
                            fontSize: 12,
                            color: '#727A8F',
                            fontFamily: 'Roboto-Bold',
                          }}
                          >{length}
                          </Text>
                        )}
                        onPress={() => { this.hidePanel(); this.props.handlePressService(); }}
                        label={this.props.service ? `${this.props.service.name}` : 'Select a Service'}
                        iconStyle={{ color: '#115ECD' }}
                      />,
                      <InputDivider style={styles.middleSectionDivider} />,
                      <ProviderInput
                        noLabel
                        rootStyle={{ height: 39 }}
                        selectedProvider={this.props.provider}
                        placeholder="Select a Provider"
                        placeholderStyle={styles.placeholderText}
                        selectedStyle={{ fontSize: 14, lineHeight: 22, color: 'black' }}
                        contentStyle={{ alignItems: 'flex-start' }}
                        iconStyle={{ color: '#115ECD' }}
                        avatarSize={20}
                        onPress={() => this.hidePanel()}
                        navigate={this.props.navigation.navigate}
                        onChange={(provider) => { this.props.handlePressProvider(provider); }}
                      />,
                    ]}
                  </InputGroup>

                  {this.props.hasConflicts && (
                    <SalonTouchableOpacity
                      style={styles.conflictBox}
                      onPress={this.props.handlePressConflicts}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon type="solid" name="warning" color="#D1242A" size={12} />
                        <Text style={styles.conflictBoxText}>Conflicts found</Text>
                      </View>
                      <Text style={styles.conflictBoxLink}>Show conflicts</Text>
                    </SalonTouchableOpacity>
                  )}

                  <InputGroup
                    style={styles.apptGroup}
                  >
                    {[
                      <InputSwitch
                        style={{ height: 55, paddingRight: 0, paddingTop: 5 }}
                        textStyle={{ fontSize: 14, color: '#000000' }}
                        onChange={this.props.handleChangeRequested}
                        value={this.props.isProviderRequested}
                        text="Provider is Requested?"
                      />,
                    ]}
                  </InputGroup>


                  <InputGroup
                    style={styles.lengthGroup}
                  >
                    {lengthText}
                  </InputGroup>
                </View>
                <View style={styles.panelBottomSection}>
                  <View style={styles.btnTop}>
                    <BookNow
                      disabled={!bookButtonEnabled}
                      onPress={this.props.handlePressBook}
                    />
                  </View>
                  <View style={styles.btnBottom}>
                    <SalonTouchableOpacity
                      style={{ width: '46%' }}
                      onPress={this.props.handlePressMore}
                    >
                      <View style={styles.whiteButtonContainer}>
                        <Text style={styles.whiteButtonText}>
                          MORE OPTIONS
                        </Text>
                      </View>
                    </SalonTouchableOpacity>
                    <View style={{ width: '8%' }} />
                    <SalonTouchableOpacity
                      style={{ width: '46%' }}
                      onPress={() => { alert('Not implemented'); }}
                    >
                      <View style={styles.whiteButtonContainer}>
                        <Text style={styles.whiteButtonText}>
                          BOOK ANOTHER
                        </Text>
                      </View>
                    </SalonTouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            }
            {this.state.selectedFilter === 1 &&
              <View style={styles.tab}>
                <InputGroup
                  style={{
                    borderBottomWidth: 0,
                    borderBottomColor: 'transparent',
                    width: '90%',
                    paddingLeft: 0,
                  }}
                >
                  {[<InputButton
                    noIcon
                    style={styles.otherOptionsBtn}
                    labelStyle={styles.otherOptionsLabels}
                    onPress={() => { alert('Not implemented'); }}
                    label="Block Time"
                  >
                    {[<View style={styles.iconContainer}>
                      <Icon name="clockO" size={18} color="#115ECD" type="solid" />
                      <View style={styles.banIconContainer}>
                        <Icon
                          style={styles.subIcon}
                          name="ban"
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
                      label="Edit Schedule"
                    >
                      {[<View style={styles.iconContainer}>
                        <Icon name="calendarO" size={18} color="#115ECD" type="solid" />

                        <View style={styles.penIconContainer}>
                          <Icon
                            style={styles.subIcon}
                            name="pen"
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
                      label="Room Assignment"
                    >
                      {[<View style={styles.iconContainer}><Icon name="streetView" size={18} color="#115ECD" type="solid" />
                        </View>]}
                    </InputButton>,

                    <InputButton
                      noIcon
                      style={styles.otherOptionsBtn}
                      labelStyle={styles.otherOptionsLabels}
                      onPress={() => { alert('Not implemented'); }}
                      label="Turn Away"
                    >
                      {[<View style={styles.iconContainer}><Icon name="ban" size={18} color="#115ECD" type="solid" />
                        </View>]}
                    </InputButton>,

                    <InputButton
                      noIcon
                      style={styles.otherOptionsBtn}
                      labelStyle={styles.otherOptionsLabels}
                      onPress={() => { alert('Not implemented'); }}
                      label="Message Provider's Clients"
                    >
                      {[<View style={styles.iconContainer}><Icon name="user" size={18} color="#115ECD" type="solid" />
                        </View>]}
                    </InputButton>,
                    <InputButton
                      noIcon
                      style={styles.otherOptionsBtn}
                      labelStyle={styles.otherOptionsLabels}
                      onPress={() => { alert('Not implemented'); }}
                      label="Message All Clients"
                    >
                      {[<View style={styles.iconContainer}><Icon name="users" size={18} color="#115ECD" type="solid" />
                        </View>]}
                    </InputButton>]}
                </InputGroup>
              </View>

            }
          </View>
        </View>
      </ModalBox>);
  }
}
