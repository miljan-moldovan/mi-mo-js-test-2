// @flow
import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
} from 'react-native';
import Moment from 'moment';

import { connect } from 'react-redux';
import WordHighlighter from '../../wordHighlighter';


const styles = StyleSheet.create({
  highlightStyle: {
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  clientName: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  clientNameAppoint: {
    color: '#1D1D26',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: 'transparent',
  },
  clientEmail: {
    color: '#1D1D26',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    flex: 0.6,
    //  marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {


  },
  dataContainer: {
    // marginLeft: 20,
    flex: 2.3,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  upperDataContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomDataContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  daysContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  daysCount: {
    color: '#1D1D26',
    fontSize: 30,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  daysMessage: {
    color: '#1D1D26',
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    backgroundColor: 'transparent',
  },
  daysMessageBottom: {
    color: '#1D1D26',
    fontSize: 8,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
  },
  pointerContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  pointer: {
    height: 7,
    width: 7,
    borderRadius: 7 / 2,
    backgroundColor: '#67A3C7',
  },
  clientBirthday: {
    backgroundColor: '#F1F1F2',
    paddingVertical: 1,
    paddingHorizontal: 3,
    marginLeft: 5,
    borderRadius: 5,
  },
  clientBirthdayText: {
    color: '#3078A4',
    fontSize: 9,
    fontFamily: 'OpenSans-Light',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

class LastVisitClientListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      client: props.client,
      boldWords: props.boldWords,
      onPress: props.onPress,
    };
  }

  state = {

  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      client: nextProps.client,
      boldWords: nextProps.boldWords,
      onPress: nextProps.onPress,
    });
  }

  isBirthday(dob) {
    return Moment(dob, 'YYYY-MM-DD').format('MM') === Moment().format('MM');
  }

  getDaysUntilNexApp(date) {
    return Moment(date, 'YYYY-MM-DD').diff(Moment(), 'days');
  }

  render() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={() => { this.state.onPress(this.state.client.name); }}
      >
        <View style={styles.container}>

          <View style={styles.pointerContainer}>
            {this.state.client.nextAppointment && <View style={styles.pointer} />}
          </View>

          <View style={styles.dataContainer}>

            <View style={styles.upperDataContainer}>

              <WordHighlighter
                highlight={this.state.boldWords}
                highlightStyle={styles.highlightStyle}
                style={this.state.client.nextAppointment ? styles.clientNameAppoint : styles.clientName}
              >
                {this.state.client.name}
              </WordHighlighter>

              {this.isBirthday(this.state.client.dob) &&
              <View style={styles.clientBirthday}>
                <Text style={styles.clientBirthdayText}>Birthday this month</Text>
              </View>
            }

            </View>

            <View style={styles.bottomDataContainer}>
              {!this.state.client.nextAppointment && !this.state.client.lastAppointment &&
              <Text style={styles.clientEmail}>Never had an Appointment</Text>
            }
              {!this.state.client.nextAppointment && this.state.client.lastAppointment &&
              <Text style={styles.clientEmail}>Last Appoint.: {this.state.client.lastAppointment.date} at {this.state.client.lastAppointment.address}</Text>
            }
              {this.state.client.nextAppointment &&
              <Text style={styles.clientEmail}>Next Appoint.: {this.state.client.nextAppointment.date} | {this.state.client.nextAppointment.date} at {this.state.client.nextAppointment.address}</Text>
            }
            </View>
          </View>

          <View style={styles.daysContainer}>
            {this.state.client.nextAppointment &&
            <View style={styles.daysContainer}>
              <Text style={styles.daysCount}>{this.getDaysUntilNexApp(this.state.client.nextAppointment.date)}</Text>
              <Text style={styles.daysMessage}>days</Text>
              <Text style={styles.daysMessageBottom}>Till next Appoint.</Text>
            </View>
            }
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LastVisitClientListItem);
