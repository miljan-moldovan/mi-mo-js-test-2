import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { get, slice, times, orderBy, cloneDeep } from 'lodash';
import moment, { isMoment } from 'moment';

import Colors from '../../constants/Colors';
import DateTime from '../../constants/DateTime';
import SalonToast from '../appointmentCalendarScreen/components/SalonToast';
import LoadingOverlay from '../../components/LoadingOverlay';
import SalonModalPicker from '../../components/slidePanels/SalonModalPicker';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import {
  InputButton,
  InputDivider,
  InputGroup,
  SectionTitle,
} from '../../components/formHelpers';

import styles from './styles';

export default class RoomAssignmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const date = params.date || moment();
    const canSave = params.canSave || false;
    const onPress = () => params.handleSave();
    const doneButtonStyle = { color: canSave ? 'white' : 'rgba(0,0,0,0.3)' };
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    return {
      headerTitle: (
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleText}>Room Assignment</Text>
          <Text style={styles.headerSubtitleText}>
            {`${employee.name} ${employee.lastName[0]}. - ${moment(date).format(DateTime.dateWithMonthShort)}`}
          </Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity style={styles.leftButton} onPress={navigation.goBack}>
          <Text style={styles.headerButton}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          style={styles.rightButton}
          onPress={onPress}
          disabled={!canSave}
        >
          <Text style={[styles.headerButton, doneButtonStyle]}>Done</Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  componentDidMount() {
    const params = this.props.navigation.state.params || {};
    const employee = params.employee || null;
    const date = params.date || moment();
    this.props.roomAssignmentActions.getAssignments(date, get(employee, 'id', null));
  }

  componentWillReceiveProps(nextProps) {
    const {
      roomAssignmentState: { isLoading: nextIsLoading, isError, isUpdating },
    } = nextProps;
    const {
      roomAssignmentState: { isLoading: prevIsLoading },
    } = this.props;
    if (nextIsLoading !== prevIsLoading && !isUpdating && !isError) {
      this.setState(state => ({ ...this.getStateFromProps(nextProps, state) }), this.canSave);
    }
  }

  onPickerChange = (value) => {
    const { pickerType, currentOpenAssignment } = this.state;
    const { roomAssignmentState: { rooms }, chunkedSchedule } = this.props;
    switch (pickerType) {
      case 'startTime':
      case 'endTime': {
        const index =
          chunkedSchedule.findIndex(time => time.format(DateTime.displayTime) === value);
        this.setState((state) => {
          const newState = cloneDeep(state);
          const selectedTime = chunkedSchedule[index] || null;
          newState.assignments[currentOpenAssignment][pickerType] = selectedTime;
          if (!isMoment(selectedTime) && pickerType === 'startTime') {
            newState.assignments[currentOpenAssignment].endTime = null;
          }
          return newState;
        }, this.canSave);
        break;
      }
      case 'room': {
        const index = rooms.findIndex(room => room.name === value);
        this.setState((state) => {
          const newState = cloneDeep(state);
          const selectedRoom = rooms[index] ? rooms[index] : null;
          newState.assignments[currentOpenAssignment].room = selectedRoom;
          return newState;
        }, this.canSave);
        break;
      }
      default:
        break;
    }
  }

  get pickerData() {
    const { pickerType } = this.state;
    const { roomAssignmentState: { rooms }, chunkedSchedule } = this.props;
    switch (pickerType) {
      case 'startTime':
      case 'endTime':
        return ['Off', ...chunkedSchedule.map(time => time.format(DateTime.displayTime))];
      case 'room':
      default:
        return ['None', ...rooms.map(room => room.name)];
    }
  }

  get hasIncompleteAssignments() {
    const { assignments } = this.state;
    return assignments.reduce((agg, assignment) => (
      (
        !!assignment.room ||
        isMoment(assignment.startTime) ||
        isMoment(assignment.fromTime)
      ) &&
      !this.isValidAssignment(assignment)
    ) || agg, false);
  }

  get selectedValue() {
    const { assignments, pickerType, currentOpenAssignment } = this.state;
    const time = get(assignments[currentOpenAssignment], pickerType, null);
    switch (pickerType) {
      case 'startTime':
      case 'endTime':
        return isMoment(time) ? time.format(DateTime.displayTime) : 'Off';
      case 'room':
        return get(assignments[currentOpenAssignment], 'room.name', 'None');
      default:
        return null;
    }
  }

  getStateFromProps = (props, prevState = null) => {
    const {
      roomAssignmentState: { rooms, assignments: roomAssignments },
    } = props;
    const toast = get(prevState, 'toast', null);
    const pickerType = get(prevState, 'pickerType', 'room');
    const currentOpenAssignment = get(prevState, 'currentOpenAssignment', 0);
    const isModalPickerVisible = get(prevState, 'isModalPickerVisible', false);
    const assignments = roomAssignments.map((itm) => {
      const room = rooms.find(rm => get(itm, 'roomId', null) === get(rm, 'id'));
      return {
        room,
        roomOrdinal: get(itm, 'roomOrdinal', get(room, 'roomOrdinal', 0)),
        startTime: room ? moment(itm.fromTime, DateTime.time) : null,
        endTime: room ? moment(itm.toTime, DateTime.time) : null,
      };
    });
    if (assignments.length < 4) {
      times(4 - assignments.length, () => assignments.push({
        room: null,
        roomOrdinal: null,
        startTime: null,
        endTime: null,
      }));
    }
    return {
      toast,
      pickerType,
      assignments: slice(assignments, 0, 4),
      isModalPickerVisible,
      currentOpenAssignment,
    };
  }

  getRoomById = (id) => {
    const [room] = this.props.roomAssignmentState.rooms.filter(item => item.id === id);
    return room;
  }

  hideToast = () => this.setState({ toast: null })

  canSave = () => {
    const { assignments } = this.state;
    const canSave = assignments.map(assignment => (
      this.isValidAssignment(assignment) &&
      !this.isIncompleteAssignment(assignment))).reduce((agg, ass) => agg || ass, false);
    this.props.navigation.setParams({ canSave });
    return canSave;
  }

  closeModal = () => this.setState((state) => {
    const newState = cloneDeep(state);
    newState.isModalPickerVisible = false;
    // newState.assignments.forEach((ass, index) => {
    //   if (!ass.room) {
    //     newState.assignments[index].startTime = null;
    //     newState.assignments[index].endTime = null;
    //   } else if (ass.room && !isMoment(ass.startTime)) {
    //     newState.assignments[index].endTime = null;
    //   }
    // });
    return newState;
  }, this.canSave)

  openModal = () => this.setState({ isModalPickerVisible: true }, this.canSave)

  handleSave = () => {
    if (this.canSave()) {
      const { assignments } = this.state;
      this.props.navigation.setParams({ canSave: false });
      const params = this.props.navigation.state.params || {};
      const employee = get(params, 'employee', null);
      const date = get(params, 'date', null);
      const onSave = get(params, 'onSave', () => null);
      if (this.hasIncompleteAssignments) {
        return this.setState({
          toast: {
            description: 'You have invalid assignments. Please try again.',
            btnRight: 'OK',
            type: 'error',
          },
          assignments: assignments.map(itm => (
            this.isIncompleteAssignment(itm) ?
              { ...itm, isIncomplete: true } : { ...itm, isIncomplete: false }
          )),
        });
      }
      return this.props.roomAssignmentActions.putAssignments(
        get(employee, 'id', null),
        moment(date).format(DateTime.date),
        this.serializeAssignmentsForRequest(),
        () => {
          this.props.appointmentCalendarActions.setGridView();
          this.props.appointmentCalendarActions.setFilterOptionRoomAssignments(true);
          this.props.appointmentCalendarActions.setToast({
            description: 'Room Assignment Completed',
            type: 'green',
            btnRightText: 'DISMISS',
          });
          this.props.navigation.goBack();
          onSave();
        },
      );
    }
    return false;
  }

  isValidAssignment = assignment => (
    !!assignment.room &&
    isMoment(assignment.startTime) &&
    isMoment(assignment.endTime) &&
    assignment.endTime.isAfter(assignment.startTime)
  )

  isIncompleteAssignment = assignment => (
    (
      !!assignment.room ||
      isMoment(assignment.startTime) ||
      isMoment(assignment.fromTime)
    ) &&
    !this.isValidAssignment(assignment)
  )

  serializeAssignmentsForRequest = () => {
    const { assignments } = this.state;
    const params = this.props.navigation.state.params || {};
    const date = params.date || moment();
    const employee = get(params, 'employee', null);
    return assignments.filter(ass => this.isValidAssignment(ass))
      .sort((a, b) => a.startTime.diff(b.startTime)).map(ass => ({
        date: date.format(DateTime.date),
        employeeId: get(employee, 'id', null),
        fromTime: ass.startTime.format(DateTime.time),
        toTime: ass.endTime.format(DateTime.time),
        roomOrdinal: get(ass.room, 'roomOrdinal', 1),
        roomId: get(ass.room, 'id', null),
      }));
  }

  renderRoomData = () => this.state.assignments.map((assignment, index) => {
    const labelStyle = assignment.isIncomplete ? { color: Colors.defaultRed } : {};
    const dividerStyle = assignment.isIncomplete ? { backgroundColor: Colors.defaultRed } : {};
    return (
      <InputGroup style={styles.marginBottom}>
        <InputButton
          label="Room"
          labelStyle={labelStyle}
          value={assignment.room ? assignment.room.name : 'None'}
          onPress={() => this.setState({ currentOpenAssignment: index, pickerType: 'room' }, this.openModal)}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          icon={false}
          label="Start"
          labelStyle={labelStyle}
          value={isMoment(assignment.startTime) ? assignment.startTime.format(DateTime.displayTime) : 'Off'}
          onPress={() => this.setState({ currentOpenAssignment: index, pickerType: 'startTime' }, this.openModal)}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          icon={false}
          label="End"
          labelStyle={labelStyle}
          disabled={!isMoment(assignment.startTime)}
          value={isMoment(assignment.endTime) ? assignment.endTime.format(DateTime.displayTime) : '-'}
          onPress={() => this.setState({ currentOpenAssignment: index, pickerType: 'endTime' }, this.openModal)}
        />
      </InputGroup>
    );
  })

  render() {
    const {
      isLoading,
    } = this.props.roomAssignmentState;
    const {
      toast,
      isModalPickerVisible,
    } = this.state;
    return (
      <View style={styles.container}>
        {
          isLoading
            ? (
              <LoadingOverlay />
            ) : (
              <React.Fragment>
                <ScrollView>
                  <SectionTitle
                    value="ASSIGNED TO ROOM"
                  />
                  {this.renderRoomData()}
                </ScrollView>
                <SalonModalPicker
                  show={this.openModal}
                  hide={this.closeModal}
                  visible={isModalPickerVisible}
                  pickerData={this.pickerData}
                  onValueChange={this.onPickerChange}
                  selectedValue={this.selectedValue}
                />
                {
                  toast && (
                    <SalonToast
                      description={toast.description}
                      type={toast.type}
                      btnRightText={toast.btnRight}
                      hide={this.hideToast}
                    />
                  )
                }
              </React.Fragment>
            )
        }
      </View>
    );
  }
}
