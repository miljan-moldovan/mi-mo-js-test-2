import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  InputGroup,
  InputDivider,
  SalonTimePicker,
  SchedulePicker,
} from '../../../components/formHelpers';
import newAppointmentActions from '../../../actions/newAppointment';
import { appointmentCalendarActions } from '../../../actions/appointmentBook';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop: { marginTop: 16 },
  headerButton: {
    fontSize: 14,
    color: 'white',
  },
  mediumBold: { fontFamily: 'Roboto-Medium' },
});

class ChangeDateTimeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Change Date/Time',
    headerLeft: (
      <SalonTouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.headerButton}>Cancel</Text>
      </SalonTouchableOpacity>
    ),
    headerRight: (
      <SalonTouchableOpacity onPress={() => navigation.state.params.handleSave()}>
        <Text style={[styles.headerButton, styles.mediumBold]}>Done</Text>
      </SalonTouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ handleSave: this.handleSave });
    const { date, startTime } = this.props.newApptState;
    this.state = {
      date: moment(date),
      startTime: moment(startTime),
      isOpenDatePicker: false,
      isOpenTimePicker: false,
    };
  }

  onChangeDate = date => this.setState({ date })

  onChangeTime = startTime => this.setState({ startTime })

  toggleDatePicker = () => this.setState(({ isOpenDatePicker }) => ({
    isOpenTimePicker: false,
    isOpenDatePicker: !isOpenDatePicker,
  }))

  toggleTimePicker = () => this.setState(({ isOpenTimePicker }) => ({
    isOpenDatePicker: false,
    isOpenTimePicker: !isOpenTimePicker,
  }))

  handleSave = () => {
    const { date, startTime } = this.state;
    setTimeout(() => {
      this.props.newApptActions.setDate(moment(date));
      this.props.newApptActions.setStartTime(moment(startTime, 'hh:mm A'));
      this.props.newApptActions.getConflicts();
      this.props.navigation.goBack();
    });
  }

  render() {
    const {
      date,
      startTime,
      isOpenDatePicker,
      isOpenTimePicker,
    } = this.state;
    return (
      <View style={styles.container}>
        <InputGroup style={styles.marginTop}>
          <SalonTimePicker
            mode="date"
            label="Date"
            format="ddd, MM/DD/YYYY"
            value={date}
            isOpen={isOpenDatePicker}
            toggle={this.toggleDatePicker}
            onChange={this.onChangeDate}
            minimumDate={moment().toDate()}
          />
          <InputDivider />
          <SchedulePicker
            label="Time"
            date={date}
            value={startTime}
            isOpen={isOpenTimePicker}
            toggle={this.toggleTimePicker}
            onChange={this.onChangeTime}
          />
        </InputGroup>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  newApptState: state.newAppointmentReducer,
});
const mapActionToProps = dispatch => ({
  newApptActions: bindActionCreators({ ...newAppointmentActions }, dispatch),
});
export default connect(mapStateToProps, mapActionToProps)(ChangeDateTimeScreen);
