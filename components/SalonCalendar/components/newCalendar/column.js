import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { get, filter } from 'lodash';

const styles = StyleSheet.create({
  colContainer: {
    flexDirection: 'column',
  },
  cellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderColor: '#C0C1C6',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  cellContainerDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default class Column extends Component {
  onCellPressed = (cellId, colData, date) => {
    const time = moment(`${date.format('YYYY-MM-DD')} ${cellId.format('HH:mm')}`, 'YYYY-MM-DD HH:mm');
    const showAlert = moment().isAfter(time, 'minute');
    if (!showAlert) {
      this.props.onCellPressed(cellId, colData);
    } else {
      this.showBookingPastAlert({ cell: cellId, colData });
    }
  }

  isBetweenTimes = (time, fromTime, toTime) => time.isSameOrAfter(fromTime) && time.isBefore(toTime);

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
  }

  convertFromTimeToMoment = time => moment(time, 'HH:mm');

  renderCell = (cell, index) => {
    const {
      apptGridSettings, colData, cellWidth, isDate, selectedFilter, providerSchedule,
      displayMode, startDate, storeScheduleExceptions
    } = this.props;
    const { weeklySchedule } = apptGridSettings;
    const isCellDisabled = moment().isAfter(startDate, 'day');
    let isStoreOff = false;
    let exception;
    let storeTodaySchedule;
    if (!isDate) {
      exception = get(storeScheduleExceptions, ['0'], null);
      storeTodaySchedule = exception ? exception : weeklySchedule[startDate.isoWeekday() - 1];
    } else {
      storeTodaySchedule = apptGridSettings.weeklySchedule[colData.isoWeekday() - 1];
      exception = filter(storeScheduleExceptions, item => moment(item.startDate, 'YYYY-MM-DD').isSame(colData, 'day'))[0];
      storeTodaySchedule = exception || storeTodaySchedule;
    }
    isStoreOff = !storeTodaySchedule || !storeTodaySchedule.start1;
    if (!isStoreOff) {
      isStoreOff = !this.isBetweenTimes(cell, moment(storeTodaySchedule.start1, 'HH:mm'), moment(storeTodaySchedule.end1, 'HH:mm'))
        && (!storeTodaySchedule.start2 ||
            !this.isBetweenTimes(cell, moment(storeTodaySchedule.start2, 'HH:mm'), moment(storeTodaySchedule.end2, 'HH:mm')));
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
          if (cell.isSameOrAfter(moment(schedule[i].start, 'HH:mm')) &&
          cell.isBefore(moment(schedule[i].end, 'HH:mm'))) {
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
            onPress={() => { this.onCellPressed(cell, colData, !isDate ? startDate : colData); }}
          />
        </View>
      );
    }
    return (
      <View key={cell}>
        <TouchableOpacity
          disabled={isCellDisabled}
          style={[styles.cellContainer, styles.dayOff, { width: cellWidth }, styleOclock]}
          onPress={() => { this.onCellPressed(cell, colData, !isDate ? startDate : colData); }}
        />
      </View>
    );
  }

  renderRooms() {
    const {
      colData, apptGridSettings, selectedFilter,
    } = this.props;

    if (selectedFilter !== 'providers' || !colData || !colData.roomAssignments || !colData.roomAssignments.length) {
      return null;
    }

    const startTime = apptGridSettings.minStartTime;
    const startTimeMoment = this.convertFromTimeToMoment(startTime);
    return colData.roomAssignments.map((room, i) => {
      const startTimeDifference = this.convertFromTimeToMoment(room.fromTime).diff(startTimeMoment, 'minutes');
      const endTimeDifference = this.convertFromTimeToMoment(room.toTime).diff(startTimeMoment, 'minutes');
      const startPosition = (startTimeDifference / apptGridSettings.step) * 30;
      const endPosition = (endTimeDifference / apptGridSettings.step) * 30;
      const height = endPosition - startPosition;
      return (
        <View
          key={`room-${i}`}
          style={{
            position: 'absolute',
            top: startPosition,
            width: 16,
            height,
            backgroundColor: '#082E66',
            right: 0,
            borderRadius: 3,
            zIndex: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              fontSize: 11,
              lineHeight: 11,
              minHeight: 11,
              maxHeight: height,
              minWidth: height,
              maxWidth: height,
              textAlign: 'center',
              margin: 0,
              padding: 0,
              color: 'white',
              transform: [{ rotate: '-90deg' }],
            }}
            numberOfLines={1}
          >{`Room ${room.roomId}`}
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
        { apptGridSettings.schedule.map(this.renderCell) }
        { rooms }
      </View>
    );
  }
}
