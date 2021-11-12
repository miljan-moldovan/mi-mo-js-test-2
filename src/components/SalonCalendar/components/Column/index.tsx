import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { get, filter } from 'lodash';
import { ColumnProps } from '@/models';
import styles from './styles';

enum AlertTypes {
  BookingPast = 1,
  DayOff,
  NotWorkingTime,
}

class Column extends React.Component<ColumnProps, any> {
  onCellPressed = (cellId, colData, date, showNotWorkingTimeAlert?) => {
    const time = moment(
      `${date.format('YYYY-MM-DD')} ${cellId.format('HH:mm')}`,
      'YYYY-MM-DD HH:mm',
    );
    const showBookingPastAlert = moment().isAfter(time, 'minute');
    const showDayOffAlert = colData && colData.isOff;
    if (showBookingPastAlert || showDayOffAlert || showNotWorkingTimeAlert) {
      const type = (showDayOffAlert && AlertTypes.DayOff) ||
        (showNotWorkingTimeAlert && AlertTypes.NotWorkingTime) ||
        (showBookingPastAlert && AlertTypes.BookingPast);
      const needCloseAlert = !(showNotWorkingTimeAlert && showBookingPastAlert);
      return this.showAlert({ cell: cellId, colData, date, type, needCloseAlert });
    }
    return this.props.onCellPressed(cellId, colData);
  };

  isBetweenTimes = (time, fromTime, toTime) =>
    time.isSameOrAfter(fromTime) && time.isBefore(toTime);

