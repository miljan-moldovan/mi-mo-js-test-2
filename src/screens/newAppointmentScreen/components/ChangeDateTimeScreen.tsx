import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  InputGroup,
  InputDivider,
  SalonTimePicker,
  SchedulePicker,
} from '../../../components/formHelpers';
import newAppointmentActions, { NewApptActions } from '../../../redux/actions/newAppointment';
import {
  appointmentCalendarActions,
} from '../../../redux/actions/appointmentBook';
import SalonTouchableOpacity from '../../../components/SalonTouchableOpacity';
import headerStyles from '../../../constants/headerStyles';
import SalonHeader from '../../../components/SalonHeader';
import { NavigationScreenProp } from 'react-navigation';
import { NewAppointmentReducer } from '@/redux/reducers/newAppointment';

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
  rightButton: { paddingRight: 10 },
  leftButton: { paddingLeft: 10 },
});

interface ChangeDateTimeScreenProps {
  navigation: NavigationScreenProp<{
    handleSave: () => void;
  }>;
  newApptState: NewAppointmentReducer;
  newApptActions: NewApptActions;
}

interface ChangeDateTimeScreenState {
  date: moment.Moment;
  startTime: moment.Moment;
  isOpenDatePicker: boolean;
  isOpenTimePicker: boolean;
}

class ChangeDateTimeScreen extends React.Component<ChangeDateTimeScreenProps, ChangeDateTimeScreenState> {
  static navigationOptions = ({ navigation }) => {
    const rightButtonOnPress = () => navigation.state.params.handleSave();
    return {
      header: (
        <SalonHeader
          title="Change Date/Time"
          headerLeft={
            <SalonTouchableOpacity
              style={styles.leftButton}
              onPress={navigation.goBack}
            >
              <Text style={styles.headerButton}>Cancel</Text>
            </SalonTouchableOpacity>
          }
          headerRight={
            <SalonTouchableOpacity
              style={styles.rightButton}
              onPress={rightButtonOnPress}
            >
              <Text style={[styles.headerButton, styles.mediumBold]}>Done</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

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

  onChangeDate = date => this.setState({ date: moment(date) });

  onChangeTime = startTime => this.setState({ startTime: moment(startTime) });

  toggleDatePicker = () =>
    this.setState(({ isOpenDatePicker }) => ({
      isOpenTimePicker: false,
      isOpenDatePicker: !isOpenDatePicker,
    }));

  toggleTimePicker = () =>
    this.setState(({ isOpenTimePicker }) => ({
      isOpenDatePicker: false,
      isOpenTimePicker: !isOpenTimePicker,
    }));

  handleSave = () => {
    const { date, startTime } = this.state;
    setTimeout(() => {
      this.props.newApptActions.changeDateTime(date, startTime);
      this.props.navigation.goBack();
    });
  };

  render() {
    const { date, startTime, isOpenDatePicker, isOpenTimePicker } = this.state;
    return (
      <View style={styles.container}>
        <InputGroup style={styles.marginTop}>
          <SalonTimePicker
            mode="date"
            label="Date"
            format="ddd, MM/DD/YYYY"
            value={date.toDate()}
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
