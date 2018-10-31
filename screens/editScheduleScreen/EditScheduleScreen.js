import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { get, filter, orderBy } from 'lodash';
import PropTypes from 'prop-types';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputGroup,
  InputRadioGroup,
  InputDivider,
  InputSwitch,
  SectionTitle,
  InputText,
} from '../../components/formHelpers';
import SchedulePicker from '../../components/formHelpers/components/SchedulePicker';
import styles from './styles';
import ScheduleTypesEnum from '../../constants/ScheduleTypes';
import headerStyles from '../../constants/headerStyles';

const scheduleTypes = [
  { id: ScheduleTypesEnum.Personal, name: 'Personal' },
  { id: ScheduleTypesEnum.Vacation, name: 'Vacation' },
  { id: ScheduleTypesEnum.OutSick, name: 'OutSick' },
  { id: ScheduleTypesEnum.Regular, name: 'Other' }, // Regular -> this is done to match webend
  // { id: 0, name: 'Other' }, // this is done to match webend
];

class EditScheduleScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const canSave = params.canSave || false;
    const employee = params.employee || { name: 'First', lastName: 'Available' };

    return {
      ...headerStyles,
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
        <SalonTouchableOpacity style={styles.leftButton} onPress={() => navigation.goBack()}>
          <Text style={styles.headerLeftText}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          style={styles.rightButton}
          disabled={!canSave}
          onPress={() => {
          if (navigation.state.params.handleDone) {
            navigation.state.params.handleDone();
          }
        }}
        >
          <Text style={[styles.headerRightText, { color: canSave ? '#FFFFFF' : '#19428A' }]}>
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
    hoursWorking: true,
    selectedScheduleExceptionReason: scheduleTypes.find(_scheduleType =>
      _scheduleType.id === ScheduleTypesEnum.Regular),
    isEditableOtherReason: false,
    startTimeScheduleOnePickerOpen: false,
    endTimeScheduleOnePickerOpen: false,
    startTimeScheduleTwoPickerOpen: false,
    endTimeScheduleTwoPickerOpen: false,
    storeTodaySchedule: null,
  }

  componentWillMount() {
    const params = this.props.navigation.state.params || {};
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    const date = params.date || moment();
    const formatedDate = moment(date).format('YYYY-MM-DD');

    this.props.employeeScheduleActions.getEmployeeScheduleException(employee.id, formatedDate, (result) => {
      if (result && this.props.employeeScheduleState.employeeScheduleException.length > 0) {
        this.getState(true);
      } else {
        this.props.employeeScheduleActions.getEmployeeSchedule(employee.id, formatedDate, (result) => {
          if (result) {
            this.getState(false);
          }
        });
      }
    });
  }


  getState = (isException) => {
    let employeeScheduleOne = {};
    let employeeScheduleTwo = {};

    if (isException) {
      let employeeSchedules = this.props.employeeScheduleState.employeeScheduleException || false;
      employeeSchedules = orderBy(employeeSchedules, 'id', 'desc')[0];
      employeeScheduleOne = { start: employeeSchedules.start1, end: employeeSchedules.end1, comment: employeeSchedules.comments };
      employeeScheduleTwo = { start: employeeSchedules.start2, end: employeeSchedules.end2 };
    } else {
      // normal schedule for that day
      const employeeSchedules = this.props.employeeScheduleState.employeeSchedule.scheduledIntervals || false;
      employeeScheduleOne = employeeSchedules.length > 0 ? employeeSchedules[0] : {};
      employeeScheduleTwo = {};
    }


    let scheduleTypeId = get(employeeScheduleOne, 'scheduleType', -1);

    let otherReason = get(employeeScheduleOne, 'comment', '');
    scheduleTypeId = otherReason !== null && otherReason.length > 0 ? 0 : scheduleTypeId;

    otherReason = otherReason !== null ? otherReason : '';

    const hoursWorking = employeeScheduleOne ? ((!!employeeScheduleOne.start && !!employeeScheduleOne.end) ||
    (!!employeeScheduleTwo.start && !!employeeScheduleTwo.end)) : false;

    let selectedScheduleExceptionReason = scheduleTypes.find(_scheduleType =>
      _scheduleType.id === scheduleTypeId);
    selectedScheduleExceptionReason = selectedScheduleExceptionReason || scheduleTypes.find(_scheduleType =>
      _scheduleType.id === ScheduleTypesEnum.Regular);

    let startTimeScheduleOne = get(employeeScheduleOne, 'start', '00:00:00');
    startTimeScheduleOne = startTimeScheduleOne ? moment(startTimeScheduleOne, 'HH:mm:ss') : '';

    let endTimeScheduleOne = get(employeeScheduleOne, 'end', '23:59:59');
    endTimeScheduleOne = endTimeScheduleOne ? moment(endTimeScheduleOne, 'HH:mm:ss') : '';

    let startTimeScheduleTwo = get(employeeScheduleTwo, 'start', null);
    startTimeScheduleTwo = startTimeScheduleTwo ? moment(startTimeScheduleTwo, 'HH:mm:ss') : '';

    let endTimeScheduleTwo = get(employeeScheduleTwo, 'end', null);
    endTimeScheduleTwo = endTimeScheduleTwo ? moment(endTimeScheduleTwo, 'HH:mm:ss') : '';

    const isEditableOtherReason = selectedScheduleExceptionReason.id === ScheduleTypesEnum.Regular;

    this.onPressRadioGroup(selectedScheduleExceptionReason);

    this.setState({
      hoursWorking,
      startTimeScheduleOne,
      endTimeScheduleOne,
      startTimeScheduleTwo,
      endTimeScheduleTwo,
      isEditableOtherReason,
      otherReason,
      selectedScheduleExceptionReason,
    });
  }


    handleDone = () => {
      let {
        startTimeScheduleOne, endTimeScheduleOne, startTimeScheduleTwo, endTimeScheduleTwo,
        otherReason, selectedScheduleExceptionReason,
      } = this.state;

      const params = this.props.navigation.state.params || {};
      const employee = params.employee || { name: 'First', lastName: 'Available' };

      const formatedDate = moment(this.props.date).format('YYYY-MM-DD');

      if (!this.state.hoursWorking) {
        startTimeScheduleOne = null;
        endTimeScheduleOne = null;
        startTimeScheduleTwo = null;
        endTimeScheduleTwo = null;
      } else {
        startTimeScheduleOne = startTimeScheduleOne ? startTimeScheduleOne.format('HH:mm:ss') : null;
        endTimeScheduleOne = endTimeScheduleOne ? endTimeScheduleOne.format('HH:mm:ss') : null;
        startTimeScheduleTwo = startTimeScheduleTwo && endTimeScheduleTwo ? startTimeScheduleTwo.format('HH:mm:ss') : null;
        endTimeScheduleTwo = endTimeScheduleTwo && startTimeScheduleTwo ? endTimeScheduleTwo.format('HH:mm:ss') : null;
      }

      const employeeSchedule = this.props.employeeScheduleState.employeeScheduleException
        ?
        this.props.employeeScheduleState.employeeScheduleException :
        this.props.employeeScheduleState.employeeSchedule;

      const schedule = {
        existingExceptionId: employeeSchedule.id,
        startDate: formatedDate,
        endDate: formatedDate,
        start1: startTimeScheduleOne,
        end1: endTimeScheduleOne,
        start2: startTimeScheduleTwo,
        end2: endTimeScheduleTwo,
        period: 0,
        periodType: 0,
        weekday: moment(this.props.date).isoWeekday(),
        comments: selectedScheduleExceptionReason.id === ScheduleTypesEnum.Regular && otherReason.length > 0 ? otherReason : '',
        scheduleType: selectedScheduleExceptionReason.id,
        offType: 1,
      };


      this.props.employeeScheduleActions.putEmployeeSchedule(employee.id, schedule, formatedDate, (result) => {
        if (result) {
          this.props.appointmentCalendarActions.setGridView();
          this.props.navigation.goBack();
        }
      });
    }

  handleChangestartTimeScheduleOne = (startTimeScheduleOneDateObj) => {
    const startTimeScheduleOne = moment(startTimeScheduleOneDateObj);

    return this.setState({
      startTimeScheduleOne,
    }, this.checkCanSave);
  }

  handleChangeendTimeScheduleOne = (endTimeScheduleOneDateObj) => {
    const endTimeScheduleOne = moment(endTimeScheduleOneDateObj);

    return this.setState({
      endTimeScheduleOne,
    }, this.checkCanSave);
  }


    handleChangestartTimeScheduleTwo = (startTimeScheduleTwoDateObj) => {
      const startTimeScheduleTwo = moment(startTimeScheduleTwoDateObj);

      return this.setState({
        startTimeScheduleTwo,
      }, this.checkCanSave);
    }

    handleChangeendTimeScheduleTwo = (endTimeScheduleTwoDateObj) => {
      const endTimeScheduleTwo = moment(endTimeScheduleTwoDateObj);

      return this.setState({
        endTimeScheduleTwo,
      }, this.checkCanSave);
    }

    onChangeOtherReason = (text) => {
      this.setState({ otherReason: text }, this.checkCanSave);
    }

    onChangeInputSwitch = (state) => {
      const hoursWorking = !this.state.hoursWorking;

      if (hoursWorking) {
        this.onPressRadioGroup(scheduleTypes.find(_scheduleType =>
          _scheduleType.id === ScheduleTypesEnum.Regular));
      }

      this.setState({
        hoursWorking,
      }, this.checkCanSave);
    }

    pickerToogleStartTimeOne = () => {
      if (this.state.startTimeScheduleOnePickerOpen) {
        if (this.state.startTimeScheduleOne.isAfter(this.state.endTimeScheduleOne)) {
          return alert("Start time can't be after end time");
        }
      }

      this.setState({ startTimeScheduleOnePickerOpen: !this.state.startTimeScheduleOnePickerOpen });
    };

    pickerToogleEndTimeOne = () => {
      if (this.state.endTimeScheduleOnePickerOpen) {
        if (this.state.startTimeScheduleOne.isAfter(this.state.endTimeScheduleOne)) {
          return alert("Start time can't be after end time");
        }
      }

      this.setState({ endTimeScheduleOnePickerOpen: !this.state.endTimeScheduleOnePickerOpen });
    };

    pickerToogleStartTimeTwo = () => {
      if (this.state.startTimeScheduleTwoPickerOpen) {
        if (this.state.startTimeScheduleTwo.isAfter(this.state.endTimeScheduleTwo)) {
          return alert("Start time can't be after end time");
        } else if (this.state.endTimeScheduleOne.isAfter(this.state.startTimeScheduleTwo)) {
          return alert("Start time schedule two can't be before end time schedule one");
        }
      }

      this.setState({ startTimeScheduleTwoPickerOpen: !this.state.startTimeScheduleTwoPickerOpen });
    };

    pickerToogleEndTimeTwo = () => {
      if (this.state.endTimeScheduleTwoPickerOpen) {
        if (this.state.startTimeScheduleTwo.isAfter(this.state.endTimeScheduleTwo)) {
          return alert("Start time can't be after end time");
        }
      }
      this.setState({ endTimeScheduleTwoPickerOpen: !this.state.endTimeScheduleTwoPickerOpen });
    };

    onPressRadioGroup = (option, index) => {
      const isEditableOtherReason = option.id === ScheduleTypesEnum.Regular;
      let { hoursWorking, otherReason } = this.state;

      if (!isEditableOtherReason) {
        hoursWorking = false;
        otherReason = '';
      }

      this.setState({
        otherReason, hoursWorking, selectedScheduleExceptionReason: option, isEditableOtherReason,
      }, this.checkCanSave);
    }

    checkCanSave = () => {
      const {
        startTimeScheduleOne, endTimeScheduleOne,
        startTimeScheduleTwo, endTimeScheduleTwo,
      } = this.state;

      let canSave = true;

      const format = 'hh:mm:ss';

      if (this.state.hoursWorking) {
        if ((!!startTimeScheduleOne && !!endTimeScheduleOne) &&
          startTimeScheduleOne.length > 0 && endTimeScheduleOne.length > 0) {
          canSave = (!!startTimeScheduleOne && !!endTimeScheduleOne) &&
          endTimeScheduleOne.isAfter(startTimeScheduleOne);
        }

        if (!!startTimeScheduleTwo && !!endTimeScheduleTwo) {
          if (startTimeScheduleTwo.length > 0 && endTimeScheduleTwo.length > 0) {
            canSave = endTimeScheduleTwo.isAfter(startTimeScheduleTwo) &&
            startTimeScheduleTwo.isAfter(endTimeScheduleOne);
          }
        } else if ((!!endTimeScheduleTwo && startTimeScheduleTwo === '')
          ||
          (!!startTimeScheduleTwo && endTimeScheduleTwo === '')) {
          canSave = false;
        }
      }

      this.props.navigation.setParams({ canSave });
    }

    render() {
      const {
        startTimeScheduleOne,
        endTimeScheduleOne,
        startTimeScheduleTwo,
        endTimeScheduleTwo,
      } = this.state;

      const params = this.props.navigation.state.params || {};
      const date = params.date || moment();

      return (
        <View style={styles.container}>

          {this.props.employeeScheduleState.isLoading ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
      ) : (

        <KeyboardAwareScrollView keyboardShouldPersistTaps="always" ref="scroll" extraHeight={70} enableAutoAutomaticScroll>
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
                <SchedulePicker
                  date={date}
                  format="hh:mm A"
                  label="Start"
                  icon={false}
                  value={startTimeScheduleOne}
                  isOpen={this.state.startTimeScheduleOnePickerOpen}
                  onChange={this.handleChangestartTimeScheduleOne}
                  toggle={this.pickerToogleStartTimeOne}
                />
                <InputDivider />
                <SchedulePicker
                  date={date}
                  format="hh:mm A"
                  label="Ends"
                  icon={false}
                  value={endTimeScheduleOne}
                  isOpen={this.state.endTimeScheduleOnePickerOpen}
                  onChange={this.handleChangeendTimeScheduleOne}
                  toggle={this.pickerToogleEndTimeOne}
                />
              </InputGroup>
              <SectionTitle value="SCHEDULE 2" style={styles.sectionTitle} />
              <InputGroup>
                <SchedulePicker
                  date={date}
                  format="hh:mm A"
                  label="Start"
                  icon={false}
                  value={startTimeScheduleTwo}
                  isOpen={this.state.startTimeScheduleTwoPickerOpen}
                  onChange={this.handleChangestartTimeScheduleTwo}
                  toggle={this.pickerToogleStartTimeTwo}
                />
                <InputDivider />
                <SchedulePicker
                  date={date}
                  format="hh:mm A"
                  label="Ends"
                  icon={false}
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


EditScheduleScreen.defaultProps = {

};

EditScheduleScreen.propTypes = {
  employeeScheduleActions: PropTypes.shape({
    getEmployeeSchedule: PropTypes.func.isRequired,
    getEmployeeScheduleException: PropTypes.func.isRequired,
    putEmployeeSchedule: PropTypes.func.isRequired,
  }).isRequired,
  appointmentCalendarActions: PropTypes.shape({
    setGridView: PropTypes.func.isRequired,
  }).isRequired,
  employeeScheduleState: PropTypes.any.isRequired,
  storeState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  date: PropTypes.string.isRequired,
};

export default EditScheduleScreen;
