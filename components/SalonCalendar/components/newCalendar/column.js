import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';

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
    backgroundColor: '#dddfe0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  oClockBorder: {
    borderBottomColor: '#2c2f34',
  },
});

export default class Column extends Component {
  onCellPressed = (cellId, colData) => {
    this.props.onCellPressed(cellId, colData);
  }

  convertFromTimeToMoment = time => moment(time, 'HH:mm');

  renderCell = (cell, index) => {
    const {
      apptGridSettings, colData, cellWidth, isDate, selectedFilter, providerSchedule,
    } = this.props;
    const time = moment(cell, 'HH:mm A');
    let style = styles.cellContainerDisabled;
    let schedule;
    switch (selectedFilter) {
      case 'providers': {
        if (isDate) {
          [schedule] = providerSchedule[colData.format('YYYY-MM-DD')];
          schedule = schedule ? schedule.scheduledIntervals : null;
        } else {
          schedule = colData.scheduledIntervals;
        }
        break;
      }
      case 'resources':
      case 'rooms': {
        schedule = providerSchedule.scheduledIntervals;
        break;
      }
      default:
        break;
    }
    if (schedule) {
      for (let i = 0; i < schedule.length; i += 1) {
        if (time.isSameOrAfter(moment(schedule[i].start, 'HH:mm')) &&
        time.isBefore(moment(schedule[i].end, 'HH:mm'))) {
          style = styles.cellContainer;
          break;
        }
      }
    }
    const startTime = moment(apptGridSettings.minStartTime, 'HH:mm').add((index * apptGridSettings.step) + 15, 'm').format('HH:mm');
    const timeSplit = startTime.split(':');
    const minutesSplit = timeSplit[1];
    if (minutesSplit === '00') {
      style = [style, styles.oClockBorder];
    }
    return (
      <View key={cell}>
        <TouchableOpacity
          style={[style, { width: cellWidth }]}
          onPress={() => { this.onCellPressed(cell, colData); }}
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

      return (
        <View
          key={`room-${i}`}
          style={{
            position: 'absolute',
            top: startPosition,
            width: 16,
            height: endPosition - startPosition,
            backgroundColor: '#082E66',
            right: 0,
            borderRadius: 3,
            zIndex: 9999,
            // alignItems: 'center',
            // justifyContent: 'center',
          }}
        >
          <Text style={{
            color: 'white',
            transform: [{ rotateX: '90deg' }],
          }}
          >Room {room.roomId}
          </Text>
        </View>
      );
    });
  }

  render() {
    const { rows, showRoomAssignments } = this.props;
    const rooms = showRoomAssignments ? this.renderRooms() : null;
    return (
      <View style={styles.colContainer}>
        { rows.map(this.renderCell) }
        { rooms }
      </View>
    );
  }
}
