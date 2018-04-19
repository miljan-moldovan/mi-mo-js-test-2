import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';

import Column from './column';
import AvailabilityColumn from './availabilityColumn';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default class Board extends Component {
  shouldComponentUpdate() {
    return false;
  }

  renderCol = (col, key) => {
    const { apptGridSettings, rows, cellWidth } = this.props;
    return (
      <Column
        key={key}
        rows={rows}
        colData={col}
        cellWidth={cellWidth}
      />
    );
  }

  render() {
    const { columns, apptGridSettings, rows, timeSchedules, showAvailability } = this.props;
    return (
      <View style={styles.container}>
        { showAvailability ?
          <AvailabilityColumn
            apptGridSettings={apptGridSettings}
            providers={columns}
            timeSchedules={timeSchedules}
          /> : null
        }
        { columns.map(this.renderCol) }
      </View>
    );
  }
}
