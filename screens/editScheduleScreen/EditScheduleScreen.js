import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { get } from 'lodash';
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
import SalonTimePicker from '../../components/formHelpers/components/SalonTimePicker';
import styles from './styles';
import ScheduleTypesEnum from '../../constants/ScheduleTypes';

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
    hoursWorking: false,
    selectedScheduleExceptionReason: scheduleTypes.find(_scheduleType =>
      _scheduleType.id === ScheduleTypesEnum.Regular),
    isEditableOtherReason: false,
  }

  componentWillMount() {
    const params = this.props.navigation.state.params || {};
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    const date = params.date || moment();
    const formatedDate = moment(date).format('YYYY-MM-DD');
    this.props.employeeScheduleActions.getEmployeeSchedule(employee.id, formatedDate, (result) => {
      if (result) {
        this.getState();
      }
    });
  }


  getState = () => {
    let employeeSchedule = this.props.employeeScheduleState.employeeSchedule || false;
    employeeSchedule = employeeSchedule[employeeSchedule.length - 1];

    let scheduleTypeId = get(employeeSchedule, 'scheduleType', -1);

    let otherReason = get(employeeSchedule, 'comments', '');
    scheduleTypeId = otherReason !== null && otherReason.length > 0 ? 0 : scheduleTypeId;

    otherReason = otherReason !== null ? otherReason : '';

    const hoursWorking = employeeSchedule ? ((!!employeeSchedule.start1 && !!employeeSchedule.end1) ||
    (!!employeeSchedule.start2 && !!employeeSchedule.end2)) : false;

    let selectedScheduleExceptionReason = scheduleTypes.find(_scheduleType =>
      _scheduleType.id === scheduleTypeId);
    selectedScheduleExceptionReason = selectedScheduleExceptionReason || scheduleTypes.find(_scheduleType =>
      _scheduleType.id === ScheduleTypesEnum.Regular);

    let startTimeScheduleOne = get(employeeSchedule, 'start1', '00:00:00');
    startTimeScheduleOne = startTimeScheduleOne ? moment(startTimeScheduleOne, 'HH:mm:ss') : '';

    let endTimeScheduleOne = get(employeeSchedule, 'end1', '23:59:59');
    endTimeScheduleOne = endTimeScheduleOne ? moment(endTimeScheduleOne, 'HH:mm:ss') : '';

    let startTimeScheduleTwo = get(employeeSchedule, 'start2', null);
    startTimeScheduleTwo = startTimeScheduleTwo ? moment(startTimeScheduleTwo, 'HH:mm:ss') : '';

    let endTimeScheduleTwo = get(employeeSchedule, 'end2', null);
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


      const schedule = {
        existingExceptionId: this.props.employeeScheduleState.employeeSchedule.id,
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
        startTimeScheduleOne: '',
        endTimeScheduleOne: '',
        startTimeScheduleTwo: '',
        endTimeScheduleTwo: '',
      }, this.checkCanSave);
    }

    pickerToogleStartTimeOne = () => {
      if (this.state.startTimeScheduleOnePickerOpen && this.state.startTimeScheduleOne.isAfter(this.state.endTimeScheduleOne)) {
        return alert("Start time can't be after end time");
      }

      this.setState({ startTimeScheduleOnePickerOpen: !this.state.startTimeScheduleOnePickerOpen });
    };

    pickerToogleEndTimeOne = () => {
      if (this.state.endTimeScheduleOnePickerOpen && this.state.startTimeScheduleOne.isAfter(this.state.endTimeScheduleOne)) {
        return alert("Start time can't be after end time");
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
      if (this.state.endTimeScheduleTwoPickerOpen && this.state.startTimeScheduleTwo.isAfter(this.state.endTimeScheduleTwo)) {
        return alert("Start time can't be after end time");
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
        otherReason, startTimeScheduleOne, endTimeScheduleOne,
        startTimeScheduleTwo, endTimeScheduleTwo,
        selectedScheduleExceptionReason,
      } = this.state;

      let canSave = true;

      if (this.state.hoursWorking) {
        canSave = (!!startTimeScheduleOne && !!endTimeScheduleOne) &&
        endTimeScheduleOne.isAfter(startTimeScheduleOne);

        if (!!startTimeScheduleTwo && !!endTimeScheduleTwo) {
          canSave = endTimeScheduleTwo.isAfter(startTimeScheduleTwo) &&
          startTimeScheduleTwo.isAfter(endTimeScheduleOne);
        } else if ((!!endTimeScheduleTwo && startTimeScheduleTwo === '')
          ||
          (!!startTimeScheduleTwo && endTimeScheduleTwo === '')) {
          canSave = false;
        }
      }

      const isEditableOtherReason = selectedScheduleExceptionReason.id === ScheduleTypesEnum.Regular;

      if (isEditableOtherReason) {
        canSave = canSave && otherReason && otherReason.length > 0;
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
              autoFocus={this.state.isEditableOtherReason}
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
    putEmployeeSchedule: PropTypes.func.isRequired,
  }).isRequired,
  appointmentCalendarActions: PropTypes.shape({
    setGridView: PropTypes.func.isRequired,
  }).isRequired,
  employeeScheduleState: PropTypes.any.isRequired,
  navigation: PropTypes.any.isRequired,
  date: PropTypes.string.isRequired,
};

export default EditScheduleScreen;