  showAlert = ({ cell, colData, type, date, needCloseAlert }) => {
    let alert;

    switch (type) {
      case AlertTypes.BookingPast: {
        alert = {
          title: 'Question',
          description: 'The selected time is in the past. Do you want to book the appointment anyway?',
          btnLeftText: 'No',
          btnRightText: 'Yes',
          onPressRight: () => {
            this.props.onCellPressed(cell, colData);
            this.props.hideAlert();
          },
        };
        break;
      }
      case AlertTypes.DayOff: {
        alert = {
          title: 'Notification',
          description: 'The selected employee is not working on this day.',
          btnLeftText: 'ok',
        };
        break;
      }
      case AlertTypes.NotWorkingTime: {
        alert = {
          title: 'Question',
          description: 'The employee is off at the selected time, would you like to override?',
          btnLeftText: 'No',
          btnRightText: 'Submit',
          onPressRight: () => {
            this.onCellPressed(cell, colData, date, false);
            needCloseAlert && this.props.hideAlert();
          },
        };
        break;
      }
    }
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
      step,
      storeScheduleExceptions,
    } = this.props;
    const { weeklySchedule } = apptGridSettings;
    const isCellDisabled = moment().isAfter(startDate, 'day');
    let isStoreOff = false;
    let exception;
    let storeTodaySchedule;
    let isEmployeeException = '';
    let storeExceptionComment = '';
    // get store schedule for specific date or week depending on the type of view
    // also checko if there is an exception for the date
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
          moment(item.endDate, 'YYYY-MM-DD').isSame(colData, 'day'),
      )[0];
      storeTodaySchedule = exception ? { ...exception, isException: true } : storeTodaySchedule;
    }

    storeExceptionComment = storeTodaySchedule && storeTodaySchedule.isException && storeTodaySchedule.comments
    && (cell.isSame(moment(storeTodaySchedule.end1, 'HH:mm'), 'minute') ||
      cell.isSame(moment(storeTodaySchedule.end2, 'HH:mm'), 'minute')) ?
      storeTodaySchedule.comments : null;

    isStoreOff = !storeTodaySchedule || !storeTodaySchedule.start1;
    // checko if cell is between time the store is off
    if (!isStoreOff) {
      isStoreOff =
        !this.isBetweenTimes(
          cell,
          moment(storeTodaySchedule.start1, 'HH:mm'),
          moment(storeTodaySchedule.end1, 'HH:mm'),
        ) &&
        (!storeTodaySchedule.start2 ||
          !this.isBetweenTimes(
            cell,
            moment(storeTodaySchedule.start2, 'HH:mm'),
            moment(storeTodaySchedule.end2, 'HH:mm'),
          ));
    }
    // o'clock times go bold and dosent show minutes
    let styleOclock = '';
    const timeSplit = moment(cell).add(step, 'm').format('h:mm').split(':');
    const minutesSplit = timeSplit[1];
    if (minutesSplit === '00') {
      styleOclock = styles.oClockBorder;
    }
    let style = styles.cellContainerDisabled;
    let showNotWorkingTimeAlert = true;
    if (!isStoreOff) {
      let schedule = null;
      if (selectedFilter === 'deskStaff' || selectedFilter === 'providers') {
        // check if  is provide rview and set provider schedule
        if (isDate) {
          const hasSchedule = providerSchedule[colData.format('YYYY-MM-DD')];
          if (hasSchedule) {
            [schedule] = providerSchedule[colData.format('YYYY-MM-DD')];
            schedule = schedule ? schedule.scheduledIntervals : null;
          }
        } else {
          schedule = colData.scheduledIntervals;
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
              showNotWorkingTimeAlert = false;
              style = styles.cellContainer;
              break;
            }
          }
        }
      } else {
        showNotWorkingTimeAlert = false;
        style = styles.cellContainer;
      }
      return (
        <View key={cell.format('HH:mm')}>
          <TouchableOpacity
            disabled={isCellDisabled}
            style={[style, { width: cellWidth }, styleOclock]}
            onLongPress={() => {
              this.onCellPressed(cell, colData, !isDate ? startDate : colData, showNotWorkingTimeAlert);
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

  // render rooms name verticaly if settings is enable
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
        room.fromTime,
      ).diff(startTimeMoment, 'minutes');
      const endTimeDifference = this.convertFromTimeToMoment(
        room.toTime,
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

  getAssistantFromProviderSchedule = () => {
    const { colData, providerSchedule } = this.props;
    const columnDate = moment(colData).format('YYYY-MM-DD').toString();
    const scheduleAtDay = providerSchedule[columnDate];
    if (scheduleAtDay && scheduleAtDay.length) {
      return scheduleAtDay[0].assistantAssignment;
    }
    return null;
  };

  renderAssistants = () => {
    const { colData, apptGridSettings } = this.props;
    const assistant = colData.assistantAssignment ?
      colData.assistantAssignment :
      this.getAssistantFromProviderSchedule();
    if (assistant === null) {
      return null;
    }

    const startTime = apptGridSettings.minStartTime;
    const startTimeMoment = this.convertFromTimeToMoment(startTime);
    return assistant.timeIntervals.map(timeInterval => {
      const startTimeDifference = this.convertFromTimeToMoment(
        timeInterval.start,
      ).diff(startTimeMoment, 'minutes');
      const endTimeDifference = this.convertFromTimeToMoment(
        timeInterval.end,
      ).diff(startTimeMoment, 'minutes');
      const startPos = startTimeDifference / apptGridSettings.step * 30;
      const endPos = endTimeDifference / apptGridSettings.step * 30;
      const height = endPos - startPos;
      const containerStyle = [
        styles.assistantContainer,
        {
          height,
          top: startPos,
        },
      ];
      const textStyle = [
        styles.assistantText,
        {
          maxHeight: height,
          minWidth: height,
          maxWidth: height,
        },
      ];
      return (
        <View
          key={assistant.id}
          style={containerStyle}
        >
          <Text style={textStyle} numberOfLines={1}>{assistant.name}</Text>
        </View>
      );
    });
  };

  render() {
    const { apptGridSettings, showRoomAssignments, showAssistantAssignments, providerSchedule } = this.props;
    const rooms = showRoomAssignments ? this.renderRooms() : null;
    const assistants = showAssistantAssignments ? this.renderAssistants() : null;
    return (
      <View style={styles.colContainer}>
        {apptGridSettings.schedule.map(this.renderCell)}
        {rooms}
        {assistants}
      </View>
    );
  }
}

export default Column;
