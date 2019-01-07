import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { get, chain, times, flatten, isString, zipObject } from 'lodash';
import moment, { isMoment } from 'moment';
import uuid from 'uuid/v4';

import DateTime from '@/constants/DateTime';
import SalonToast from '../../appointmentCalendarScreen/components/SalonToast';
import LoadingOverlay from '@/components/LoadingOverlay';
import SalonModalPicker from '@/components/slidePanels/SalonModalPicker';
import SalonTouchableOpacity from '@/components/SalonTouchableOpacity';
import { SectionTitle } from '@/components/formHelpers';
import styles from '../styles';
import SalonHeader from '@/components/SalonHeader';
import { PureProvider, TimeInterval } from '@/models';
import { Employees, Store } from '@/utilities/apiWrapper';
import { showErrorAlert } from '@/redux/actions/utils';
import extendedMoment from '@/utilities/helpers/getRangeExtendedMoment';
import { areDateRangeOverlapped } from '@/utilities/helpers';
import { generateTimeRangeItems } from '@/utilities/helpers/getTimeRange';
import { durationToMoment } from '@/utilities/helpers/durationToMoment';
import { DateRange, MomentRange } from 'moment-range';
import { RoomAssignmentScreenProps, RoomAssignmentScreenState, RoomItem } from '../interfaces';
import AssignmentForm from './AssignmentForm';


const maxAssignments = 4;

