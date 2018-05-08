import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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

  renderCell = (cell, index) => {
    const { apptGridSettings, colData, cellWidth, isDate, providerSchedule } = this.props;
    const time = moment(cell, 'HH:mm A');
    let style = styles.cellContainerDisabled;
    let schedule;
    if (isDate) {
      schedule = providerSchedule[colData.format('YYYY-MM-DD')][0];
      schedule = schedule ? schedule.scheduledIntervals : null;
    } else {
      schedule = colData.scheduledIntervals;
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

  render() {
    const { rows } = this.props;
    return (
      <View style={styles.colContainer}>
        { rows.map(this.renderCell) }
      </View>
    );
  }
}
