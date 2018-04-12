import React from 'react';
import { Text, Animated, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './../UI/Icon';
import SalonSlidingUpPanel from './../SalonSlidingUpPanel';
import SalonFlatPicker from '../SalonFlatPicker';

import {
  InputGroup,
  InputButton,
  InputSwitch,
  InputDivider,
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
    height: 575,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  tab: {
    flex: 1,
    marginHorizontal: 16,
    width: 382,
    height: 640,
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
    height: 78,
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
    marginTop: 14,
  },
  btnBottom: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 17,
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
    height: 54,
    backgroundColor: '#115ECD',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
  },
  whiteButtonContainer: {
    width: '100%',
    height: 53,
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
    fontSize: 14,
    fontFamily: 'Roboto',
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
    fontSize: 18,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    paddingTop: 11,
    paddingLeft: 4,
  },
  timeText: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    paddingTop: 9,
    paddingLeft: 4,
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
    height: 135,
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
    height: 61,
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
    height: 36,
    width: '90%',
  },
  otherOptionsLabels: { color: '#115ECD', fontSize: 16 },
});

export default class SalonDatePickerSlide extends React.Component {
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
      selectedFilter: 0,
      client: undefined,
      service: undefined,
      provider: undefined,
    };
  }

  state:{
    visible: false,
    selected: '',
    selectedFilter: 0,
    client: undefined,
    service: undefined,
    provider: undefined,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      selected: nextProps.selectedDate,
    });

    if (nextProps.visible) {
      this._panel.transitionTo(this.props.draggableRange.top, () => {});
    }
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel = () => {
    this.setState({ visible: false });
    this._panel.transitionTo(this.props.draggableRange.bottom, () => {});
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
    return (
      <SalonSlidingUpPanel
        visible
        showBackdrop={this.state.visible}
        onDragEnd={() => this.setState({ visible: false })}
        ref={(c) => { this._panel = c; }}
        draggableRange={this.props.draggableRange}
        onDrag={v => this._draggedValue.setValue(v)}
      >
        <View style={styles.panel}>
          <View style={styles.panelBlurredSection} />

          <View style={styles.panelContainer}>
            <View style={styles.panelTop}>

              <TouchableOpacity style={{ flex: 1 }} onPress={this.hidePanel}>
                <View style={styles.cancelButtonContainer}>
                  <Text style={styles.cancelButtonText}>
                Cancel
                  </Text>
                </View>
              </TouchableOpacity>

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

              <TouchableOpacity style={{ flex: 1 }} onPress={this.hidePanel}>
                <View style={styles.doneButtonContainer}>
                  <Text style={styles.doneButtonText}>
                    Done
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {this.state.selectedFilter === 0 &&
              <View style={styles.tab} >


                <View style={styles.panelTopSection}>
                  <Text style={styles.dateText}>
                    Wed, Feb 20
                  </Text>

                  <View style={styles.clockIconContainer}>
                    <Icon style={{ paddingTop: 7, paddingLeft: 4 }} name="clockO" size={14} color="#AAB3BA" type="solid" />
                    <Text style={styles.timeText}>
                      {'11:00 AM > 11:15 AM'}
                    </Text>
                  </View>
                </View>

                <View style={styles.panelMiddleSection}>
                  <InputGroup
                    style={styles.middleSectionGroup}
                  >

                    {[<InputButton
                      style={{ height: 44 }}
                      labelStyle={{ fontSize: 16, color: this.state.client ? '#000000' : '#727A8F' }}
                      onPress={() => {
                        this.props.navigation.navigate('Clients', {
                          actionType: 'update',
                          dismissOnSelect: true,
                          onChangeClient: this.handleClientSelection,
                        });
                      }}
                      label={this.state.client ? `${this.state.client.name} ${this.state.client.lastName}` : 'Select Client'}
                      iconStyle={{ color: '#115ECD' }}
                    />,
                      <InputDivider style={styles.middleSectionDivider} />,
                      <InputButton
                        style={{ height: 44 }}
                        labelStyle={{ fontSize: 16, color: this.state.service ? '#000000' : '#727A8F' }}
                        onPress={() => {
                          this.props.navigation.navigate('Services', {
                            actionType: 'update',
                            dismissOnSelect: true,
                            onChangeService: this.handleServiceSelection,
                          });
                        }}
                        label={this.state.service ? `${this.state.service.name}` : 'Select a Service'}
                        iconStyle={{ color: '#115ECD' }}
                      />,
                      <InputDivider style={styles.middleSectionDivider} />,
                      <InputButton
                        style={{ height: 44 }}
                        labelStyle={{ fontSize: 16, color: this.state.provider ? '#000000' : '#727A8F' }}
                        onPress={() => {
                          this.props.navigation.navigate('Providers', {
                            actionType: 'update',
                            dismissOnSelect: true,
                            onChangeProvider: this.handleProviderSelection,
                          });
                        }}
                        label={this.state.provider ? `${this.state.provider.name} ${this.state.provider.lastName}` : 'Select a Provider'}
                        iconStyle={{ color: '#115ECD' }}
                      />,
                    ]}
                  </InputGroup>

                  <InputGroup
                    style={styles.apptGroup}
                  >
                    {[
                      <InputSwitch
                        style={{ height: 61, paddingRight: 0, paddingTop: 5 }}
                        textStyle={{ fontSize: 16, color: '#000000' }}
                        onChange={(state) => {

                        }}
                        value={this.state.provideIsRequested}
                        text="Provider is Requested?"
                      />,
                    ]}
                  </InputGroup>


                  <InputGroup
                    style={styles.lengthGroup}
                  >
                    {[<InputButton
                      style={{ height: 36 }}
                      labelStyle={{ color: '#2F3142' }}
                      onPress={() => { alert('Not implemented'); }}
                      label="Length select a service first"
                      noIcon
                    />,
                    ]}
                  </InputGroup>
                </View>
                <View style={styles.panelBottomSection}>
                  <View style={styles.btnTop}>
                    <TouchableOpacity
                      style={styles.bookApptContainer}
                      onPress={() => { alert('Not implemented'); }}
                    >
                      <View style={styles.blueButtonContainer}>
                        <Text style={styles.blueButtonText}>
                        BOOK APPOINTMENT
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.btnBottom}>
                    <TouchableOpacity
                      style={{ width: '46%' }}
                      onPress={() => { alert('Not implemented'); }}
                    >
                      <View style={styles.whiteButtonContainer}>
                        <Text style={styles.whiteButtonText}>
                          MORE OPTIONS
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: '8%' }} />
                    <TouchableOpacity
                      style={{ width: '46%' }}
                      onPress={() => { alert('Not implemented'); }}
                    >
                      <View style={styles.whiteButtonContainer}>
                        <Text style={styles.whiteButtonText}>
                          BOOK ANOTHER
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            {this.state.selectedFilter === 1 &&
              <View style={styles.tab}>
                <InputGroup
                  style={{
                  borderBottomWidth: 0,
                  borderBottomColor: 'transparent',
                  paddingLeft: 2,
                  paddingRight: 0,
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

            <View style={{ height: 49 }} />
          </View>
        </View>
      </SalonSlidingUpPanel>);
  }
}
