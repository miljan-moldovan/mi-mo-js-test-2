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
    const { apptGridSettings, rows } = this.props;
    return (
      <Column
        key={key}
        rows={rows}
        colData={col}
      />
    );
  }

  render() {
    const { columns, apptGridSettings, rows, timeSchedules } = this.props;
    return (
      <View style={styles.container}>
        <AvailabilityColumn
          apptGridSettings={apptGridSettings}
          providers={columns}
          timeSchedules={timeSchedules}
        />
        { columns.map(this.renderCol) }
      </View>
    );
  }
}
