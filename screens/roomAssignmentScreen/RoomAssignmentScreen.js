import React from 'react';
import {
  View,
  Text,
  Picker,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { get, times } from 'lodash';
import moment, { isMoment } from 'moment';

import SalonToast from '../appointmentCalendarScreen/components/SalonToast';
import SalonTouchableOpacity from '../../components/SalonTouchableOpacity';
import SalonModalPicker from '../../components/slidePanels/SalonModalPicker';
import Colors from '../../constants/Colors';
import {
  InputButton,
  InputDivider,
  InputGroup,
  SectionTitle,
} from '../../components/formHelpers';
import Icon from '../../components/UI/Icon';
import SalonModal from '../../components/SalonModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    paddingBottom: 60,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc',
    opacity: 0.3,
    zIndex: 999,
    elevation: 2,
  },
});

export default class RoomAssignmentScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const date = params.date || moment();
    const canSave = params.canSave || false;
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    return {
      headerTitle: (
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <Text style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 17,
            lineHeight: 22,
            color: 'white',
          }}
          >
            Room Assignment
          </Text>
          <Text style={{
            fontFamily: 'Roboto',
            fontSize: 10,
            lineHeight: 12,
            color: 'white',
          }}
          >
            {`${employee.name} ${employee.lastName[0]}. - ${moment(date).format('MMM D YYYY')}`}
          </Text>
        </View>
      ),
      headerLeft: (
        <SalonTouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 14, lineHeight: 22, color: 'white' }}>Cancel</Text>
        </SalonTouchableOpacity>
      ),
      headerRight: (
        <SalonTouchableOpacity
          onPress={() => params.handleSave()}
          disabled={!canSave}
        >
          <Text style={{
            fontSize: 14,
            lineHeight: 22,
            color: canSave ? 'white' : 'rgba(0,0,0,0.3)',
          }}
          >Done
          </Text>
        </SalonTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);

    const assignments = times(4, () => ({
      room: null,
      startTime: null,
      endTime: null,
    }));

    this.state = {
      assignments,
      toast: null,
      pickerType: 'room',
      currentOpenAssignment: 0,
      isModalPickerVisible: false,
    };
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  componentDidMount() {
    const params = this.props.navigation.state.params || {};
    const employee = params.employee || null;
    const date = params.date || moment();
    this.props.roomAssignmentActions.getRooms();
    this.props.roomAssignmentActions.getAssignments(date, get(employee, 'id', null), this.composeAssignments);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.roomAssignmentState.assignments !== this.props.roomAssignmentState.assignments) {
  //     this.composeAssignments(nextProps.roomAssignmentState.assignments);
  //   }
  // }

  onPickerChange = (value) => {
    const { pickerType, currentOpenAssignment } = this.state;
    const { roomAssignmentState: { rooms }, chunkedSchedule } = this.props;
    switch (pickerType) {
      case 'startTime':
      case 'endTime': {
        const index = chunkedSchedule.findIndex(time => time.format('hh:mm A') === value);
        this.setState((state) => {
          const newState = state;
          const selectedTime = chunkedSchedule[index] || null;
          newState.assignments[currentOpenAssignment][pickerType] = selectedTime;
          return newState;
        }, this.canSave);
        break;
      }
      case 'room': {
        const index = rooms.findIndex(room => room.name === value);
        this.setState((state) => {
          const newState = state;
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

  getPickerData = () => {
    const { pickerType } = this.state;
    const { roomAssignmentState: { rooms }, chunkedSchedule } = this.props;
    switch (pickerType) {
      case 'startTime':
      case 'endTime':
        return ['Off', ...chunkedSchedule.map(time => time.format('hh:mm A'))];
      case 'room':
      default:
        return ['None', ...rooms.map(room => room.name)];
    }
  }

  getSelectedValue = () => {
    const { assignments, pickerType, currentOpenAssignment } = this.state;
    const time = get(assignments[currentOpenAssignment], pickerType, null);
    switch (pickerType) {
      case 'startTime':
      case 'endTime':
        return isMoment(time) ? time.format('hh:mm A') : 'Off';
      case 'room':
        return get(assignments[currentOpenAssignment].room, 'name', 'None');
      default:
        return null;
    }
  }

  getRoomById = (id) => {
    const [room] = this.props.roomAssignmentState.rooms.filter(item => item.id === id);
    return room;
  }

  hideToast = () => this.setState({ toast: null })

  composeAssignments = assignments => this.setState((state) => {
    const newState = state;
    assignments.forEach((item, index) => {
      newState.assignments[index].room = this.getRoomById(item.roomId);
      newState.assignments[index].startTime = moment(item.fromTime, 'hh:mm:ss');
      newState.assignments[index].endTime = moment(item.toTime, 'hh:mm:ss');
    });
    return newState;
  })

  canSave = () => {
    const { assignments } = this.state;
    const canSave = assignments.map(assignment => (
      this.isValidAssignment(assignment) &&
      !this.isIncompleteAssignment(assignment))).reduce((agg, ass) => agg || ass, false);
    this.props.navigation.setParams({ canSave });
    return canSave;
  }

  closeModal = () => this.setState({ isModalPickerVisible: false })

  openModal = () => this.setState({ isModalPickerVisible: true })

  handleSave = () => {
    if (this.canSave()) {
      const { assignments } = this.state;
      this.props.navigation.setParams({ canSave: false });
      const params = this.props.navigation.state.params || {};
      const employee = get(params, 'employee', null);
      const onSave = get(params, 'onSave', () => null);
      if (assignments.filter(itm => this.isIncompleteAssignment(itm)).length > 0) {
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
        this.serializeAssignmentsForRequest(),
        () => {
          this.props.appointmentCalendarActions.setGridView();
          this.props.appointmentCalendarActions.setFilterOptionRoomAssignments(true);
          this.props.navigation.goBack();
          onSave();
        },
      );
    }
    return false;
  }

  isValidAssignment = assignment => (
    assignment.room !== null &&
    isMoment(assignment.startTime) &&
    isMoment(assignment.endTime) &&
    assignment.startTime < assignment.endTime
  )

  isIncompleteAssignment = assignment => (
    !(
      assignment.room === null &&
      !isMoment(assignment.startTime) &&
      !isMoment(assignment.fromTime)
    ) &&
    (
      assignment.room !== null ||
      isMoment(assignment.startTime) ||
      isMoment(assignment.fromTime)
    ) &&
    !this.isValidAssignment(assignment)
  )

  serializeAssignmentsForRequest = () => {
    const { assignments } = this.state;
    const params = this.props.navigation.state.params || {};
    const date = params.date || moment();
    return assignments.filter(ass => this.isValidAssignment(ass)).map(ass => ({
      date: date.format('YYYY-MM-DD'),
      fromTime: ass.startTime.format('HH:mm:ss'),
      toTime: ass.endTime.format('HH:mm:ss'),
      roomOrdinal: 0,
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
          noIcon
          label="Start"
          labelStyle={labelStyle}
          value={isMoment(assignment.startTime) ? assignment.startTime.format('hh:mm A') : 'Off'}
          onPress={() => this.setState({ currentOpenAssignment: index, pickerType: 'startTime' }, this.openModal)}
        />
        <InputDivider style={dividerStyle} />
        <InputButton
          noIcon
          label="End"
          labelStyle={labelStyle}
          disabled={!isMoment(assignment.startTime)}
          value={isMoment(assignment.endTime) ? assignment.endTime.format('hh:mm A') : '-'}
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
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator />
          </View>
        )}
        <ScrollView>
          <SectionTitle
            value="ASSIGNED TO ROOM"
          />
          {this.renderRoomData()}
        </ScrollView>
        <SalonModalPicker
          pickerData={this.getPickerData()}
          selectedValue={this.getSelectedValue()}
          onValueChange={this.onPickerChange}
          show={this.openModal}
          hide={this.closeModal}
          visible={isModalPickerVisible}
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
      </View>
    );
  }
}
