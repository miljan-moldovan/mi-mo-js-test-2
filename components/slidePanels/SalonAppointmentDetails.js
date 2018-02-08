import React from 'react';
import { Animated, Dimensions, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

import SalonSlidingUpPanel from './../SalonSlidingUpPanel';

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  panelContainer: {
    flex: 3.5,
    backgroundColor: '#CDCED2',
    flexDirection: 'column',
  },
  panelFooter: {
    flex: 0.5,
  },
  panelBlurredSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  panelLine: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#CDCED2',
    borderBottomWidth: 1,
    width: '100%',
  },
  panelTopSection: {
    flex: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderBottomColor: '#CDCED2',
    borderBottomWidth: 1,
  },
  panelBottomSection: {
    flex: 4,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelDoneSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.3,
    backgroundColor: '#FFFFFF',
  },
  panelButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelSeparator: {
    flex: 0.12,
    backgroundColor: '#CDCED2',
  },
  panelDoneText: {
    color: '#53A5D6',
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
  },
  panelButtonText: {
    color: '#53A5D6',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  panelGreySection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'rgba(205, 206, 210, 0.2)',
    marginBottom: 15,
    flex: 1,
    width: '90%',
  },
  panelScheduleSection: {
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
    flex: 1,
    width: '90%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  panelGreySectionText: {
    color: '#1D1D26',
    fontStyle: 'italic',
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    marginHorizontal: 20,
    opacity: 0.7,
  },
  panelIcon: {
    width: 20,
    height: 20,
    marginTop: 5,
  },
  panelScheduleTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  panelScheduleColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 10,
  },
  panelScheduleBottom: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  panelScheduleColumnTitle: {
    color: '#3D3C3B',
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  panelScheduleColumnDesc: {
    color: '#3D3C3B',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
});

export default class SalonAppointmentDetails extends React.Component {
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
    };
  }

  state:{
    visible: false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
    this._panel.transitionTo(this.props.draggableRange.top, () => {});
  }

  _draggedValue = new Animated.Value(-120);

  hidePanel() {
    this.setState({ visible: false });
    this._panel.transitionTo(this.props.draggableRange.bottom, () => {});
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
            <View style={styles.panelTopSection}>
              <View style={styles.panelScheduleSection}>
                <View style={styles.panelScheduleTop} >

                  <View style={styles.panelScheduleColumn} >
                    <Image
                      resizeMode="contain"
                      style={styles.panelIcon}
                      source={require('../../assets/images/icons/man_user.png')}
                    />
                  </View>


                  <View style={styles.panelScheduleColumn} >
                    <Text style={styles.panelScheduleColumnTitle}>Suzie Marvel</Text>
                    <Text style={styles.panelScheduleColumnDesc}>Women’s Haircut</Text>
                  </View>

                  <View style={styles.panelScheduleColumn} >

                    <Image
                      resizeMode="contain"
                      style={styles.panelIcon}
                      source={require('../../assets/images/icons/icon_plus.png')}
                    />
                  </View>
                </View>

                <View style={styles.panelScheduleBottom} >

                  <View style={styles.panelScheduleColumn} >
                    <Image
                      resizeMode="contain"
                      style={styles.panelIcon}
                      source={require('../../assets/images/icons/calendar.png')}
                    />
                  </View>

                  <View style={styles.panelScheduleColumn} >
                    <Text style={styles.panelScheduleColumnTitle}>8:30 AM - 9:15 AM</Text>
                    <Text style={styles.panelScheduleColumnDesc}>Wednesday, 11 June </Text>
                  </View>

                  <View style={styles.panelScheduleColumn} >
                    <Image
                      resizeMode="contain"
                      style={styles.panelIcon}
                      source={require('../../assets/images/icons/clock.png')}
                    />
                  </View>


                  <View style={styles.panelScheduleColumn} >
                    <Text style={[styles.panelScheduleColumnDesc, { marginTop: 4 }]}>45 min</Text>
                  </View>
                </View>


              </View>
              <View style={styles.panelGreySection}>
                <Text style={styles.panelGreySectionText}>Booked on 03/05/2017 by Joanna Smith</Text>
                <Text style={styles.panelGreySectionText}>Modified on 03/05/2017 by Joanna Smith</Text>
              </View>
            </View>
            <View style={styles.panelBottomSection}>

              <View style={styles.panelLine}>
                <View style={styles.panelButton}>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.panelButtonText}>Check In</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.panelLine}>
                <View style={styles.panelButton}>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.panelButtonText}>Check out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.panelLine}>
                <View style={styles.panelButton}>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.panelButtonText}>Modify Appointment</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.panelLine}>
                <View style={styles.panelButton}>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.panelButtonText}>Cancel Appointment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.panelSeparator} />
            <View style={styles.panelDoneSection}>
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={() => { this.hidePanel(); }}>
                  <Text style={styles.panelDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.panelFooter} />
        </View>
      </SalonSlidingUpPanel>);
  }
}
