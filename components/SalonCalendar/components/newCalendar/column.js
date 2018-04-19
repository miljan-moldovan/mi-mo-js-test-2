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
    width: 130,
    borderColor: '#C0C1C6',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  cellContainerDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 130,
    borderColor: '#C0C1C6',
    backgroundColor: '#ccc',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});

export default class Column extends Component {
  onCellPressed = (cellId) => {
    Alert.alert(`Pressed ${cellId}`);
  }

  renderCell = (cell) => {
    const { apptGridSettings, colData } = this.props;
    const time = moment(cell, 'HH:mm A');
    let style = styles.cellContainerDisabled;
    const { schedule } = colData;
    if (schedule) {
      for (let i = 0; i < schedule.length; i += 1) {
        if (time.isSameOrAfter(moment(schedule[i].start, 'HH:mm')) &&
        time.isBefore(moment(schedule[i].end, 'HH:mm'))) {
          style = styles.cellContainer;
          break;
        }
      }
    }
    return (
      <View key={cell}>
        <TouchableOpacity
          style={style}
          onPress={() => { this.onCellPressed(cell); }}
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
