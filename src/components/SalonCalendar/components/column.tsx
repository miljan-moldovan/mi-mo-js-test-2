import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { get, filter } from 'lodash';
import { ColumnProps } from '@/models';

const styles = StyleSheet.create({
  colContainer: {
    flexDirection: 'column',
  },
  cellContainer: {
    height: 30,
    borderColor: '#C0C1C6',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  cellContainerDisabled: {
    height: 30,
    borderColor: '#C0C1C6',
    backgroundColor: 'rgb(221,223,224)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  oClockBorder: {
    borderBottomColor: '#2c2f34',
  },
  dayOff: {
    backgroundColor: 'rgb(129, 136, 152)',
  },
  exceptionText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    paddingHorizontal: 8,
    color: '#2F3142',
    flex: 1,
  },
  roomContainer: {
    position: 'absolute',
    width: 16,
    backgroundColor: '#082E66',
    right: 0,
    borderRadius: 3,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  roomText: {
    fontSize: 11,
    lineHeight: 11,
    minHeight: 11,
    textAlign: 'center',
    margin: 0,
    padding: 0,
    color: 'white',
    transform: [{ rotate: '-90deg' }],
  },
});

export default class Column extends React.Component<ColumnProps, any> {
  onCellPressed = (cellId, colData, date) => {
    const time = moment(
      `${date.format('YYYY-MM-DD')} ${cellId.format('HH:mm')}`,
      'YYYY-MM-DD HH:mm'
    );
    const showAlert = moment().isAfter(time, 'minute');
    if (!showAlert) {
      this.props.onCellPressed(cellId, colData);
    } else {
      this.showBookingPastAlert({ cell: cellId, colData });
    }
  };

  isBetweenTimes = (time, fromTime, toTime) =>
    time.isSameOrAfter(fromTime) && time.isBefore(toTime);

  showBookingPastAlert = ({ cell, colData }) => {
    const alert = {
      title: 'Question',
      description: 'The selected time is in the past. Do you want to book the appointment anyway?',
      btnLeftText: 'No',
      btnRightText: 'Yes',
      onPressRight: () => {
        this.props.onCellPressed(cell, colData);
        this.props.hideAlert();
      },
    };
    this.props.createAlert(alert);
  };

  convertFromTimeToMoment = time => moment(time, 'HH:mm');

  renderCell = (cell, index) => {
    const {
      apptGridSettings,
      colData,
      cellWidth,
      isDate,
      selectedFilter,
      providerSchedule,
      displayMode,
      startDate,
      storeScheduleExceptions,
    } = this.props;
    const { weeklySchedule } = apptGridSettings;
    const isCellDisabled = moment().isAfter(startDate, 'day');
    let isStoreOff = false;
    let exception;
    let storeTodaySchedule;
    let isEmployeeException = '';
    let storeExceptionComment = '';
    if (!isDate) {
      exception = get(storeScheduleExceptions, ['0'], null);
      storeTodaySchedule = exception ?
        { ...exception, isException: true } : weeklySchedule[startDate.isoWeekday() - 1];
    } else {
      storeTodaySchedule =
        apptGridSettings.weeklySchedule[colData.isoWeekday() - 1];
      exception = filter(
        storeScheduleExceptions,
        item =>
          moment(item.startDate, 'YYYY-MM-DD').isSame(colData, 'day') ||
          moment(item.endDate, 'YYYY-MM-DD').isSame(colData, 'day')
      )[0];
      storeTodaySchedule = exception ? { ...exception, isException: true } : storeTodaySchedule;
    }

    storeExceptionComment = storeTodaySchedule && storeTodaySchedule.isException && storeTodaySchedule.comments
      && (cell.isSame(moment(storeTodaySchedule.end1, 'HH:mm'), 'minute') || cell.isSame(moment(storeTodaySchedule.end2, 'HH:mm'), 'minute')) ? storeTodaySchedule.comments : null;

    isStoreOff = !storeTodaySchedule || !storeTodaySchedule.start1;
    if (!isStoreOff) {
      isStoreOff =
        !this.isBetweenTimes(
          cell,
          moment(storeTodaySchedule.start1, 'HH:mm'),
          moment(storeTodaySchedule.end1, 'HH:mm')
        ) &&
        (!storeTodaySchedule.start2 ||
          !this.isBetweenTimes(
            cell,
            moment(storeTodaySchedule.start2, 'HH:mm'),
            moment(storeTodaySchedule.end2, 'HH:mm')
          ));
    }
    let styleOclock = '';
    const timeSplit = moment(cell).add(15, 'm').format('h:mm').split(':');
    const minutesSplit = timeSplit[1];
    if (minutesSplit === '00') {
      styleOclock = styles.oClockBorder;
    }
    let style = styles.cellContainerDisabled;
    if (!isStoreOff) {
      let schedule;
      switch (selectedFilter) {
        case 'deskStaff':
        case 'providers': {
          if (isDate) {
            const hasSchedule = providerSchedule[colData.format('YYYY-MM-DD')];
            if (hasSchedule) {
              [schedule] = providerSchedule[colData.format('YYYY-MM-DD')];
              schedule = schedule ? schedule.scheduledIntervals : null;
            }
          } else {
            schedule = colData.scheduledIntervals;
          }
          break;
        }
        case 'resources':
        case 'rooms': {
          style = styles.cellContainer;
          break;
        }
        default:
          break;
      }
      if (schedule) {
        for (let i = 0; i < schedule.length; i += 1) {
          if (schedule[i].isException && schedule[i].comment) {
            isEmployeeException += schedule[i].comment;
          }
          if (schedule[i].isOff) {
            break;
          }
          if (
            cell.isSameOrAfter(moment(schedule[i].start, 'HH:mm')) &&
            cell.isBefore(moment(schedule[i].end, 'HH:mm'))
          ) {
            style = styles.cellContainer;
            break;
          }
        }
      }
      return (
        <View key={cell.format('HH:mm')}>
          <TouchableOpacity
            disabled={isCellDisabled}
            style={[style, { width: cellWidth }, styleOclock]}
            onLongPress={() => {
              this.onCellPressed(cell, colData, !isDate ? startDate : colData);
            }}
          >
            {index === 0 && isEmployeeException
              ? <Text style={styles.exceptionText}>{isEmployeeException}</Text>
              : null}
            {storeExceptionComment
              ? <Text style={styles.exceptionText}>{storeExceptionComment}</Text>
              : null}
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View key={cell}>
        <TouchableOpacity
          disabled={isCellDisabled}
          style={[
            styles.cellContainer,
            styles.dayOff,
            { width: cellWidth },
            styleOclock,
          ]}
          onLongPress={() => {
            this.onCellPressed(cell, colData, !isDate ? startDate : colData);
          }}
        >
          {storeExceptionComment
            ? <Text style={styles.exceptionText}>{storeExceptionComment}</Text>
            : null}
          {index === 0 && isEmployeeException
            ? <Text style={styles.exceptionText}>{isEmployeeException}</Text>
            : null}
        </TouchableOpacity>
      </View>
    );
  };

  renderRooms() {
    const { colData, apptGridSettings, selectedFilter, rooms } = this.props;
    if (
      selectedFilter !== 'providers' ||
      !colData ||
      !colData.roomAssignments ||
      !colData.roomAssignments.length
    ) {
      return null;
    }

    const startTime = apptGridSettings.minStartTime;
    const startTimeMoment = this.convertFromTimeToMoment(startTime);
    return colData.roomAssignments.map((room, i) => {
      const startTimeDifference = this.convertFromTimeToMoment(
        room.fromTime
      ).diff(startTimeMoment, 'minutes');
      const endTimeDifference = this.convertFromTimeToMoment(
        room.toTime
      ).diff(startTimeMoment, 'minutes');
      const startPosition = startTimeDifference / apptGridSettings.step * 30;
      const endPosition = endTimeDifference / apptGridSettings.step * 30;
      const height = endPosition - startPosition;
      const containerStyle = [
        styles.roomContainer,
        {
          height,
          top: startPosition,
        },
      ];
      const textStyle = [
        styles.roomText,
        {
          maxHeight: height,
          minWidth: height,
          maxWidth: height,
        },
      ];
      const selectedRoom = rooms.find(itm => itm.id === room.roomId);
      const roomName = get(selectedRoom, 'name', '');
      return (
        <View
          key={`room-${get(colData, 'id', '')}-${room.roomId}`}
          style={containerStyle}
        >
          <Text style={textStyle} numberOfLines={1}>
            {`${roomName} #${room.roomOrdinal}`}
          </Text>
        </View>
      );
    });
  }

  render() {
    const { apptGridSettings, showRoomAssignments } = this.props;
    const rooms = showRoomAssignments ? this.renderRooms() : null;
    return (
      <View style={styles.colContainer}>
        {apptGridSettings.schedule.map(this.renderCell)}
        {rooms}
      </View>
    );
  }
}