class RoomAssignmentScreen extends React.Component<RoomAssignmentScreenProps, RoomAssignmentScreenState> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const date = params.date || moment();
    const canSave = params.canSave || false;
    const onPress = () => params.handleSave();
    const doneButtonStyle = { color: canSave ? 'white' : 'rgba(0,0,0,0.3)' };
    const employee = params.employee || { name: 'First', lastName: 'Available' };
    const subTitle = `${employee.name} ${employee.lastName[0]}. - ${moment(date).format(DateTime.dateWithMonthShort)}`;
    return {
      header: (
        <SalonHeader
          title="Room Assignment"
          subTitle={subTitle}
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
              onPress={onPress}
              disabled={!canSave}
            >
              <Text style={[styles.headerButton, doneButtonStyle]}>Done</Text>
            </SalonTouchableOpacity>
          }
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      toast: null,
      pickerType: 'room',
      rooms: [],
      roomItems: [],
      availableIntervals: [],
      isModalPickerVisible: false,
      employeeScheduledIntervals: [],
      currentOpenAssignment: '',
    };
    this.props.navigation.setParams({ handleSave: this.handleSave });
  }

  componentDidMount() {
    const employee: PureProvider = this.props.navigation.getParam('employee');
    const date = this.props.navigation.getParam('date', moment());
    this.setState({ isLoading: true }, () => {
      Promise.all([
        Employees.getRoomAssignments(date.format(DateTime.date), employee.id),
        Employees.getEmployeeSchedule(employee.id, date.format(DateTime.date)),
        Store.getRooms(),
        Store.getSchedule(date.format(DateTime.date)),
      ])
        .then(([
          assignments,
          schedule,
          rooms,
          storeSchedule,
        ]) => {
          const roomItems: RoomItem[] = times(maxAssignments, number => {
            const assignment = assignments[number];
            if (!assignment) {
              return {
                itemId: uuid(),
                room: null,
                roomOrdinal: 0,
                fromTime: null,
                toTime: null,
                isIncomplete: false,
              } as RoomItem;
            }
            return Object.assign({}, assignment, {
              itemId: uuid(),
              isIncomplete: false,
              room: rooms.find(itm => itm.id === assignment.roomId),
              fromTime: moment(assignment.fromTime, DateTime.time),
              toTime: moment(assignment.toTime, DateTime.time),
            });
          });
          const employeeScheduledIntervals = flatten(schedule.scheduledIntervals.map(employeeInterval => {
            const momentEmployeeStart = moment(employeeInterval.start, DateTime.time);
            const momentEmployeeEnd = moment(employeeInterval.end, DateTime.time);

            return storeSchedule.scheduledIntervals.map(storeInterval => {
              const momentStoreStart = moment(storeInterval.start, DateTime.time);
              const momentStoreEnd = moment(storeInterval.end, DateTime.time);

              const overlapInterval = areDateRangeOverlapped(
                momentEmployeeStart, momentEmployeeEnd, momentStoreStart, momentStoreEnd,
              );

              if (!overlapInterval) {
                return null;
              }

              const start = momentEmployeeStart.isBefore(momentStoreStart)
                ? storeInterval.start : employeeInterval.start;
              const end = momentEmployeeEnd.isAfter(momentStoreEnd) ? storeInterval.end : employeeInterval.end;

              return {
                startsAt: moment.duration(start),
                endsAt: moment.duration(end),
              };
            }).filter(item => !!item);
          }));
          this.setState({
            isLoading: false,
            roomItems,
            schedule,
            employeeScheduledIntervals,
            rooms,
          }, this.setAvailableTimeIntervals);
        })
        .catch(err => {
          showErrorAlert(err);
        });
    });
  }

  onPressRoom = (roomId: string) => this.setState(
    {
      currentOpenAssignment: roomId,
      pickerType: 'room',
    },
    this.openModal,
  );

  onPressFromTime = (roomId: string) =>
    this.setState(
      { currentOpenAssignment: roomId, pickerType: 'fromTime' },
      this.openModal,
    )

  onPressToTime = (roomId: string) =>
    this.setState(
      { currentOpenAssignment: roomId, pickerType: 'toTime' },
      this.openModal,
    )

  onPickerChange = value => {
    const {
      rooms,
      pickerType,
      currentOpenAssignment,
    } = this.state;
    switch (pickerType) {
      case 'fromTime':
      case 'toTime': {
        this.setState(state => {
          const roomItems = [...state.roomItems];
          const selectedTime = moment(value, DateTime.displayTime);
          return {
            roomItems: roomItems.map(itm => {
              return itm.itemId === currentOpenAssignment
                ? {
                  ...itm,
                  fromTime: pickerType === 'fromTime'
                    ? selectedTime : itm.fromTime,
                  toTime: pickerType === 'toTime'
                    ? selectedTime : (!isMoment(selectedTime) && pickerType === 'fromTime') ? null : itm.toTime,
                } : itm;
            }),
          };
        }, this.setAvailableTimeIntervals);
        break;
      }
      case 'room': {
        const selectedRoom = rooms.find(
          room => room.name === value.replace(/ \#.*/, ''),
        );
        this.setState(state => {
          const roomItems = [...state.roomItems];
          const roomOrdinal = isNaN(Number(value.replace(/^.*\#/, '')))
            ? 1 : Number(value.replace(/^.*\#/, ''));
          return {
            roomItems: roomItems.map(itm => {
              return itm.itemId === currentOpenAssignment
                ? {
                  ...itm,
                  roomOrdinal,
                  room: selectedRoom || null,
                  roomId: get(selectedRoom, 'id', null),
                } : itm;
            }),
          };
        }, this.setAvailableTimeIntervals);
        break;
      }
      default:
        break;
    }
  };

  get pickerData() {
    const {
      rooms,
      roomItems,
      pickerType,
      availableIntervals,
      currentOpenAssignment,
    } = this.state;
    switch (pickerType) {
      case 'toTime':
      case 'fromTime': {
        const { step } = this.props;
        const roomItemIndex = roomItems.findIndex(itm => itm.itemId === currentOpenAssignment);
        const roomItemIntervals = availableIntervals[roomItemIndex];
        if (!roomItemIntervals) {
          return ['Off'];
        }
        const ranges = chain(roomItemIntervals)
          .map(interval => extendedMoment.range(
            durationToMoment(get(interval, 'startsAt')), durationToMoment(get(interval, 'endsAt')),
          ))
          .map(range => range.by('minutes', { step }))
          .map(range => Array.from(range))
          .flatten()
          .value();
        return [
          'Off',
          ...ranges.map(time => time.format(DateTime.displayTime)),
        ];
      }
      case 'room':
      default:
        const roomOptions = flatten(
          rooms.map(room => {
            return times(room.roomCount, i => {
              const roomNumber = i + 1;
              return `${room.name} #${roomNumber}`;
            });
          }),
        );
        return ['None', ...roomOptions];
    }
  }

  get hasIncompleteAssignments() {
    const { roomItems } = this.state;
    return roomItems.reduce(
      (agg, assignment) =>
        ((!!assignment.room ||
          isMoment(assignment.fromTime) ||
          isMoment(assignment.toTime)) &&
          !this.isValidAssignment(assignment)) ||
        agg,
      false,
    );
  }

  get selectedValue() {
    const { roomItems, pickerType, currentOpenAssignment } = this.state;
    const roomItem = roomItems.find(itm => itm.itemId === currentOpenAssignment);
    if (!roomItem) {
      return null;
    }
    switch (pickerType) {
      case 'fromTime':
      case 'toTime':
        const time = get(roomItem, pickerType, null);
        return isMoment(time) ? time.format(DateTime.displayTime) : 'Off';
      case 'room':
        const roomName = get(roomItem, 'room.name', false);
        const roomOrdinal = get(roomItem, 'roomOrdinal', 1);
        return isString(roomName) ? `${roomName} #${roomOrdinal}` : 'None';
      default:
        return null;
    }
  }

  setAvailableTimeIntervals = () => {
    const { employeeScheduledIntervals, roomItems } = this.state;
    const { step } = this.props;
    const keys = times(maxAssignments);
    const _values = keys.map(rowIndex => {
      const allSelectedTimeRangesExceptCurrent = chain(roomItems)
        .filter((item, index) => index !== rowIndex)
        .filter((item) => (
          !!item.room &&
          (isMoment(item.fromTime) && item.fromTime.isValid()) &&
          (isMoment(item.toTime) && item.toTime.isValid())
        ))
        .map(item => { return extendedMoment.range(item.fromTime, item.toTime); })
        .value();

      return chain(employeeScheduledIntervals)
        .map(
          item =>
            generateTimeRangeItems(durationToMoment(item.startsAt), durationToMoment(item.endsAt), step),
        )
        .flatten()
        .filter(item => {
          return !allSelectedTimeRangesExceptCurrent.some((timeRange: DateRange) => {
            return timeRange.contains(item, { excludeEnd: true });
          });
        })
        .map(item => item.format(DateTime.time))
        .reduce((result, item, index, array) => {
          const itemMoment = moment(item, DateTime.time);
          const nextItem = array[index + 1];
          const prevItem = array[index - 1];
          const lastElement = !nextItem;
          const firstElement = !prevItem;
          const isStartOfInterval =
            firstElement || itemMoment.diff(moment(prevItem, DateTime.time), 'm') > step;
          const isEndOfInterval =
            lastElement || moment(nextItem, DateTime.time).diff(itemMoment, 'm') > step;
          return [
            ...result,
            isEndOfInterval || isStartOfInterval ? item : null,
            isStartOfInterval && isEndOfInterval ? itemMoment.clone().add(step).format(DateTime.time) : null,
          ];
        }, [])
        .compact()
        .map(moment.duration)
        .chunk(2)
        .map((item: [moment.Duration, moment.Duration]): TimeInterval => ({
          startsAt: item[0],
          endsAt: item[1],
        }))
        .value();
    });

    this.setState({ availableIntervals: zipObject(keys, _values) }, this.canSave);
  }

  hideToast = () => this.setState({ toast: null });

  canSave = () => {
    const { roomItems } = this.state;
    const canSave = roomItems
      .map(assignment => this.isValidAssignment(assignment))
      .reduce((agg, ass) => agg || ass, false);
    this.props.navigation.setParams({ canSave });
    return canSave;
  };

  closeModal = () => this.setState({ isModalPickerVisible: false }, this.canSave);

  openModal = () => this.setState({ isModalPickerVisible: true }, this.canSave);

  handleSave = () => {
    if (this.canSave()) {
      const { roomItems } = this.state;
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
          roomItems: roomItems.map(
            itm => this.isIncompleteAssignment(itm)
              ? { ...itm, isIncomplete: true }
              : { ...itm, isIncomplete: false },
          ),
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
            type: 'green',
            description: 'Room Assignment Completed',
            btnRightText: 'DISMISS',
          });
          this.props.navigation.goBack();
          onSave();
        },
      );
    }
    return false;
  };

  isValidAssignment = (roomItem: RoomItem) => (
    !!roomItem.room &&
    (isMoment(roomItem.fromTime) && roomItem.fromTime.isValid()) &&
    (isMoment(roomItem.toTime) && roomItem.toTime.isValid()) &&
    roomItem.toTime.isAfter(roomItem.fromTime) &&
    !roomItem.isIncomplete
  );

  isIncompleteAssignment = (assignment: RoomItem) => assignment.isIncomplete;

  serializeAssignmentsForRequest = () => {
    const { roomItems } = this.state;
    const params = this.props.navigation.state.params || {};
    const date = params.date || moment();
    const employee = get(params, 'employee', null);
    return roomItems
      .filter(ass => this.isValidAssignment(ass))
      .sort((a, b) => a.fromTime.diff(b.fromTime))
      .map(ass => ({
        date: date.format(DateTime.date),
        employeeId: get(employee, 'id', null),
        fromTime: ass.fromTime.format(DateTime.time),
        toTime: ass.toTime.format(DateTime.time),
        roomOrdinal: get(ass, 'roomOrdinal', 1),
        roomId: get(ass.room, 'id', null),
      }));
  };

  renderRoomData = () => {
    const { roomItems } = this.state;
    return roomItems.map(item => (
      <AssignmentForm
        assignment={item}
        onPressRoom={this.onPressRoom}
        onPressFromTime={this.onPressFromTime}
        onPressToTime={this.onPressToTime}
      />
    ));
  };

  render() {
    const { isLoading } = this.props.roomAssignmentState;
    const { toast, isModalPickerVisible } = this.state;
    return (
      <View style={styles.container}>
        {
          isLoading &&
          <LoadingOverlay />
        }
        <ScrollView>
          <SectionTitle value="ASSIGNED TO ROOM" />
          {
            this.renderRoomData()
          }
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
          toast &&
          <SalonToast
            description={toast.description}
            type={toast.type}
            btnRightText={toast.btnRight}
            hide={this.hideToast}
          />
        }
      </View>
    );
  }
}
export default RoomAssignmentScreen;
