import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { get } from 'lodash';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputGroup,
  InputRadioGroup,
  InputDivider,
  InputSwitch,
  SectionTitle,
  InputText,
} from '../../components/formHelpers';
import SalonTimePicker from '../../components/formHelpers/components/SalonTimePicker';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },
  headerTitle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,
    color: 'white',
  },
  headerTitleSubTitle: {
    fontFamily: 'Roboto',
    fontSize: 10,
    lineHeight: 12,
    color: 'white',
  },
  headerLeftText: { fontSize: 14, color: 'white' },
  headerRightText: { fontSize: 14, color: 'white' },
  activityIndicator: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputGroup: { marginTop: 16 },
  inputSwitch: { height: 43 },
  inputSwitchText: { color: '#727A8F' },
  sectionTitle: { height: 38 },
});


const scheduleTypes = [
  { id: 1, name: 'Regular' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Vacation' },
  { id: 4, name: 'OutSick' },
  { id: 0, name: 'Other' },
];

export default class EditScheduleScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const employee = params.employee || { name: 'First', lastName: 'Available' };

    return {
      headerTitle: (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleTitle}>
          Edit Schedule
          </Text>
          <Text style={styles.headerTitleSubTitle}>
            {`${employee.name} ${employee.lastName[0]}`}
          </Text>
        </View>
      ),

      headerLeft: (
        <SalonTouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerLeftText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          disabled={!canSave}
          onPress={() => {
          if (navigation.state.params.handleDone) {
            navigation.state.params.handleDone();
          }
        }}
        >
          <Text style={styles.headerRightText}>
          Done
          </Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    this.props.navigation.setParams({ handleDone: this.handleDone });
  }

  state = {
    startTimeScheduleOne: '',
    endTimeScheduleOne: '',
    startTimeScheduleTwo: '',
    endTimeScheduleTwo: '',
    hoursWorking: false,
    selectedScheduleExceptionReason: scheduleTypes[scheduleTypes.length - 1],
    isEditableOtherReason: true,
  }

  handleDone = () => {
    let {
      startTimeScheduleOne, endTimeScheduleOne, startTimeScheduleTwo, endTimeScheduleTwo,
      otherReason, selectedScheduleExceptionReason,
    } = this.state;

    const params = this.props.navigation.state.params || {};
    const employee = params.employee || { name: 'First', lastName: 'Available' };

    const formated_date = moment(this.props.date).format('YYYY-MM-DD');

    if (!this.state.hoursWorking) {
      startTimeScheduleOne = null;
      endTimeScheduleOne = null;
      startTimeScheduleTwo = null;
      endTimeScheduleTwo = null;
    } else {
      startTimeScheduleOne = startTimeScheduleOne ? startTimeScheduleOne.format('HH:mm:ss') : null;
      endTimeScheduleOne = endTimeScheduleOne ? endTimeScheduleOne.format('HH:mm:ss') : null;
      startTimeScheduleTwo = startTimeScheduleTwo ? startTimeScheduleTwo.format('HH:mm:ss') : null;
      endTimeScheduleTwo = endTimeScheduleTwo ? endTimeScheduleTwo.format('HH:mm:ss') : null;
    }


    const schedule = {
      existingExceptionId: this.props.employeeScheduleState.employeeSchedule.id,
      startDate: formated_date,
      endDate: formated_date,
      start1: startTimeScheduleOne,
      end1: endTimeScheduleOne,
      start2: startTimeScheduleTwo,
      end2: endTimeScheduleTwo,
      period: 0,
      periodType: 0,
      weekday: moment(this.props.date).isoWeekday(),
      comments: otherReason.length > 0 ? otherReason : null,
      scheduleType: selectedScheduleExceptionReason.id === 0 ? -1 : selectedScheduleExceptionReason.id,
      offType: 1,
    };

    this.props.employeeScheduleActions.putEmployeeSchedule(employee.id, schedule, formated_date, (result) => {
      if (result) {
        this.props.appointmentCalendarActions.setGridView();
        this.props.navigation.goBack();
      }
    });
  }

  componentWillMount() {
    const params = this.props.navigation.state.params || {};
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    const date = params.date || moment();
    const formated_date = moment(date).format('YYYY-MM-DD');
    this.props.employeeScheduleActions.getEmployeeSchedule(employee.id, formated_date, (result) => {
      if (result) {
        this.getState();
      }
    });

    // this.props.navigation.setParams({ canSave: true });
  }


  getState = () => {
    console.log('employeeSchedule: ');
    console.log(this.props.employeeScheduleState.employeeSchedule);
    let employeeSchedule = this.props.employeeScheduleState.employeeSchedule || false;
    employeeSchedule = employeeSchedule[employeeSchedule.length - 1];

    let scheduleTypeId = get(employeeSchedule, 'scheduleType', -1);

    let otherReason = get(employeeSchedule, 'comments', '');
    scheduleTypeId = otherReason !== null && otherReason.length > 0 ? 0 : scheduleTypeId;

    otherReason = otherReason !== null ? otherReason : '';

    const hoursWorking = (!!employeeSchedule.start1 && !!employeeSchedule.end1) ||
    (!!employeeSchedule.start2 && !!employeeSchedule.end2);

    let selectedScheduleExceptionReason = scheduleTypes.find(_scheduleType =>
      _scheduleType.id === scheduleTypeId);
    selectedScheduleExceptionReason = selectedScheduleExceptionReason || { id: -1, name: '' };

    let startTimeScheduleOne = get(employeeSchedule, 'start1', '00:00:00');
    startTimeScheduleOne = startTimeScheduleOne ? moment(startTimeScheduleOne, 'HH:mm:ss') : '';

    let endTimeScheduleOne = get(employeeSchedule, 'end1', '23:59:59');
    endTimeScheduleOne = endTimeScheduleOne ? moment(endTimeScheduleOne, 'HH:mm:ss') : '';

    let startTimeScheduleTwo = get(employeeSchedule, 'start2', null);
    startTimeScheduleTwo = startTimeScheduleTwo ? moment(startTimeScheduleTwo, 'HH:mm:ss') : '';

    let endTimeScheduleTwo = get(employeeSchedule, 'end2', null);
    endTimeScheduleTwo = endTimeScheduleTwo ? moment(endTimeScheduleTwo, 'HH:mm:ss') : '';

    this.setState({
      hoursWorking,
      startTimeScheduleOne,
      endTimeScheduleOne,
      startTimeScheduleTwo,
      endTimeScheduleTwo,
      isEditableOtherReason: otherReason && otherReason.length > 0,
      otherReason,
      selectedScheduleExceptionReason,
    });
  }

  handleChangestartTimeScheduleOne = (startTimeScheduleOneDateObj) => {
    const { endTimeScheduleOne } = this.state;
    const startTimeScheduleOne = moment(startTimeScheduleOneDateObj);
    if (startTimeScheduleOne.isAfter(endTimeScheduleOne)) {
      return alert("Start time can't be after end time");
    }
    const params = this.props.navigation.state.params || {};
    let canSave = params.canSave || false;

    if (this.state.hoursWorking) {
      canSave = (!!startTimeScheduleOne && !!endTimeScheduleOne);
    }

    this.props.navigation.setParams({ canSave });

    return this.setState({
      startTimeScheduleOne,
    });
  }

  handleChangeendTimeScheduleOne = (endTimeScheduleOneDateObj) => {
    const { startTimeScheduleOne } = this.state;
    const endTimeScheduleOne = moment(endTimeScheduleOneDateObj);
    if (startTimeScheduleOne.isAfter(endTimeScheduleOne)) {
      return alert("Start time can't be after end time");
    }
    const params = this.props.navigation.state.params || {};
    let canSave = params.canSave || false;

    if (this.state.hoursWorking) {
      canSave = (!!startTimeScheduleOne && !!endTimeScheduleOne);
    }

    this.props.navigation.setParams({ canSave });

    return this.setState({
      endTimeScheduleOne,
    });
  }


    handleChangestartTimeScheduleTwo = (startTimeScheduleTwoDateObj) => {
      const { endTimeScheduleTwo } = this.state;
      const startTimeScheduleTwo = moment(startTimeScheduleTwoDateObj);
      if (startTimeScheduleTwo.isAfter(endTimeScheduleTwo)) {
        return alert("Start time can't be after end time");
      }
      return this.setState({
        startTimeScheduleTwo,
      });
    }

    handleChangeendTimeScheduleTwo = (endTimeScheduleTwoDateObj) => {
      const { startTimeScheduleTwo } = this.state;
      const endTimeScheduleTwo = moment(endTimeScheduleTwoDateObj);
      if (startTimeScheduleTwo.isAfter(endTimeScheduleTwo)) {
        return alert("Start time can't be after end time");
      }
      return this.setState({
        endTimeScheduleTwo,
      });
    }

    onChangeOtherReason = (text) => {
      this.setState({ otherReason: text });
      this.props.navigation.setParams({ canSave: text.length > 0 });
    }

    onChangeInputSwitch = (state) => {
      const params = this.props.navigation.state.params || {};
      let canSave = params.canSave || false;
      const hoursWorking = !this.state.hoursWorking;

      if (hoursWorking) {
        canSave = (this.state.startTimeScheduleOne.length > 0 && this.state.endTimeScheduleOne.length > 0);
      } else {
        canSave = this.state.otherReason && this.state.otherReason.length > 0;
      }

      this.props.navigation.setParams({ canSave });

      this.setState({ hoursWorking });
    }

    pickerToogleStartTimeOne = () => {
      this.setState({ startTimeScheduleOnePickerOpen: !this.state.startTimeScheduleOnePickerOpen });
    };

    pickerToogleEndTimeOne = () => {
      this.setState({ endTimeScheduleOnePickerOpen: !this.state.endTimeScheduleOnePickerOpen });
    };

    pickerToogleStartTimeTwo = () => {
      this.setState({ startTimeScheduleTwoPickerOpen: !this.state.startTimeScheduleTwoPickerOpen });
    };

    pickerToogleEndTimeTwo = () => {
      this.setState({ endTimeScheduleTwoPickerOpen: !this.state.endTimeScheduleTwoPickerOpen });
    };

    onPressRadioGroup = (option, index) => {
      const isEditableOtherReason = option.id === 0;

      if (!isEditableOtherReason) {
        this.onChangeOtherReason('');
        this.props.navigation.setParams({
          canSave: true,
        });
      } else {
        this.props.navigation.setParams({
          canSave: this.state.otherReason.length > 0,
        });
      }
      this.setState({ selectedScheduleExceptionReason: option, isEditableOtherReason });
    }

    render() {
      const {
        startTimeScheduleOne,
        endTimeScheduleOne,
        startTimeScheduleTwo,
        endTimeScheduleTwo,
      } = this.state;

      const {
        employeeScheduleState,
      } = this.props;

      return (
        <View style={styles.container}>

          {this.props.employeeScheduleState.isLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
      ) : (

        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={300} enableAutoAutomaticScroll>
          <InputGroup style={styles.inputGroup}>
            <InputSwitch
              style={styles.inputSwitch}
              textStyle={styles.inputSwitchText}
              onChange={this.onChangeInputSwitch}
              value={this.state.hoursWorking}
              text="Hours Working"
            />
          </InputGroup>

          {this.state.hoursWorking ?
            <React.Fragment>
              <SectionTitle value="SCHEDULE 1" style={styles.sectionTitle} />
              <InputGroup>
                <SalonTimePicker
                  label="Start"
                  noIcon
                  value={startTimeScheduleOne}
                  isOpen={this.state.startTimeScheduleOnePickerOpen}
                  onChange={this.handleChangestartTimeScheduleOne}
                  toggle={this.pickerToogleStartTimeOne}
                />
                <InputDivider />
                <SalonTimePicker
                  label="Ends"
                  noIcon
                  value={endTimeScheduleOne}
                  isOpen={this.state.endTimeScheduleOnePickerOpen}
                  onChange={this.handleChangeendTimeScheduleOne}
                  toggle={this.pickerToogleEndTimeOne}
                />
              </InputGroup>
              <SectionTitle value="SCHEDULE 2" style={styles.sectionTitle} />
              <InputGroup>
                <SalonTimePicker
                  label="Start"
                  noIcon
                  value={startTimeScheduleTwo}
                  isOpen={this.state.startTimeScheduleTwoPickerOpen}
                  onChange={this.handleChangestartTimeScheduleTwo}
                  toggle={this.pickerToogleStartTimeTwo}
                />
                <InputDivider />
                <SalonTimePicker
                  label="Ends"
                  noIcon
                  value={endTimeScheduleTwo}
                  isOpen={this.state.endTimeScheduleTwoPickerOpen}
                  onChange={this.handleChangeendTimeScheduleTwo}
                  toggle={this.pickerToogleEndTimeTwo}
                />
              </InputGroup>
            </React.Fragment>
              : null
            }

          <SectionTitle value="SCHEDULE EXCEPTION REASON" style={styles.sectionTitle} />
          <InputGroup>
            <InputRadioGroup
              options={scheduleTypes}
              defaultOption={this.state.selectedScheduleExceptionReason}
              onPress={this.onPressRadioGroup}
            />
            <InputText
              value={this.state.otherReason}
              isEditable={this.state.isEditableOtherReason}
              onChangeText={this.onChangeOtherReason}
              placeholder="Please specify"
            />
          </InputGroup>
        </KeyboardAwareScrollView>)}
        </View>
      );
    }
}
